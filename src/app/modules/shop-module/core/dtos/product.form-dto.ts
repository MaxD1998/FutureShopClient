import { ProductParameterValueFormDto } from './product-parameter-value.form-dto';
import { ProductTranslationFormDto } from './product-translation.form-dto';

export interface ProductFormDto {
  description: string;
  isActive: boolean;
  name: string;
  price: number;
  productBaseId: string;
  productParameterValues: ProductParameterValueFormDto[];
  translations: ProductTranslationFormDto[];
}
