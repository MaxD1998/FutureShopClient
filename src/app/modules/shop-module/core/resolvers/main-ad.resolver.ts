import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { FileDataService } from '../../../../core/data-service/file.data-service';
import { IdFileDto } from '../../../../core/dtos/id-file.dto';
import { AdCampaignDataService } from '../data-services/ad-campaign.data-service';

export const mainAdResolver: ResolveFn<IdFileDto[]> = (route, state) => {
  const adCampaignDataService = inject(AdCampaignDataService);
  const fileDataService = inject(FileDataService);

  return adCampaignDataService.getActual().pipe(
    switchMap(values => {
      return values.length > 0
        ? forkJoin(
            values.map(value => {
              return forkJoin({
                id: of(value.id),
                file: fileDataService.getById(value.fileId).pipe(map(blob => URL.createObjectURL(blob))),
              });
            }),
          )
        : of([]);
    }),
  );
};
