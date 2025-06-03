import { ProductParameterValueFormDto } from './product-parameter-value.form-dto';
import { TranslationFormDto } from './translation.form-dto';

export interface ProductFormDto {
  isActive: boolean;
  name: string;
  price: number;
  productBaseId: string;
  productParameterValues: ProductParameterValueFormDto[];
  translations: TranslationFormDto[];
}
