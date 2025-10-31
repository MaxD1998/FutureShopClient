import { environment } from '../../../../../../environments/environment';

export class AdCampaignControllerRoute {
  public static readonly base = `${environment.api}ShopModule/AdCampaign/`;

  public static readonly all = `${this.base}All/`;
  public static readonly page = `${this.base}Page/`;
}
