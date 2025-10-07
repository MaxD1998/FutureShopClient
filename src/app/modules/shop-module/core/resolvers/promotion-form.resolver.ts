import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, map, of } from 'rxjs';
import { SelectItemModel } from '../../../../core/models/select-item.model';
import { AdCampaignDataService } from '../data-services/ad-campaign.data-service';
import { PromotionDataService } from '../data-services/promotion.data-service';
import { PromotionResponseFormDto } from '../dtos/promotion/promotion.response-form-dto';

export const promotionFormResolver: ResolveFn<{
  promotion: PromotionResponseFormDto | undefined;
  adCampaigns: SelectItemModel[];
}> = (route, state) => {
  const adCampaignDataService = inject(AdCampaignDataService);
  const promotionDataService = inject(PromotionDataService);
  const translateService = inject(TranslateService);
  const id = route.params['id'];

  return forkJoin({
    promotion: id ? promotionDataService.getById(id) : of(undefined),
    adCampaigns: adCampaignDataService.getListIdName().pipe(
      map(items =>
        [
          {
            value: translateService.instant('common.input-select.select-option'),
          },
        ].concat(items.map(x => ({ id: x.id, value: x.name }))),
      ),
    ),
  });
};
