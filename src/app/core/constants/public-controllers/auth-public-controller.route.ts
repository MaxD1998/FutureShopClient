import { environment } from '../../../../environments/environment';

export class AuthorizationPublicControllerRoute {
  private static readonly _base = `${environment.api}AuthModule/AuthorizationPublic/`;

  public static readonly login = this._base + 'Login';
  public static readonly logout = this._base + 'Logout';
  public static readonly refreshToken = this._base + 'RefreshToken';
  public static readonly register = this._base + 'Register';
}
