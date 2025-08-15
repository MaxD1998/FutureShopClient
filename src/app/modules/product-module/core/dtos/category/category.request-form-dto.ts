import { IdNameDto } from '../../../../../core/dtos/id-name.dto';

export interface CategoryRequestFormDto {
  name: string;
  parentCategoryId?: string;
  subCategories: IdNameDto[];
}
