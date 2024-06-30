import { environment } from '../../../../environments/environment';

export class ProductBaseControllerRoute {
  public static readonly base = `${environment.api}ProductBase/`;

  public static readonly page = this.base + 'Page/';
}
