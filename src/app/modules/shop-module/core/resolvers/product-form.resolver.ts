import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { SelectItemModel } from '../../../../core/models/select-item.model';
import { ProductBaseDataService } from '../data-services/product-base.data-service';
import { ProductDataService } from '../data-services/product.data-service';
import { ProductRequestFormDto } from '../dtos/product/product.request-form-dto';

export const productFormResolver: ResolveFn<{
  product: ProductRequestFormDto;
  productBases: SelectItemModel[];
}> = (route, state) => {
  const productBaseDataService = inject(ProductBaseDataService);
  const productDataService = inject(ProductDataService);
  const productId = route.params['id'];

  return productDataService.getById(productId).pipe(
    switchMap(product => {
      return forkJoin({
        product: of(product),
        productBases:
          productBaseDataService.getIdNameById(product.productBaseId).pipe(map(x => [{ id: x.id, value: x.name }])) ??
          of([]),
      });
    }),
  );
};
