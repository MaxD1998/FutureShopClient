export interface AsideItemModel {
  id: string;
  name: string;
  parentId?: string;
  subCategories: AsideItemModel[];
  link: string;
}
