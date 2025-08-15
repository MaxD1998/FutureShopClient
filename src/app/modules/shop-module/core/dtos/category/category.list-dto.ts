export interface CategoryListDto {
  id: string;
  name: string;
  subCategories: CategoryListDto[];
  parentCategoryId?: string;
}
