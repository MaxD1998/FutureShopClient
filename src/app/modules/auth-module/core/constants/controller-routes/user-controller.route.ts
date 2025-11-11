import { environment } from '../../../../../../environments/environment';

export class UserControllerRoute {
  public static readonly base = `${environment.api}AuthModule/User/`;

  public static readonly page = this.base + 'page';
}
