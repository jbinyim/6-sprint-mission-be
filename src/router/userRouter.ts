import express from "express";
import userController from "../controllers/userController";

const userRouter = express.Router();

userRouter.post("/signUp", userController.createUser);
userRouter.post("/login", userController.login);
userRouter.post("/token/refresh", userController.refreshAccessToken);

export default userRouter;
