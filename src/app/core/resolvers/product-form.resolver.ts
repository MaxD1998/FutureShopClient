import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { ProductBaseDataService } from '../data-services/product-base.data-service';
import { ProductParameterDataService } from '../data-services/product-parameter.data-service';
import { ProductPhotoDataService } from '../data-services/product-photo.data-service';
import { ProductDataService } from '../data-services/product.data-service';
import { IdNameDto } from '../dtos/id-name.dto';
import { ProductPhotoInfoDto } from '../dtos/product-photo.info-dto';
import { ProductFormDto } from '../dtos/product.form-dto';
import { SelectItemModel } from '../models/select-item.model';

export const productFormResolver: ResolveFn<{
  files?: ProductPhotoInfoDto[];
  product?: ProductFormDto;
  productBases?: SelectItemModel[];
  productParameters?: IdNameDto[];
}> = (route, state) => {
  const productDataService = inject(ProductDataService);
  const productBaseDataService = inject(ProductBaseDataService);
  const productParameterDataService = inject(ProductParameterDataService);
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
            productParameters: productParameterDataService.getsByProductBaseId(response.productBaseId),
          });
        }),
      )
    : forkJoin({
        productBases: productBaseDataService.getsIdName().pipe(
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
