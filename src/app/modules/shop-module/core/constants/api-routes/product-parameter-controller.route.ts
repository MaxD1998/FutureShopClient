import { environment } from '../../../../../../environments/environment';

export class ProductParameterControllerRoute {
  public static readonly base = `${environment.api}ShopModule/ProductParameter/`;

  public static readonly productId = this.base + 'ProductId/';
}
