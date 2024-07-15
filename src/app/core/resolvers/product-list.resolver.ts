import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProductDataService } from '../data-services/product.data-service';
import { PageDto } from '../dtos/page.dto';
import { ProductListDto } from '../dtos/product.list-dto';

export const productListResolver: ResolveFn<PageDto<ProductListDto>> = (route, state) => {
  return inject(ProductDataService).getPage(route.params['pageNumber'] ?? 1);
};
