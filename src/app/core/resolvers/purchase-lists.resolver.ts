import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { defaultIfEmpty, forkJoin, map, Observable, of, switchMap, take } from 'rxjs';
import { LocalStorageConst } from '../constants/localstorage/localstorage.const';
import { ProductPhotoDataService } from '../data-services/product-photo.data-service';
import { PurchaseListDataService } from '../data-services/purchase-list.data-service';
import { PurchaseListDto } from '../dtos/purchase-list.dto';
import { PurchaseListItemModel } from '../models/purchase-list-item.model';
import { PurchaseListModel } from '../models/purchase-list.model';
import { AuthService } from '../services/auth.service';

export const purchaseListResolver: ResolveFn<PurchaseListModel[]> = (route, state) => {
  const authservice = inject(AuthService);
  const productPhotoDataService = inject(ProductPhotoDataService);
  const purchaseListDataService = inject(PurchaseListDataService);
  return authservice.user$.pipe(
    take(1),
    switchMap(user => {
      if (user) {
        return purchaseListDataService.getListByUserIdFromJwt().pipe(
          switchMap(response => {
            return response.length > 0
              ? forkJoin(response.map(x => getPhotos$(productPhotoDataService, x))).pipe(defaultIfEmpty([]))
              : of([]);
          }),
        );
      } else {
        const id = localStorage.getItem(LocalStorageConst.purchaseListId);
        return id
          ? purchaseListDataService.getById(id as string).pipe(
              switchMap(response => {
                return response ? getPhotos$(productPhotoDataService, response).pipe(map(value => [value])) : of([]);
              }),
            )
          : of([]);
      }
    }),
  );
};

function getPhotos$(
  productPhotoDataService: ProductPhotoDataService,
  dto: PurchaseListDto,
): Observable<PurchaseListModel> {
  return forkJoin({
    purchaseList: of(dto),
    photos: of(dto.purchaseListItems).pipe(
      switchMap(purchaseListItems => {
        const results = purchaseListItems.map(x => {
          return forkJoin({
            fileId: x.productFileId,
            photo: productPhotoDataService.getById(x.productFileId),
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
        result.purchaseListItems.push(new PurchaseListItemModel(purchaseListItem, photo?.photo));
      });

      return of(result);
    }),
  );
}
