import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { PageDto } from '../../../../core/dtos/page.dto';
import { CategoryDataService } from '../../../shop-module/core/data-services/category.data-service';
import { CategoryPageListDto } from '../dtos/category.page-list-dto';

export const categoryListResolver: ResolveFn<PageDto<CategoryPageListDto>> = (route, state) => {
  return inject(CategoryDataService).getPage(route.params['pageNumber'] ?? 1);
};
