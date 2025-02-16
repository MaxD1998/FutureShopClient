import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin, of, switchMap } from 'rxjs';
import { IdNameDto } from '../../../../core/dtos/id-name.dto';
import { ProductSortType } from '../../../../core/enums/product-sort-type';
import { CategoryDataService } from '../data-services/category.data-service';
import { ProductDataService } from '../data-services/product.data-service';
import { ProductShopListDto } from '../dtos/product-shop.list-dto';

export const productShopListResolver: ResolveFn<{ category: IdNameDto; products: ProductShopListDto[] }> = (
  route,
  state,
) => {
  const categoryDataService = inject(CategoryDataService);
  const productDataService = inject(ProductDataService);

  return categoryDataService.getIdNameById(route.params['categoryId']).pipe(
    switchMap(response => {
      return forkJoin({
        category: of(response),
        products: productDataService.getShopListByCategoryId(response.id, { sortType: ProductSortType.nameAsc }),
      });
    }),
  );
};
