import { User } from "@prisma/client";
import { CreateUserDto, LoginDto } from "../dtos/user.dto";
import userRepository from "../repositories/userRepository";
import { AppError } from "../utils/AppError";
import bcrypt from "bcrypt";

const fillterSensitiveData = (user: User) => {
  const { password, refreshToken, ...rest } = user;
  return rest;
};

const checkPassword = async (
  inputPassword: string,
  hashedPassword: NonNullable<User["password"]>
) => {
  const isMatch = await bcrypt.compare(inputPassword, hashedPassword);

  if (!isMatch) {
    throw new AppError("비밀번호가 일치하지 않습니다", 401);
  }
};

const createUser = async (
  user: Pick<User, "email" | "nickname" | "password">
) => {
  try {
    const existedUser = await userRepository.findByEmail(user.email);

    if (existedUser) {
      throw new AppError("이미 존재하는 이메일입니다.", 422);
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const createdUser = await userRepository.save({
      ...user,
      password: hashedPassword,
    });

    return fillterSensitiveData(createdUser);
  } catch (e) {
    const customError = new AppError(
      "데이버베이스 작업 중 오류가 발생했습니다."
    );
    customError.code = 500;
    throw customError;
  }
};

const login = async (user: Pick<User, "email" | "password">) => {
  const checkUser = await userRepository.findByEmail(user.email);
  if (!checkUser) {
    throw new AppError("존재하지 않는 이메일입니다", 401);
  }

  await checkPassword(user.password, checkUser.password);

  return fillterSensitiveData(checkUser);
};

const updateUser = async (
  id: User["id"],
  data: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
) => {
  const updatedUser = await userRepository.update(id, data);
  return fillterSensitiveData(updatedUser);
};

export default { createUser, login, updateUser };
