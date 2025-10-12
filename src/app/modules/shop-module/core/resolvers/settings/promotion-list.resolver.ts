import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { PageDto } from '../../../../../core/dtos/page.dto';
import { PromotionDataService } from '../../data-services/promotion.data-service';
import { PromotionListDto } from '../../dtos/promotion/promotion-list.dto';

export const promotionListResolver: ResolveFn<PageDto<PromotionListDto>> = (route, state) => {
  return inject(PromotionDataService).getPage(route.params['pageNumber'] ?? 1);
};
