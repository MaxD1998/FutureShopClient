import { environment } from '../../../../../../environments/environment';

export class AdCampaignPublicControllerRoute {
  public static readonly base = `${environment.api}ShopModule/AdCampaignPublic/`;

  public static readonly actual = `${this.base}Actual/`;
  public static readonly actualById = `${this.base}ActualById/`;
}
