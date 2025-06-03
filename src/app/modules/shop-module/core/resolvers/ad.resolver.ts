import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { FileDataService } from '../../../../core/data-services/file.data-service';
import { AdCampaignDataService } from '../data-services/ad-campaign.data-service';

export const adResolver: ResolveFn<string[]> = (route, state) => {
  const fileDataService = inject(FileDataService);

  return inject(AdCampaignDataService)
    .getActual()
    .pipe(
      switchMap(fileIds => {
        return fileIds.length > 0
          ? forkJoin(fileIds.map(x => fileDataService.getById(x).pipe(map(blob => URL.createObjectURL(blob)))))
          : of([]);
      }),
    );
};
