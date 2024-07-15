import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin, map, of } from 'rxjs';
import { CategoryDataService } from '../data-services/category.data-service';
import { ProductBaseDataService } from '../data-services/product-base.data-service';
import { ProductBaseFormDto } from '../dtos/product-base.form-dto';
import { SelectItemModel } from '../models/select-item.model';

export const productBaseFormResolver: ResolveFn<{ productBase?: ProductBaseFormDto; categories: SelectItemModel[] }> = (
  route,
  state,
) => {
  const categoryDataService = inject(CategoryDataService);
  const productBaseDataService = inject(ProductBaseDataService);
  const id = route.params['id'];

  return forkJoin({
    productBase: id ? productBaseDataService.getById(id) : of(undefined),
    categories: categoryDataService.getsIdName(),
  }).pipe(
    map(response => {
      return {
        productBase: response.productBase,
        categories: response.categories.map(x => {
          return {
            id: x.id,
            value: x.name,
          };
        }),
      };
    }),
  );
};
