import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { CategoryDataService } from '../data-services/category.data-service';
import { CategoryFormDto } from '../dtos/category.form-dto';
import { IdNameDto } from '../dtos/id-name.dto';
import { SelectItemModel } from '../models/select-item.model';

export const categoryFormResolver: ResolveFn<{
  category?: CategoryFormDto;
  subCategoryItems: SelectItemModel[];
  parentItems: SelectItemModel[];
}> = (route, state) => {
  const categoryDataService = inject(CategoryDataService);
  const id = route.params['id'];
  if (id) {
    return categoryDataService.getById(id).pipe(
      switchMap(response => {
        return forkJoin({
          category: of(response),
          subCategoryItems: categoryDataService.getsAvailableToBeChild([], response.parentCategoryId, id),
          parentItems: categoryDataService.getsAvailableToBeParent(response.subCategoryIds, id),
        }).pipe(
          map(response => {
            return {
              category: response.category,
              subCategoryItems: response.subCategoryItems.map(x => mapToSelectItemModel(x)),
              parentItems: response.parentItems.map(x => mapToSelectItemModel(x)),
            };
          }),
        );
      }),
    );
  }

  return forkJoin({
    subCategoryItems: categoryDataService.getsAvailableToBeChild([]),
    parentItems: categoryDataService.getsAvailableToBeParent([]),
  }).pipe(
    map(response => {
      return {
        subCategoryItems: response.subCategoryItems.map(x => mapToSelectItemModel(x)),
        parentItems: response.parentItems.map(x => mapToSelectItemModel(x)),
      };
    }),
  );
};

function mapToSelectItemModel(source: IdNameDto): SelectItemModel {
  return {
    id: source.id,
    value: source.name,
  };
}
