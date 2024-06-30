import { CategoryTranslationFormDto } from './category-translation.form-dto';

export interface CategoryFormDto {
  name: string;
  parentCategoryId?: string;
  translations: CategoryTranslationFormDto[];
  subCategoryIds: string[];
}
