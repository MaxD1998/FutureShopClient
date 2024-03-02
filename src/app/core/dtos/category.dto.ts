export interface CategoryDto {
  id: string;
  name: string;
  hasChildren: boolean;
  parentCategoryId: string | null;
}
