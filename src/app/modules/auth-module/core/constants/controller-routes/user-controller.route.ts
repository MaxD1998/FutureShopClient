import { environment } from '../../../../../../environments/environment';

export class UserControllerRoute {
  public static readonly base = `${environment.api}AuthModule/User/`;

  public static readonly page = this.base + 'Page/';
  public static readonly ownAccount = this.base + 'Own/Account/';
  public static readonly ownBasicInfo = this.base + 'Own/BasicInfo/';
  public static readonly ownPassword = this.base + 'Own/Password/';
}
