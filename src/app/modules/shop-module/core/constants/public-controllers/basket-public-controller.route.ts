import { environment } from '../../../../../../environments/environment';

export class BasketPublicControllerRoute {
  public static readonly base = `${environment.api}ShopModule/BasketPublic/`;

  public static readonly importPurchaseList = this.base + 'ImportPurchaseList';
  public static readonly userBasket = this.base + 'UserBasket';
}
