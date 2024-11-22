import { ProductParameterTranslationFormDto } from './product-parameter-translation.form-dto';

export interface ProductParameterFormDto {
  id?: string;
  name: string;
  translations: ProductParameterTranslationFormDto[];
}
