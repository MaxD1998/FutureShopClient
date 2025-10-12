import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { FileDataService } from '../../../../core/data-services/file.data-service';
import { IdFileDto } from '../../../../core/dtos/id-file.dto';
import { AdCampaignDataService } from '../data-services/ad-campaign.data-service';

export const adResolver: ResolveFn<IdFileDto> = (route, state) => {
  const adCampaignDataService = inject(AdCampaignDataService);
  const fileDataService = inject(FileDataService);
  const id = route.params['id'];

  return adCampaignDataService.getActualById(id).pipe(
    switchMap(value => {
      return forkJoin({
        id: of(value.id),
        file: fileDataService.getById(value.fileId).pipe(map(blob => URL.createObjectURL(blob))),
      });
    }),
  );
};
