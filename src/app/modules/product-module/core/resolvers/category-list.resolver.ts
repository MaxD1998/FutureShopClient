import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { PageDto } from '../../../../core/dtos/page.dto';
import { CategoryDataService } from '../data-service/category.data-service';
import { CategoryListDto } from '../dtos/category/category.list-dto';

export const categoryListResolver: ResolveFn<PageDto<CategoryListDto>> = (route, state) => {
  return inject(CategoryDataService).getPage(route.params['pageNumber'] ?? 1);
};
