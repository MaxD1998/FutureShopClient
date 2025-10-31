import { environment } from '../../../../environments/environment';

export class FileControllerRoute {
  public static readonly base = `${environment.api}FileModule/File/`;

  public static readonly info = this.base + 'Info/';
}
