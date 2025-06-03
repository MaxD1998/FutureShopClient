import { environment } from '../../../../../../environments/environment';

export class CategoryControllerRoute {
  public static readonly base = `${environment.api}ProductModule/Category/`;

  public static readonly all = this.base + 'All/';
  public static readonly categoryParentId = this.base + 'CategoryParentId/';
  public static readonly idName = this.base + 'IdName/';
  public static readonly page = this.base + 'Page/';
  public static readonly potentialParentCategories = this.base + 'PotentialParentCategories/';
  public static readonly potentialSubcategories = this.base + 'PotentialSubcategories/';
}
