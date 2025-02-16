import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { SelectItemModel } from '../../../../core/models/select-item.model';
import { CategoryDataService } from '../data-services/category.data-service';
import { ProductBaseDataService } from '../data-services/product-base.data-service';
import { ProductBaseFormDto } from '../dtos/product-base.form-dto';

export const productBaseFormResolver: ResolveFn<{ productBase: ProductBaseFormDto; categories: SelectItemModel[] }> = (
  route,
  state,
) => {
  const categoryDataService = inject(CategoryDataService);
  const productBaseDataService = inject(ProductBaseDataService);
  const id = route.params['id'];

  return productBaseDataService.getById(id).pipe(
    switchMap(productBase => {
      return forkJoin({
        productBase: of(productBase),
        categories: categoryDataService
          .getIdNameById(productBase.categoryId)
          .pipe(map(category => [{ id: category.id, value: category.name } as SelectItemModel])),
      });
    }),
  );
};
