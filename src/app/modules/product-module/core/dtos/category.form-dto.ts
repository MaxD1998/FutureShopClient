import { IdNameDto } from '../../../../core/dtos/id-name.dto';

export interface CategoryFormDto {
  name: string;
  parentCategoryId?: string;
  subCategories: IdNameDto[];
}
