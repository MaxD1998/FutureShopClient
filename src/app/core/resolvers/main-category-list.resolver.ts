import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { CategoryDataService } from '../data-services/category.data-service';
import { CategoryListDto } from '../dtos/category.list-dto';

export const mainResolver: ResolveFn<CategoryListDto[]> = (route, state) => {
  return inject(CategoryDataService).getsByCategoryParentId();
};
