import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { SelectItemModel } from '../../../../core/models/select-item.model';
import { ProductBaseDataService } from '../data-service/product-base.data-service';
import { ProductPhotoDataService } from '../data-service/product-photo.data-service';
import { ProductDataService } from '../data-service/product.data-service';
import { ProductPhotoInfoDto } from '../dtos/product-photo.info-dto';
import { ProductFormDto } from '../dtos/product.form-dto';

export const productFormResolver: ResolveFn<{
  files?: ProductPhotoInfoDto[];
  product?: ProductFormDto;
  productBases?: SelectItemModel[];
}> = (route, state) => {
  const productDataService = inject(ProductDataService);
  const productBaseDataService = inject(ProductBaseDataService);
  const productPhotoDataService = inject(ProductPhotoDataService);
  const id = route.params['id'];

  return id
    ? productDataService.getById(id).pipe(
        switchMap(response => {
          return forkJoin({
            files: response.productPhotos
              ? productPhotoDataService.getListInfoByIds(response.productPhotos.map(x => x.fileId))
              : of(undefined),
            product: of(response),
            productBases: productBaseDataService.getIdNameById(response.productBaseId).pipe(
              map(x => {
                return x
                  ? ([
                      {
                        id: x.id,
                        value: x.name,
                      },
                    ] as SelectItemModel[])
                  : [];
              }),
            ),
          });
        }),
      )
    : forkJoin({
        productBases: productBaseDataService.getListIdName().pipe(
          map(response =>
            response.map(x => {
              return {
                id: x.id,
                value: x.name,
              };
            }),
          ),
        ),
      });
};
