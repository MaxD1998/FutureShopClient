import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { IdFileDto } from '../../../../core/dtos/id-file.dto';
import { FilePublicDataService } from '../../../../core/public-data-services/file.public-data-service';
import { AdCampaignPublicDataService } from '../public-data-services/ad-campaign.public-data-service';

export const mainAdResolver: ResolveFn<IdFileDto[]> = (route, state) => {
  const adCampaignPublicDataService = inject(AdCampaignPublicDataService);
  const fileDataService = inject(FilePublicDataService);

  return adCampaignPublicDataService.getActual().pipe(
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
