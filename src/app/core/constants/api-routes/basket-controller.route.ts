import { environment } from '../../../../environments/environment';

export class BasketControllerRoute {
  public static readonly base = `${environment.api}Basket/`;

  public static readonly importPurchaseList = this.base + 'ImportPurchaseList';
  public static readonly userBasket = this.base + 'UserBasket';
}
