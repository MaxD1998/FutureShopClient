import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { SelectItemModel } from '../../../../core/models/select-item.model';
import { CategoryDataService } from '../data-services/category.data-service';
import { CategoryFormDto } from '../dtos/category.form-dto';

export const categoryFormResolver: ResolveFn<{ category: CategoryFormDto; parentCategoryItems: SelectItemModel[] }> = (
  route,
  state,
) => {
  const categoryDataService = inject(CategoryDataService);
  const id = route.params['id'] as string;
  return categoryDataService.getById(id).pipe(
    switchMap(category => {
      return forkJoin({
        category: of(category),
        parentCategoryItems: !!category.parentCategoryId
          ? categoryDataService
              .getIdNameById(category.parentCategoryId)
              .pipe(map(parent => [{ id: parent.id, value: parent.name } as SelectItemModel]))
          : of([]),
      });
    }),
  );
};
