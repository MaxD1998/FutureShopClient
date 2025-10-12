import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { FileDataService } from '../../../../../core/data-services/file.data-service';
import { AdCampaignDataService } from '../../data-services/ad-campaign.data-service';
import { AdCampaignItemInfoDto } from '../../dtos/ad-campaign/ad-campaign-item.info-dto';
import { AdCampaignRequestFormDto } from '../../dtos/ad-campaign/ad-campaign.request-form-dto';

export const adCampaignFormResolver: ResolveFn<{
  adCampaign?: AdCampaignRequestFormDto;
  files: AdCampaignItemInfoDto[];
}> = (route, state) => {
  const id = route.params['id'];
  const adCampaignDataService = inject(AdCampaignDataService);
  const fileDataService = inject(FileDataService);
  const translateService = inject(TranslateService);

  if (id) {
    return adCampaignDataService.getById(id).pipe(
      switchMap(response => {
        return forkJoin({
          adCampaign: of(response),
          files:
            response.adCampaignItems.length > 0
              ? fileDataService.getListInfoByIds(response.adCampaignItems.map(x => x.fileId)).pipe(
                  map(files => {
                    return files
                      .filter(x => response.adCampaignItems.some(item => item.fileId == x.id))
                      .map(file => {
                        const adCampaignItem = response.adCampaignItems.find(x => x.fileId == file.id)!;

                        return {
                          ...file,
                          lang: translateService.instant(`common.languages.${adCampaignItem.lang}`),
                        };
                      });
                  }),
                )
              : of([]),
        });
      }),
    );
  }

  return of({ adCampaign: undefined, files: [] });
};
