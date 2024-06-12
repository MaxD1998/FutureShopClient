import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { CategoryDataService } from '../data-services/category.data-service';
import { CategoryDto } from '../dtos/category.dto';
import { PageDto } from '../dtos/page.dto';

export const categoryListResolver: ResolveFn<PageDto<CategoryDto>> = (route, state) => {
  return inject(CategoryDataService).getPage(route.params['pageNumber'] ?? 1);
};
