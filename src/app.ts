import "dotenv/config";
import express from "express";
import router from "./router/indexRouter";
import errorHandler from "./middlewares/errorHandler";
import cors from "cors";
import cookieParser from "cookie-parser";

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

app.use(router);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
