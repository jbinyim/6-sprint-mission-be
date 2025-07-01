export type CreateItemDto = {
  name: string;
  description: string;
  price: number;
  ownerId: string;
  tags: string[];
  imgUrls: string[];
};
