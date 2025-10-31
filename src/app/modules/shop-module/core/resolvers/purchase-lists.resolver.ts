import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { defaultIfEmpty, forkJoin, Observable, of, switchMap, take } from 'rxjs';
import { FilePublicDataService } from '../../../../core/public-data-services/file.public-data-service';
import { PurchaseListDto } from '../dtos/purchase-list/purchase-list.dto';
import { PurchaseListModel } from '../models/purchase-list.model';
import { PurchaseListService } from '../services/purchase-list.service';

export const purchaseListsResolver: ResolveFn<PurchaseListModel[]> = (route, state) => {
  const fileDataService = inject(FilePublicDataService);
  const purchaseListService = inject(PurchaseListService);
  return purchaseListService.purchaseLists$.pipe(
    take(1),
    switchMap(purchaseLists => {
      return forkJoin(purchaseLists.map(purchaseList => getPhotos$(fileDataService, purchaseList)));
    }),
  );
};

function getPhotos$(fileDataService: FilePublicDataService, dto: PurchaseListDto): Observable<PurchaseListModel> {
  return forkJoin({
    purchaseList: of(dto),
    photos: of(dto.purchaseListItems).pipe(
      switchMap(purchaseListItems => {
        const results = purchaseListItems
          .filter(x => !!x.productFileId)
          .map(x => {
            return forkJoin({
              fileId: x.productFileId,
              photo: fileDataService.getById(x.productFileId),
            });
          });

        return forkJoin(results).pipe(defaultIfEmpty([]));
      }),
    ),
  }).pipe(
    switchMap(response => {
      const result = new PurchaseListModel(response.purchaseList);
      response.purchaseList.purchaseListItems.forEach(purchaseListItem => {
        const photo = response.photos.find(x => x.fileId);
        result.addPurchaseListItem(purchaseListItem, photo?.photo);
      });

      return of(result);
    }),
  );
}
