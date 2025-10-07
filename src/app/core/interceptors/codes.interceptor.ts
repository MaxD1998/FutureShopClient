import { HttpInterceptorFn } from '@angular/common/http';
import { LocalStorageConst } from '../constants/localstorage/localstorage.const';

export const codesInterceptor: HttpInterceptorFn = (req, next) => {
  const codesStr = localStorage.getItem(LocalStorageConst.codes);

  if (codesStr) {
    req = req.clone({
      setHeaders: {
        Codes: codesStr,
      },
    });
  }

  return next(req);
};
