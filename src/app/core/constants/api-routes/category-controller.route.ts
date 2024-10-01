import { environment } from '../../../../environments/environment';

export class CategoryControllerRoute {
  public static readonly base = `${environment.api}Category/`;

  public static readonly all = this.base + 'All/';
  public static readonly availableToBeChild = this.base + 'AvailableToBeChild/';
  public static readonly availableToBeParent = this.base + 'AvailableToBeParent/';
  public static readonly categoryParentId = this.base + 'CategoryParentId/';
  public static readonly idName = this.base + 'IdName/';
  public static readonly page = this.base + 'Page/';
}
