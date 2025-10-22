import { ProductShopListDto } from '../product/product-shop.list-dto';

export interface PromotionDto {
  id: string;
  code: string;
  products: ProductShopListDto[];
}
