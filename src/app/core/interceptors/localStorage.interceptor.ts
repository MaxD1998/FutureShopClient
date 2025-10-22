import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LocalStorageConst } from '../constants/localstorage/localstorage.const';

export const localStorageInterceptor: HttpInterceptorFn = (req, next) => {
  const codesStr = localStorage.getItem(LocalStorageConst.codes) ?? '';
  const favouriteId = localStorage.getItem(LocalStorageConst.purchaseListId) ?? '';
  const lang = localStorage.getItem(LocalStorageConst.currentLang) ?? environment.defaultLang;

  req = req.clone({
    setHeaders: {
      Codes: codesStr,
      FavouriteId: favouriteId,
      Lang: lang,
    },
  });

  return next(req);
};
