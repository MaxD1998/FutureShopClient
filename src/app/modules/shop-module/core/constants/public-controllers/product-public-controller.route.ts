import { environment } from '../../../../../../environments/environment';

export class ProductPublicControllerRoute {
  public static readonly base = `${environment.api}ShopModule/ProductPublic/`;

  public static readonly details = this.base + 'Details/';
  public static readonly shopList = this.base + 'ShopList/';
}
