import { PriceFormDto } from './price.form-dto';

export interface SimulatePriceFormDto extends PriceFormDto {
  fakeId: number;
  isNew: boolean;
}
