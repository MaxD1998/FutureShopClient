export interface BasketItemDto {
  id: string;
  product: {
    fileId?: string;
    id: string;
    isInPurchaseList: boolean;
    name: string;
    originalPrice: number;
    price: number;
  };
  quantity: number;
}
