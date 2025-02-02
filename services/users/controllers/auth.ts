import jwt from "jsonwebtoken";
import { CustomRequest, Subjects } from "@taskly/shared";
import User from "../models/userModel";
import { correctPassword, hashPassword } from "../utils/utils";
import catchAsync from "@taskly/shared/build/utils/catchAsync";
import AppError from "@taskly/shared/build/utils/appError";
import UsersPublisher from "../events/usersPublisher";
import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import { Op } from "sequelize";

interface UserCreatedPayload {
  email: string;
  name: string;
}
export interface Event<TPayload = unknown> {
  type: string;
  payload: TPayload;
}

const signToken = (id: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: 24 * 60 * 60 * 1000,
  });
};
const createSendToken = (
  user: User,
  statusCode: number,
  req: Request,
  res: Response
) => {
  const token = signToken(user.id.toString());
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  // Set the cookie
  res.cookie("jwt", token, cookieOptions);
  req.session = {
    jwt: token,
    name: user.name,
    email: user.email,
  };
  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    name: user.name,
    userId: user.id,
  });
};
interface UserCreatedPayload {
  email: string;
  name: string;
}
interface UserDeletedPayload {
  email: string;
  name: string;
}

interface JwtDecoded {
  id: string;
}
export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { password, confirmPassword, name, email } = req.body;
    if (!password || !confirmPassword || !name || !email) {
      return next(new AppError("All fields are required", 400));
    }

    if (password !== confirmPassword)
      return next(new AppError("Passwords does not match!", 400));

    const hashedPassword = (await hashPassword(password)) as string;
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    const publisher = new UsersPublisher<UserCreatedPayload>(
      process.env.AWS_SNS_TOPIC_ARN_USEREVENTS!,
      Subjects.USER_CREATED
    );

    await publisher.publish({
      type: Subjects.USER_CREATED,
      payload: {
        email: newUser.email,
        name: newUser.name,
      },
    });
    createSendToken(newUser, 201, req, res);
  }
);
export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email) return next(new AppError("Please provide an email!", 400));
    if (!password)
      return next(new AppError("Please provide an password!", 400));
    const curUser = await User.findOne({ where: { email: email } });

    if (
      !curUser ||
      !(await correctPassword(password, curUser.password as string))
    ) {
      return next(new AppError(`Incorrect email or password!`, 400));
    }

    createSendToken(curUser, 200, req, res);
  }
);
export const updatePassword = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const user = await User.findOne({ where: { id: req.user?.id } });
    if (!user) return next(new AppError("No user found!", 404));
    const { currentPassword, newPassword, newConfirmPassword } = req.body;
    if (!currentPassword)
      return next(new AppError("Please include your current password", 401));
    if (!newPassword)
      return next(new AppError("Please include a new password", 401));
    if (!newConfirmPassword)
      return next(new AppError("Please confirm your new password", 401));
    if (newPassword !== newConfirmPassword)
      return next(new AppError("Passwords do not match", 401));
    if (!(await correctPassword(currentPassword, user.password as string))) {
      return next(new AppError("Incorrect password. Please try again!", 401));
    }
    user.password = await hashPassword(newPassword);

    user.confirmPassword = newConfirmPassword;
    await user.save();
    createSendToken(user, 200, req, res);
  }
);
export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    if (!email) return next(new AppError("Please provide email!", 401));
    const user = await User.findOne({ where: { email } });
    if (!user)
      return next(new AppError("No user found with this email address!", 404));
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/users/resetPassword/${resetToken}`;

    const message = `\n If you forgot your password submit a PATCH request with your new password to this link ${resetURL},\nIf you don't, Please ignore this message`;
    res.status(200).json({
      status: "success",
      message,
    });
    next();
  }
);

export const resetPassword = catchAsync(
  async (req: CustomRequest, res, next) => {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { [Op.gt]: Date.now() },
      },
    });
    if (!user)
      return next(new AppError("Token is invalid or has expired", 400));
    const { password, confirmPassword } = req.body;
    const hashedPassword = await hashPassword(password);
    if (!hashedPassword) {
      return next(new AppError("Password hashing failed", 500));
    }
    user.password = hashedPassword;
    user.confirmPassword = confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    createSendToken(user, 200, req, res);
  }
);
export const validateToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ status: "fail", message: "No token provided" });
    }
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtDecoded;
    const user = await User.findOne({ where: { id: decoded.id } });

    if (!user) {
      return res
        .status(401)
        .json({ status: "fail", message: "User not found" });
    }
    user.password = undefined;
    createSendToken(user, 200, req, res);
  }
);

export const deleteMe = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const user = await User.findOne({ where: { id: req.user?.id } });
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    const publisher = new UsersPublisher<UserDeletedPayload>(
      process.env.AWS_SNS_TOPIC_ARN_USEREVENTS!,
      Subjects.USER_CREATED
    );
    publisher.publish({
      type: Subjects.USER_DELETED,
      payload: {
        email: user.email,
        name: user.name,
      },
    });
    await user.destroy();
    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);
export const logout = catchAsync(async (req: Request, res: Response) => {
  res
    .status(200)
    .cookie("jwt", "loggedout", {
      expires: new Date(Date.now() + 1000),
      httpOnly: true,
    })
    .json({ status: "success" });
});
