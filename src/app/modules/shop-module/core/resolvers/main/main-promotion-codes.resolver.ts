import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { tap } from 'rxjs';
import { LocalStorageConst } from '../../../../../core/constants/localstorage/localstorage.const';
import { PromotionPublicDataService } from '../../public-data-services/promotion.public-data-service';

export const mainPromotionCodesResolver: ResolveFn<string[]> = (route, state) => {
  return inject(PromotionPublicDataService)
    .getActualCodes()
    .pipe(
      tap(codes => {
        localStorage.setItem(LocalStorageConst.codes, JSON.stringify(codes));
      }),
    );
};
