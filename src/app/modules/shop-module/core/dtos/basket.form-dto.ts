import { BasketItemFormDto } from './basket-item.form-dto';

export interface BasketFormDto {
  basketItems: BasketItemFormDto[];
  id?: string;
}
