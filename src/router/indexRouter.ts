import express from "express";
import userRouter from "./userRouter";

const router = express.Router();

router.use("", userRouter);

export default router;
