import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { IdFileDto } from '../../../../../core/dtos/id-file.dto';
import { FilePublicDataService } from '../../../../../core/public-data-services/file.public-data-service';
import { AdCampaignDto } from '../../dtos/ad-campaign/ad-campaign.dto';
import { AdCampaignPublicDataService } from '../../public-data-services/ad-campaign.public-data-service';

export const adResolver: ResolveFn<AdCampaignDto & IdFileDto> = (route, state) => {
  const adCampaignPublicDataService = inject(AdCampaignPublicDataService);
  const filePublicDataService = inject(FilePublicDataService);
  const id = route.params['id'];

  return adCampaignPublicDataService.getActualById(id).pipe(
    switchMap(value => {
      return filePublicDataService.getById(value.fileId).pipe(
        map(blob => URL.createObjectURL(blob)),
        map(url => {
          return { ...value, file: url };
        }),
      );
    }),
  );
};
