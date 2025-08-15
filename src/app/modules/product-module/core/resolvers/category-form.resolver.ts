import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { IdNameDto } from '../../../../core/dtos/id-name.dto';
import { SelectItemModel } from '../../../../core/models/select-item.model';
import { CategoryDataService } from '../data-service/category.data-service';
import { CategoryRequestFormDto } from '../dtos/category/category.request-form-dto';

export const categoryFormResolver: ResolveFn<{
  category?: CategoryRequestFormDto;
  subCategoryItems: SelectItemModel[];
  parentItems: SelectItemModel[];
}> = (route, state) => {
  const categoryDataService = inject(CategoryDataService);
  const translateService = inject(TranslateService);
  const selectOption: SelectItemModel[] = [
    { id: '', value: translateService.instant('common.input-select.select-option') },
  ];

  const id = route.params['id'];

  if (id) {
    return categoryDataService.getById(id).pipe(
      switchMap(response => {
        return forkJoin({
          category: of(response),
          subCategoryItems: categoryDataService.getListPotentialSubcategories(
            response.subCategories.map(x => x.id),
            response.parentCategoryId,
            id,
          ),
          parentItems: categoryDataService.getListPotentialParentCategories(
            response.subCategories.map(x => x.id),
            id,
          ),
        }).pipe(
          map(response => {
            return {
              category: response.category,
              subCategoryItems: selectOption.concat(response.subCategoryItems.map(x => mapToSelectItemModel(x))),
              parentItems: selectOption.concat(response.parentItems.map(x => mapToSelectItemModel(x))),
            };
          }),
        );
      }),
    );
  }

  return forkJoin({
    subCategoryItems: categoryDataService.getListPotentialSubcategories([]),
    parentItems: categoryDataService.getListPotentialParentCategories([]),
  }).pipe(
    map(response => {
      return {
        subCategoryItems: selectOption.concat(response.subCategoryItems.map(x => mapToSelectItemModel(x))),
        parentItems: selectOption.concat(response.parentItems.map(x => mapToSelectItemModel(x))),
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
