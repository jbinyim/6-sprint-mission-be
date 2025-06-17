import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

export const createToken = (
  user: Omit<User, "password" | "refreshToken">,
  type?: "access" | "refresh"
) => {
  const payload = { userId: user.id };
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: type === "refresh" ? "2w" : "1h",
  });

  return token;
};
