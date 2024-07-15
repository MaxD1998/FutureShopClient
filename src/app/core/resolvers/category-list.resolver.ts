import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { CategoryDataService } from '../data-services/category.data-service';
import { CategoryListDto } from '../dtos/category.list-dto';
import { PageDto } from '../dtos/page.dto';

export const categoryListResolver: ResolveFn<PageDto<CategoryListDto>> = (route, state) => {
  return inject(CategoryDataService).getPage(route.params['pageNumber'] ?? 1);
};
