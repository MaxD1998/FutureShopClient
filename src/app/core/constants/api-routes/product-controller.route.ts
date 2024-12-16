import { environment } from '../../../../environments/environment';

export class ProductControllerRoute {
  public static readonly productModule = `${environment.api}ProductModule/Product/`;
  public static readonly shopModule = `${environment.api}ShopModule/Product/`;

  public static readonly details = `${this.shopModule}Details/`;
  public static readonly page = `${this.productModule}Page/`;
  public static readonly shopList = `${this.shopModule}ShopList/`;
}
