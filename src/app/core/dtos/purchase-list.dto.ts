import { PurchaseListItemDto } from './purchase-list-item.dto';

export interface PurchaseListDto {
  id: string;
  isFavourite: boolean;
  lastUpdateDate: Date;
  name: string;
  purchaseListItems: PurchaseListItemDto[];
  userId?: string;
}
