import jwt from "jsonwebtoken";

export const generateTestToken = (): string => {
  const payload = { id: "test-user-auth", email: "user-auth@taskly.com" };
  return `Bearer ${jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  })}`;
};
