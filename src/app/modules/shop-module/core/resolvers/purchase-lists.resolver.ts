import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { defaultIfEmpty, forkJoin, Observable, of, switchMap, take } from 'rxjs';
import { FileDataService } from '../../../../core/data-services/file.data-service';
import { PurchaseListDto } from '../dtos/purchase-list.dto';
import { PurchaseListModel } from '../models/purchase-list.model';
import { PurchaseListService } from '../services/purchase-list.service';

export const purchaseListsResolver: ResolveFn<PurchaseListModel[]> = (route, state) => {
  const fileDataService = inject(FileDataService);
  const purchaseListService = inject(PurchaseListService);
  return purchaseListService.purchaseLists$.pipe(
    take(1),
    switchMap(purchaseLists => {
      return forkJoin(purchaseLists.map(purchaseList => getPhotos$(fileDataService, purchaseList)));
    }),
  );
};

function getPhotos$(fileDataService: FileDataService, dto: PurchaseListDto): Observable<PurchaseListModel> {
  return forkJoin({
    purchaseList: of(dto),
    photos: of(dto.purchaseListItems).pipe(
      switchMap(purchaseListItems => {
        const results = purchaseListItems.map(x => {
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
