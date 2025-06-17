export type CreateUserDto = {
  email: string;
  nickname: string;
  password: string;
};

export type LoginDto = {
  email: string;
  password: string;
};
