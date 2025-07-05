import { SimulatePriceFormDto } from './simulate-price.form-dto';

export interface SimulatePriceRequestDto {
  collection: SimulatePriceFormDto[];
  element: SimulatePriceFormDto;
  productId?: string;
}
