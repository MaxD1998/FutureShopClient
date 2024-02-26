export class AuthControllerRoute {
  private static readonly _base = 'Auth/';

  public static readonly login = this._base + 'Login';
  public static readonly logout = this._base + 'Logout';
  public static readonly refreshToken = this._base + 'RefreshToken';
  public static readonly register = this._base + 'Register';
}
