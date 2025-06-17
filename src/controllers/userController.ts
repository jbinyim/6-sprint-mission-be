import { NextFunction, Request, Response } from "express";
import { CreateUserDto, LoginDto } from "../dtos/user.dto";
import userService from "../services/userService";
import { AppError } from "../utils/AppError";
import { createToken } from "../utils/jwt";

const createUser = async (
  req: Request<{}, {}, CreateUserDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, nickname, password } = req.body;

    if (!email || !nickname || !password) {
      throw new AppError("email, nickname, password 가 모두 필요합니다", 422);
    }

    const user = await userService.createUser({ email, nickname, password });

    res.status(201).json(user);
  } catch (e) {
    next(e);
  }
};

const login = async (
  req: Request<{}, {}, LoginDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("email, password 가 모두 필요합니다", 422);
    }

    const user = await userService.login({ email, password });

    const accessToken = createToken(user);
    const refreshToken = createToken(user, "refresh");
    await userService.updateUser(user.id, { refreshToken });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.status(200).json({ ...user, accessToken });
  } catch (e) {
    next(e);
  }
};

export default { createUser, login };
