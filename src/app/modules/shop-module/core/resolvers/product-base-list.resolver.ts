import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { PageDto } from '../../../../core/dtos/page.dto';
import { ProductBaseListDto } from '../../../product-module/core/dtos/product-base.list-dto';
import { ProductBaseDataService } from '../data-services/product-base.data-service';

export const productBaseListResolver: ResolveFn<PageDto<ProductBaseListDto>> = (route, state) => {
  return inject(ProductBaseDataService).getPage(route.params['pageNumber'] ?? 1);
};
