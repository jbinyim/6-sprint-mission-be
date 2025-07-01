import { NextFunction, Request, Response } from "express";
import itemService from "../services/itemService";

const createItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { name, description, price, ownerId, tags } = req.body;

    // tag가 문자열로 오면 배열로 반환
    if (typeof tags === "string") {
      try {
        tags = JSON.parse(tags);
      } catch {
        tags = [tags];
      }
    }

    // 위 처리에도 배열이 아닐경우 대비해서 배열로 보정
    tags = Array.isArray(tags) ? tags : [];

    // multer가 처리한 업로드된 파일들, 타입을 지정해서 자동완성, 타입 안정석 확보, 파일이 없을 경우 빈 배열로 처리
    const files = (req.files as Express.Multer.File[]) || [];

    // 업로드 된 파일들의 경로를 서버에 맞게 만듬 ex) http://localhost:5050/uploads/파일명
    const imgUrls = files.map((file) => `/uploads/${file.filename}`);

    // db에 저장하는 함수
    const item = await itemService.createItem({
      name,
      description,
      price: parseInt(price),
      ownerId,
      tags,
      imgUrls,
    });

    res.status(201).json(item);
  } catch (e) {
    next(e);
  }
};

export default { createItem };
