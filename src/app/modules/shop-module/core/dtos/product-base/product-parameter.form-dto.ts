import { TranslationFormDto } from '../translation.form-dto';

export interface ProductParameterFormDto {
  id?: string;
  name: string;
  translations: TranslationFormDto[];
}
