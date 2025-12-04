import { environment } from '../../../../../../environments/environment';

export class UserCompanyDetailsControllerRoute {
  public static readonly base = `${environment.api}ShopModule/UserCompanyDetails/`;

  public static readonly list = `${this.base}List/`;
}
