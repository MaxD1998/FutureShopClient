import { PurchaseListRequestFormDto } from './purchase-list.request-from-dto';

export interface PurchaseListResponseFormDto extends PurchaseListRequestFormDto {
  id: string;
}
