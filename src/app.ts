import "dotenv/config";
import express from "express";
import router from "./router/indexRouter";
import errorHandler from "./middlewares/errorHandler";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

const PORT = process.env.PORT ?? 5050;

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5050", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(router);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
