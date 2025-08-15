import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, map, of } from 'rxjs';
import { SelectItemModel } from '../../../../core/models/select-item.model';
import { CategoryDataService } from '../data-service/category.data-service';
import { ProductBaseDataService } from '../data-service/product-base.data-service';
import { ProductBaseRequestFormDto } from '../dtos/product-base/product-base.request-form-dto';

export const productBaseFormResolver: ResolveFn<{
  productBase?: ProductBaseRequestFormDto;
  categories: SelectItemModel[];
}> = (route, state) => {
  const categoryDataService = inject(CategoryDataService);
  const productBaseDataService = inject(ProductBaseDataService);
  const translateService = inject(TranslateService);
  const id = route.params['id'];

  return forkJoin({
    productBase: id ? productBaseDataService.getById(id) : of(undefined),
    categories: categoryDataService.getsIdName(),
  }).pipe(
    map(response => {
      return {
        productBase: response.productBase,
        categories: [
          {
            value: translateService.instant('common.input-select.select-option'),
          },
        ].concat(
          response.categories.map(x => {
            return {
              id: x.id,
              value: x.name,
            };
          }),
        ),
      };
    }),
  );
};
