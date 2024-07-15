import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProductBaseDataService } from '../data-services/product-base.data-service';
import { PageDto } from '../dtos/page.dto';
import { ProductBaseListDto } from '../dtos/product-base.list-dto';

export const productBaseListResolver: ResolveFn<PageDto<ProductBaseListDto>> = (route, state) => {
  return inject(ProductBaseDataService).getPage(route.params['pageNumber'] ?? 1);
};
