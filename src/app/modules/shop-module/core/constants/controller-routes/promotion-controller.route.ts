import { environment } from '../../../../../../environments/environment';

export class PromotionControllerRoute {
  public static readonly base = `${environment.api}ShopModule/Promotion/`;

  //For public
  public static readonly actualCodes = `${this.base}ActualCodes/`;

  //For Employee
  public static readonly all = `${this.base}All/`;
  public static readonly page = `${this.base}Page/`;
}
