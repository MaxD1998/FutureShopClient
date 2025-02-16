import { PurchaseListItemDto } from '../dtos/purchase-list-item.dto';

export class PurchaseListItemModel {
  constructor(dto: PurchaseListItemDto, photo?: Blob) {
    this.id = dto.id;
    this.productId = dto.productId;
    this.productName = dto.productName;
    this.productPhoto = photo ? URL.createObjectURL(photo) : '';
    this.purchaseListId = dto.purchaseListId;
  }

  id: string;
  productId: string;
  productName: string;
  productPhoto: string;
  purchaseListId: string;
}
