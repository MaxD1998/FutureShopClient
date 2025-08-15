import { PurchaseListItemFormDto } from './purchase-list-item.from-dto';

export interface PurchaseListRequestFormDto {
  isFavourite: boolean;
  name?: string;
  purchaseListItems: PurchaseListItemFormDto[];
}
