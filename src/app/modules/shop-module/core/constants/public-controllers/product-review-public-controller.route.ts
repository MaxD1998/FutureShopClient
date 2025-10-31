import { environment } from '../../../../../../environments/environment';

export class ProductReviewPublicControllerRoute {
  public static readonly base = `${environment.api}ShopModule/ProductReviewPublic/`;

  public static readonly page = this.base + 'Page/';
}
