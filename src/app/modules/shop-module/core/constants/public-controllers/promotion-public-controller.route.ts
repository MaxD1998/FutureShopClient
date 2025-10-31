import { environment } from '../../../../../../environments/environment';

export class PromotionPublicControllerRoute {
  public static readonly base = `${environment.api}ShopModule/PromotionPublic/`;

  public static readonly actualCodes = `${this.base}ActualCodes/`;
}
