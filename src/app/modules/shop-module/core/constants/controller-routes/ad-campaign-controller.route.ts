import { environment } from '../../../../../../environments/environment';

export class AdCampaignControllerRoute {
  public static readonly base = `${environment.api}ShopModule/AdCampaign/`;

  //For public
  public static readonly actual = `${this.base}Actual/`;
  public static readonly actualById = `${this.base}ActualById/`;

  //For Employee
  public static readonly all = `${this.base}All/`;
  public static readonly page = `${this.base}Page/`;
}
