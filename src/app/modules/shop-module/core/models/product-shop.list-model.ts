import { ProductShopListDto } from '../dtos/product/product-shop.list-dto';

export class ProductListModel {
  constructor(dto: ProductShopListDto) {
    this.image = { fileId: dto.fileId };
    this.id = dto.id;
    this.isInPurchaseList = dto.isInPurchaseList;
    this.name = dto.name;
    this.price = dto.price;
  }

  image: { fileId?: string; image?: string };
  id: string;
  isInPurchaseList: boolean;
  name: string;
  price: number;
}
