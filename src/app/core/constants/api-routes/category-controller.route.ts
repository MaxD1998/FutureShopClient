import { environment } from '../../../../environments/environment';

export class CategoryControllerRoute {
  private static readonly _base = `${environment.api}Category/`;

  public static readonly categoryParentId = this._base + 'CategoryParentId/';
}
