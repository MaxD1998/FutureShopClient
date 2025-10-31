import { environment } from '../../../../../../environments/environment';

export class CategoryPublicControllerRoute {
  public static readonly base = `${environment.api}ShopModule/CategoryPublic/`;

  public static readonly activeIdName = this.base + 'Active/IdName/';
  public static readonly activeList = this.base + 'Active/List/';
}
