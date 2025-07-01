import express from "express";
import { upload } from "../middlewares/upload";
import itemController from "../controllers/itemController";

const itemRouter = express.Router();

// 이미지를  최대 3개까지 업로드 가능
itemRouter.post(
  "/createItem",
  upload.array("images", 3),
  itemController.createItem
);

export default itemRouter;
