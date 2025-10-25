import { environment } from '../../../../../../environments/environment';

export class ProductReviewControllerRoute {
  public static readonly base = `${environment.api}ShopModule/ProductReview/`;

  public static readonly page = this.base + 'Page/';
}
