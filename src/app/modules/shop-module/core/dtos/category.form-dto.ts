import { IdNameDto } from '../../../../core/dtos/id-name.dto';
import { TranslationFormDto } from './translation.form-dto';

export interface CategoryFormDto {
  isActive: boolean;
  name: string;
  parentCategoryId?: string;
  subCategories: IdNameDto[];
  translations: TranslationFormDto[];
}
