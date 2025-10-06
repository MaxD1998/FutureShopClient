import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { PromotionDataService } from '../data-services/promotion.data-service';
import { PromotionResponseFormDto } from '../dtos/promotion/promotion.response-form-dto';

export const promotionFormResolver: ResolveFn<PromotionResponseFormDto | undefined> = (route, state) => {
  const promotionDataService = inject(PromotionDataService);
  const id = route.params['id'];

  if (id) {
    return promotionDataService.getById(id);
  }

  return of(undefined);
};
