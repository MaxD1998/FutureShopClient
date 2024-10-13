import { PurchaseListItemDto } from './purchase-list-item.dto';

export interface PurchaseListDto {
  id: string;
  isFavourite: boolean;
  name: string;
  purchaseListItems: PurchaseListItemDto[];
  userId?: string;
}
