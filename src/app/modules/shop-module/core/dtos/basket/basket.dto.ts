import { BasketItemDto } from './basket-item.dto';

export interface BasketDto {
  basketItems: BasketItemDto[];
  id: string;
}
