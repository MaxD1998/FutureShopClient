import { environment } from '../../../../../../environments/environment';

export class PromotionControllerRoute {
  public static readonly base = `${environment.api}ShopModule/Promotion/`;

  public static readonly actualCodes = `${this.base}ActualCodes/`;
  public static readonly page = `${this.base}Page/`;
}
