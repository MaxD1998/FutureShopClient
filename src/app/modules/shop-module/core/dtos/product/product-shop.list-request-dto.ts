import { ProductSortType } from '../../../../../core/enums/product-sort-type';

export interface ProductShopLisRequestDto {
  name?: string;
  priceFrom?: number;
  priceTo?: number;
  sortType?: ProductSortType;
}
