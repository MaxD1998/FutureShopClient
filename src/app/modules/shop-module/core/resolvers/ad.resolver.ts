import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin, map, switchMap } from 'rxjs';
import { AdCampaignItemDataService } from '../data-services/ad-campaign-item.data-service';
import { AdCampaignDataService } from '../data-services/ad-campaign.data-service';

export const adResolver: ResolveFn<string[]> = (route, state) => {
  const adCampaignItemDataService = inject(AdCampaignItemDataService);

  return inject(AdCampaignDataService)
    .getActual()
    .pipe(
      switchMap(dto =>
        forkJoin(
          dto.fileIds.map(x => adCampaignItemDataService.getById(x).pipe(map(blob => URL.createObjectURL(blob)))),
        ),
      ),
    );
};
