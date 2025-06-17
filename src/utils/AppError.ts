export class AppError extends Error {
  code: number;
  data?: any;

  constructor(message: string, code: number = 500, data?: any) {
    super(message);
    this.code = code;
    this.data = data;
    this.name = "AppError";
  }
}
