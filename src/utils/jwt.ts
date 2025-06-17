import { User } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AppError } from "./AppError";

const JWT_SECRET = process.env.JWT_SECRET!;

const createToken = (
  user: Omit<User, "password" | "refreshToken">,
  type?: "access" | "refresh"
) => {
  const payload = { userId: user.id };
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: type === "refresh" ? "2w" : "1h",
  });

  return token;
};

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError("Invalid token", 401);
    }
    throw error;
  }
};

export default { createToken, verifyToken };
