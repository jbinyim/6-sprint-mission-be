import express from "express";
import userRouter from "./userRouter";
import itemRouter from "./itemRouter";

const router = express.Router();

router.use("/api", userRouter);
router.use("/api", itemRouter);

export default router;
