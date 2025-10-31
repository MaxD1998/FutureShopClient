import { environment } from '../../../../../../environments/environment';

export class PurchaseListControllerRoute {
  public static readonly base = `${environment.api}ShopModule/PurchaseListPublic/`;
  public static readonly importBasket = `${this.base}ImportBasket/`;
}
