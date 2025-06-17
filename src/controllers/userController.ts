import { NextFunction, Request, Response } from "express";
import { CreateUserDto, LoginDto } from "../dtos/user.dto";
import userService from "../services/userService";
import { AppError } from "../utils/AppError";
import jwt from "../utils/jwt";
import userRepository from "../repositories/userRepository";

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

    const accessToken = jwt.createToken(user);
    const refreshToken = jwt.createToken(user, "refresh");
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

const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 쿠키에 있는 리프레시 토큰 가져옴
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError("refreshToken 이 없습니다", 401);
    }

    // 가져온 토큰이 유효한지 확인 그리고 유저 아이디 가져오기
    const decoded = jwt.verifyToken(refreshToken) as { userId: string };

    if (!decoded) {
      throw new AppError("유효하지 않은 토큰입니다.", 401);
    }

    // 토큰이랑 유저랑 일치한지 확인
    const user = await userRepository.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      throw new AppError(
        "존재하지 않는 유저이거나 토큰이 일치하지 않습니다.",
        401
      );
    }

    // 일치하면 새로운 엑세스 토큰 생성
    const newAccessToken = jwt.createToken(user, "access");

    res.status(200).json({ accessToken: newAccessToken });
  } catch (e) {
    next(e);
  }
};

export default { createUser, login, refreshAccessToken };
