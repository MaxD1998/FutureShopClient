import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin, of, switchMap } from 'rxjs';
import { IdNameDto } from '../../../../core/dtos/id-name.dto';
import { ProductSortType } from '../../../../core/enums/product-sort-type';
import { ProductShopListDto } from '../dtos/product/product-shop.list-dto';
import { CategoryPublicDataService } from '../public-data-services/category.public-data-service';
import { ProductPublicDataService } from '../public-data-services/product.public-data-service';

export const productShopListResolver: ResolveFn<{ category: IdNameDto; products: ProductShopListDto[] }> = (
  route,
  state,
) => {
  const categoryPublicDataService = inject(CategoryPublicDataService);
  const productPublicDataService = inject(ProductPublicDataService);

  return categoryPublicDataService.getActiveIdNameById(route.params['categoryId']).pipe(
    switchMap(response => {
      return forkJoin({
        category: of(response),
        products: productPublicDataService.getShopListByCategoryId(response.id, { sortType: ProductSortType.nameAsc }),
      });
    }),
  );
};
