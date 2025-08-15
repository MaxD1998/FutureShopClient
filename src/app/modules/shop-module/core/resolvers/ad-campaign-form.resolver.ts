import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin, of, switchMap } from 'rxjs';
import { FileDataService } from '../../../../core/data-services/file.data-service';
import { FileDto } from '../../../../core/dtos/file.dto';
import { AdCampaignDataService } from '../data-services/ad-campaign.data-service';
import { AdCampaignRequestFormDto } from '../dtos/ad-campaign/ad-campaign.request-form-dto';

export const adCampaignFormResolver: ResolveFn<{ adCampaign?: AdCampaignRequestFormDto; files: FileDto[] }> = (
  route,
  state,
) => {
  const id = route.params['id'];
  const adCampaignDataService = inject(AdCampaignDataService);
  const fileDataService = inject(FileDataService);

  if (id) {
    return adCampaignDataService.getById(id).pipe(
      switchMap(response => {
        return forkJoin({
          adCampaign: of(response),
          files:
            response.adCampaignItems.length > 0
              ? fileDataService.getListInfoByIds(response.adCampaignItems.map(x => x.fileId))
              : of([]),
        });
      }),
    );
  }

  return of({ adCampaign: undefined, files: [] });
};
