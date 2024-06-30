import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProductBaseDataService } from '../data-services/product-base.data-service';
import { PageDto } from '../dtos/page.dto';
import { ProductBaseDto } from '../dtos/product-base.dto';

export const productBaseListResolver: ResolveFn<PageDto<ProductBaseDto>> = (route, state) => {
  return inject(ProductBaseDataService).getPage(route.params['pageNumber'] ?? 1);
};
