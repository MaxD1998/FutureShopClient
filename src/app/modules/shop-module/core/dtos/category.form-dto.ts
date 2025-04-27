import { IdNameDto } from '../../../../core/dtos/id-name.dto';
import { CategoryTranslationFormDto } from './category-translation.form-dto';

export interface CategoryFormDto {
  isActive: boolean;
  name: string;
  parentCategoryId?: string;
  subCategories: IdNameDto[];
  translations: CategoryTranslationFormDto[];
}
