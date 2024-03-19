export interface AsideItemModel {
  id: string;
  name: string;
  parentId: string | null;
  hasChildren: boolean;
}
