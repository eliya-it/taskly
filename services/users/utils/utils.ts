import bcrypt from "bcryptjs";
import crypto from "crypto";

interface User {
  passwordResetToken?: string;
  passwordResetExpires?: number;
  save: () => Promise<void>;
}

export const correctPassword = async (
  candidatePassword: string,
  userPassword: string
): Promise<boolean | undefined> => {
  try {
    return await bcrypt.compare(candidatePassword, userPassword);
  } catch (error) {
    console.error("Failed to compare passwords!", error);
    return undefined;
  }
};

export const createPasswordResetToken = async (
  user: User
): Promise<string | undefined> => {
  try {
    const resetToken = crypto.randomBytes(32).toString("hex");

    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    return resetToken;
  } catch (error) {
    console.error("Failed to create password reset token:", error);
    return undefined;
  }
};

export const hashPassword = async (
  password: string
): Promise<string | undefined> => {
  try {
    return await bcrypt.hash(password, 12);
  } catch (error) {
    console.error("Failed to hash password:", error);
    return undefined;
  }
};
