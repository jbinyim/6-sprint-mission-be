import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// multer: 파일 업로드를 도와주는 미들웨어
// path: 파일 경로나 확장자 등을 다룰 떄 사용, node.js 내장 모듈
// uuid: 고유한 식별자를 만들어주는 라이브러리

// 파일을 서버에 저장할때 옵션을 설정하는 함수
const storage = multer.diskStorage({
  // 업로드된 파일이 저장될 폴더를 지정
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  // 저장될 파일의 이름을 지정
  filename: (req, file, cb) => {
    // 확장자만 추출
    const ext = path.extname(file.originalname);
    // 고유이름을 지정한뒤 확장자를 붙여 파일이름 생성
    cb(null, `${uuidv4()}${ext}`);
  },
});

export const upload = multer({ storage });
