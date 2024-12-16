import { environment } from '../../../../environments/environment';

export class CategoryControllerRoute {
  public static readonly productModule = `${environment.api}ProductModule/Category/`;
  public static readonly shopModule = `${environment.api}ShopModule/Category/`;

  public static readonly all = `${this.productModule}All/`;
  public static readonly availableToBeChild = `${this.productModule}AvailableToBeChild/`;
  public static readonly availableToBeParent = `${this.productModule}AvailableToBeParent/`;
  public static readonly categoryParentId = `${this.shopModule}CategoryParentId/`;
  public static readonly idName = `${this.shopModule}IdName/`;
  public static readonly page = `${this.productModule}Page/`;
}
