import { environment } from '../../../../environments/environment';

export class ProductParameterControllerRoute {
  public static readonly base = `${environment.api}ProductModule/ProductParameter/`;

  public static readonly productBaseId = `${this.base}ProductBaseId/`;
}
