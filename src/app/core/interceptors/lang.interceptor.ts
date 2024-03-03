import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LocalStorageConst } from '../constants/localstorage/localstorage.const';

export const langInterceptor: HttpInterceptorFn = (req, next) => {
  const lang = localStorage.getItem(LocalStorageConst.currentLang) ?? environment.defaultLang;

  req = req.clone({
    setHeaders: {
      Lang: lang,
    },
  });

  return next(req);
};
