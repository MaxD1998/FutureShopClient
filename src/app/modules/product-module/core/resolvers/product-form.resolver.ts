import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { SelectItemModel } from '../../../../components/shared/input-select/models/select-item.model';
import { FileDataService } from '../../../../core/data-services/file.data-service';
import { ProductBaseDataService } from '../data-service/product-base.data-service';
import { ProductDataService } from '../data-service/product.data-service';
import { ProductPhotoInfoDto } from '../dtos/product/product-photo.info-dto';
import { ProductRequestFormDto } from '../dtos/product/product.request-form-dto';

export const productFormResolver: ResolveFn<{
  files?: ProductPhotoInfoDto[];
  product?: ProductRequestFormDto;
  productBases?: SelectItemModel[];
}> = (route, state) => {
  const productDataService = inject(ProductDataService);
  const productBaseDataService = inject(ProductBaseDataService);
  const fileDataService = inject(FileDataService);
  const translateService = inject(TranslateService);
  const id = route.params['id'];
  const selectOption = [{ value: translateService.instant('common.input-select.select-option') }];

  return id
    ? productDataService.getById(id).pipe(
        switchMap(response => {
          return forkJoin({
            files:
              response.productPhotos.length > 0
                ? fileDataService.getListInfoByIds(response.productPhotos.map(x => x.fileId))
                : of(undefined),
            product: of(response),
            productBases: productBaseDataService.getIdNameById(response.productBaseId).pipe(
              map(x => {
                const result = x
                  ? ([
                      {
                        id: x.id,
                        value: x.name,
                      },
                    ] as SelectItemModel[])
                  : [];

                return selectOption.concat(result);
              }),
            ),
          });
        }),
      )
    : forkJoin({
        productBases: productBaseDataService.getListIdName().pipe(
          map(response =>
            selectOption.concat(
              response.map(x => {
                return {
                  id: x.id,
                  value: x.name,
                };
              }),
            ),
          ),
        ),
      });
};
