import { PriceFormDto } from './price.form-dto';
import { ProductParameterValueFormDto } from './product-parameter-value.form-dto';
import { TranslationFormDto } from './translation.form-dto';

export interface ProductFormDto {
  isActive: boolean;
  name: string;
  prices: PriceFormDto[];
  productBaseId: string;
  productParameterValues: ProductParameterValueFormDto[];
  translations: TranslationFormDto[];
}
