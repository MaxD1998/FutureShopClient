import { environment } from '../../../../../../environments/environment';

export class PermissionGroupControllerRoute {
  public static readonly base = `${environment.api}AuthModule/PermissionGroup/`;

  public static readonly list = this.base + 'list';
  public static readonly page = this.base + 'page';
}
