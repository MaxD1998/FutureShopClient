import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { PageDto } from '../../../../core/dtos/page.dto';
import { CategoryDataService } from '../../../shop-module/core/data-services/category.data-service';
import { CategoryListDto } from '../dtos/category.list-dto';

export const categoryListResolver: ResolveFn<PageDto<CategoryListDto>> = (route, state) => {
  return inject(CategoryDataService).getPage(route.params['pageNumber'] ?? 1);
};
