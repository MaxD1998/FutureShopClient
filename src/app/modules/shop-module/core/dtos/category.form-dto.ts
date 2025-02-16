import { IdNameDto } from '../../../../core/dtos/id-name.dto';
import { CategoryTranslationFormDto } from './category-translation.form-dto';

export interface CategoryFormDto {
  name: string;
  parentCategoryId?: string;
  subCategories: IdNameDto[];
  translations: CategoryTranslationFormDto[];
}
