import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map } from 'rxjs';
import { ClientRoute } from '../../../../core/constants/client-routes/client.route';
import { AsideItemModel } from '../../../../core/models/aside-item.model';
import { CategoryDataService } from '../data-services/category.data-service';
import { CategoryListDto } from '../dtos/category.list-dto';

export const mainCategoryListResolver: ResolveFn<AsideItemModel[]> = (route, state) => {
  return inject(CategoryDataService)
    .getList()
    .pipe(
      map(response => {
        return response.map(x => mapToModel(x));
      }),
    );
};

function mapToModel(dto: CategoryListDto): AsideItemModel {
  return {
    id: dto.id,
    name: dto.name,
    parentId: dto.parentCategoryId,
    subCategories: dto.subCategories.map(x => mapToModel(x)),
    link: `${ClientRoute.product}/${dto.id}`,
  };
}
