import { environment } from '../../../../../../environments/environment';

export class UserDeliveryAddressControllerRoute {
  public static readonly base = `${environment.api}ShopModule/UserDeliveryAddress/`;

  public static readonly list = `${this.base}List/`;
}
