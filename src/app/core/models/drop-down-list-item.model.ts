export interface DropDownListItemModel {
  id: string;
  value: string;
  callback?: (model: DropDownListItemModel) => void;
}
