import { PurchaseListItemDto } from '../dtos/purchase-list-item.dto';
import { PurchaseListDto } from '../dtos/purchase-list.dto';
import { PurchaseListItemModel } from './purchase-list-item.model';

export class PurchaseListModel {
  constructor(dto: PurchaseListDto) {
    this.id = dto.id;
    this.isFavourite = dto.isFavourite;
    this.lastUpdateDate = dto.lastUpdateDate;
    this.name = dto.name;
    this.purchaseListItems = [];
    this.userId = dto.userId;
  }

  id: string;
  isFavourite: boolean;
  lastUpdateDate: Date;
  name: string;
  purchaseListItems: PurchaseListItemModel[];
  userId?: string;

  addPurchaseListItem(dto: PurchaseListItemDto, photo?: Blob): void {
    this.purchaseListItems.push(new PurchaseListItemModel(dto, photo));
  }
}
