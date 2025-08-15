import { TranslationFormDto } from '../translation.form-dto';
import { PriceFormDto } from './price.form-dto';
import { ProductParameterValueFormDto } from './product-parameter-value.form-dto';

export interface ProductRequestFormDto {
  isActive: boolean;
  name: string;
  prices: PriceFormDto[];
  productBaseId: string;
  productParameterValues: ProductParameterValueFormDto[];
  translations: TranslationFormDto[];
}
