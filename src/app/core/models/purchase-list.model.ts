import { PurchaseListItemDto } from '../dtos/purchase-list-item.dto';
import { PurchaseListDto } from '../dtos/purchase-list.dto';
import { PurchaseListItemModel } from './purchase-list-item.model';

export class PurchaseListModel {
  constructor(dto: PurchaseListDto) {
    this.id = dto.id;
    this.isFavourite = dto.isFavourite;
    this.name = dto.name;
    this.userId = dto.userId;
  }

  id: string;
  isFavourite: boolean;
  name: string;
  purchaseListItems: PurchaseListItemModel[];
  userId?: string;

  addPurchaseListItem(dto: PurchaseListItemDto, photo?: Blob): void {
    this.purchaseListItems.push(new PurchaseListItemModel(dto, photo));
  }
}
