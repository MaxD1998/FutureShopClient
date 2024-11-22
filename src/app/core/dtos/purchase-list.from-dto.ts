import { PurchaseListItemFormDto } from './purchase-list-item.from-dto';

export interface PurchaseListFormDto {
  id?: string;
  isFavourite: boolean;
  name?: string;
  purchaseListItems: PurchaseListItemFormDto[];
}
