import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin, of, switchMap } from 'rxjs';
import { AdCampaignItemDataService } from '../data-services/ad-campaign-item.data-service';
import { AdCampaignDataService } from '../data-services/ad-campaign.data-service';
import { AdCampaignItemInfoDto } from '../dtos/ad-campaign-item.info-dto';
import { AdCampaignFormDto } from '../dtos/ad-campaign.form-dto';

export const adCampaignFormResolver: ResolveFn<{ adCampaign?: AdCampaignFormDto; files: AdCampaignItemInfoDto[] }> = (
  route,
  state,
) => {
  const id = route.params['id'];
  const adCampaignDataService = inject(AdCampaignDataService);
  const adCampaignItemDataService = inject(AdCampaignItemDataService);

  if (id) {
    return adCampaignDataService.getById(id).pipe(
      switchMap(response => {
        return forkJoin({
          adCampaign: of(response),
          files:
            response.adCampaignItems.length > 0
              ? adCampaignItemDataService.getListInfoByIds(response.adCampaignItems.map(x => x.fileId))
              : of([]),
        });
      }),
    );
  }

  return of({ adCampaign: undefined, files: [] });
};
