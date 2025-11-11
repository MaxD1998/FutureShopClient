import { environment } from '../../../../environments/environment';

export class AuthorizationControllerRoute {
  private static readonly _base = `${environment.api}AuthModule/Authorization/`;

  //For public
  public static readonly login = this._base + 'Login';
  public static readonly refreshToken = this._base + 'RefreshToken';
  public static readonly register = this._base + 'Register';

  //For authorized
  public static readonly logout = this._base + 'Logout';
}
