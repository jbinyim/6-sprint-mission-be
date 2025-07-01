import prisma from "../config/prisma";
import { CreateItemDto } from "../dtos/item.dto";

const createItem = async ({
  name,
  description,
  price,
  ownerId,
  tags,
  imgUrls,
}: CreateItemDto) => {
  return await prisma.item.create({
    data: {
      name,
      description,
      price,
      ownerId,
      tags: {
        create: tags.map((tag) => ({ name: tag })),
        // 1:N 배열로 순회하면서 {name: 태그명} 객체 생성
      },
      imgs: {
        create: (imgUrls ?? []).map((url) => ({ url })),
        // 1:N 관계 업로드된 이미지 url배열을 imgs.create로 한번에 생성
      },
    },
    // 응답 객체에 이미지 데이터도 함께 포함
    include: {
      imgs: true,
    },
  });
};

export default { createItem };
