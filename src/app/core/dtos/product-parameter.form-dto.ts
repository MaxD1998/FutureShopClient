import { ProductParameterTranslationFormDto } from './product-parameter-translation.form-dto';

export interface ProductParameterFormDto {
  name: string;
  translations: ProductParameterTranslationFormDto[];
}
