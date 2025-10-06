import { environment } from '../../../../../../environments/environment';

export class ProductControllerRoute {
  public static readonly base = `${environment.api}ShopModule/Product/`;

  public static readonly details = this.base + 'Details/';
  public static readonly list = this.base + 'List/';
  public static readonly page = this.base + 'Page/';
  public static readonly shopList = this.base + 'ShopList/';
  public static readonly simulateAddPrice = this.base + 'SimulateAddPrice/';
  public static readonly simulateRemovePrice = this.base + 'SimulateRemovePrice/';
  public static readonly simulateUpdatePrice = this.base + 'SimulateUpdatePrice/';
}
