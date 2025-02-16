import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map } from 'rxjs';
import { ClientRoute } from '../../../../core/constants/client-routes/client.route';
import { AsideItemModel } from '../../../../core/models/aside-item.model';
import { CategoryDataService } from '../data-services/category.data-service';

export const mainCategoryListResolver: ResolveFn<AsideItemModel[]> = (route, state) => {
  return inject(CategoryDataService)
    .getsByCategoryParentId()
    .pipe(
      map(response => {
        return response.map<AsideItemModel>(x => {
          return {
            id: x.id,
            name: x.name,
            parentId: x.parentCategoryId,
            hasSubCategories: x.hasSubCategories,
            link: `${ClientRoute.product}/${x.id}`,
          };
        });
      }),
    );
};
