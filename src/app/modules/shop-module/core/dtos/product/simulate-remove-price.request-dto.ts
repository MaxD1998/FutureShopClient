import { PriceFormDto } from './price.form-dto';

export interface SimulateRemovePriceRequestDto {
  newCollection: PriceFormDto[];
  oldCollection: PriceFormDto[];
  productId?: string;
}
