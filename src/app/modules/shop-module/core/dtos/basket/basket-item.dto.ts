export interface BasketItemDto {
  id: string;
  productFileId?: string;
  productId: string;
  productIsInPurchaseList: boolean;
  productName: string;
  productPrice: number;
  quantity: number;
}
