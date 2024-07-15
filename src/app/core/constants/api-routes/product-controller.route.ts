import { environment } from '../../../../environments/environment';

export class ProductControllerRoute {
  public static readonly base = `${environment.api}Product/`;

  public static readonly page = this.base + 'Page/';
}
