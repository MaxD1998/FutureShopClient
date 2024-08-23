import { environment } from '../../../../environments/environment';

export class ProductPhotoControllerRoute {
  public static readonly base = `${environment.api}ProductPhoto/`;

  public static readonly info = this.base + 'Info/';
}