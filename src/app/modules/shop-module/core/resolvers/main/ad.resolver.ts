import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { FileDataService } from '../../../../../core/data-service/file.data-service';
import { IdFileDto } from '../../../../../core/dtos/id-file.dto';
import { AdCampaignDataService } from '../../data-services/ad-campaign.data-service';
import { AdCampaignDto } from '../../dtos/ad-campaign/ad-campaign.dto';

export const adResolver: ResolveFn<AdCampaignDto & IdFileDto> = (route, state) => {
  const adCampaignDataService = inject(AdCampaignDataService);
  const fileDataService = inject(FileDataService);
  const id = route.params['id'];

  return adCampaignDataService.getActualById(id).pipe(
    switchMap(value => {
      return fileDataService.getById(value.fileId).pipe(
        map(blob => URL.createObjectURL(blob)),
        map(url => {
          return { ...value, file: url };
        }),
      );
    }),
  );
};
