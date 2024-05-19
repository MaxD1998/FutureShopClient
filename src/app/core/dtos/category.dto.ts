export interface CategoryDto {
  id: string;
  name: string;
  hasSubCategories: boolean;
  parentCategoryId?: string;
}
