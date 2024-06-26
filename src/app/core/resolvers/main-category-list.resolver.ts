import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { CategoryDataService } from '../data-services/category.data-service';
import { CategoryDto } from '../dtos/category.dto';

export const mainResolver: ResolveFn<CategoryDto[]> = (route, state) => {
  return inject(CategoryDataService).getsByCategoryParentId();
};
