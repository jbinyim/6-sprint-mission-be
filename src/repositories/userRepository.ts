import { User } from "@prisma/client";
import prisma from "../config/prisma";
import { CreateUserDto } from "../dtos/user.dto";

const findByEmail = async (email: User["email"]) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

const save = async (user: CreateUserDto) => {
  return prisma.user.create({
    data: {
      email: user.email,
      nickname: user.nickname,
      password: user.password,
    },
  });
};

const update = async (
  id: User["id"],
  data: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
) => {
  return prisma.user.update({
    where: {
      id,
    },
    data,
  });
};

const findById = async (id: User["id"]) => {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
};

export default { findByEmail, save, update, findById };
