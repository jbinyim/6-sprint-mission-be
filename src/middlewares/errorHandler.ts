import { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  const status = typeof error.code === "number" ? error.code : 400;

  console.log(error);

  let message = error.message ?? "Internal Server Error";
  if (error.code === "LIMIT_UNEXPECTED_FILE") {
    message = "허용되지 않은 파일 필드이거나 파일 개수 초과입니다.";
  }

  res.status(status).json({
    path: req.path,
    method: req.method,
    message,
    data: error.data ?? undefined,
    date: new Date(),
  });
};

export default errorHandler;
