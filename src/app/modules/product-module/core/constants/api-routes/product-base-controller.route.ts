import { environment } from '../../../../../../environments/environment';

export class ProductBaseControllerRoute {
  public static readonly base = `${environment.api}ProductModule/ProductBase/`;

  public static readonly all = this.base + 'All/';
  public static readonly idNameById = this.base + 'IdNameById/';
  public static readonly page = this.base + 'Page/';
}
