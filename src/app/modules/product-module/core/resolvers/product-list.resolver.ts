import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { PageDto } from '../../../../core/dtos/page.dto';
import { ProductDataService } from '../data-service/product.data-service';
import { ProductListDto } from '../dtos/product.list-dto';

export const productListResolver: ResolveFn<PageDto<ProductListDto>> = (route, state) => {
  return inject(ProductDataService).getPage(route.params['pageNumber'] ?? 1);
};
