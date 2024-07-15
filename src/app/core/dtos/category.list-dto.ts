export interface CategoryListDto {
  id: string;
  name: string;
  hasSubCategories: boolean;
  parentCategoryId?: string;
}
