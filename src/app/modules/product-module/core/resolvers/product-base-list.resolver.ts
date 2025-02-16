import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { PageDto } from '../../../../core/dtos/page.dto';
import { ProductBaseDataService } from '../data-service/product-base.data-service';
import { ProductBaseListDto } from '../dtos/product-base.list-dto';

export const productBaseListResolver: ResolveFn<PageDto<ProductBaseListDto>> = (route, state) => {
  return inject(ProductBaseDataService).getPage(route.params['pageNumber'] ?? 1);
};
