import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { tap } from 'rxjs';
import { LocalStorageConst } from '../../../../../core/constants/localstorage/localstorage.const';
import { PromotionDataService } from '../../data-services/promotion.data-service';

export const mainPromotionCodesResolver: ResolveFn<string[]> = (route, state) => {
  return inject(PromotionDataService)
    .getActualCodes()
    .pipe(
      tap(codes => {
        localStorage.setItem(LocalStorageConst.codes, JSON.stringify(codes));
      }),
    );
};
