import { CategoryTranslationFormDto } from './category-translation.form-dto';
import { IdNameDto } from './id-name.dto';

export interface CategoryFormDto {
  name: string;
  parentCategoryId?: string;
  subCategories: IdNameDto[];
  translations: CategoryTranslationFormDto[];
}
