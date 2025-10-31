import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IdNameDto } from '../../../../core/dtos/id-name.dto';
import { CategoryPublicControllerRoute } from '../constants/public-controllers/category-public-controller.route';
import { CategoryListDto } from '../dtos/category/category.list-dto';

@Injectable({
  providedIn: 'root',
})
export class CategoryPublicDataService {
  private readonly _httpClient = inject(HttpClient);

  getActiveIdNameById(id: string): Observable<IdNameDto> {
    const url = `${CategoryPublicControllerRoute.activeIdName}${id}`;
    return this._httpClient.get<IdNameDto>(url);
  }

  getActiveList(categoryParentId?: string): Observable<CategoryListDto[]> {
    const url = `${CategoryPublicControllerRoute.activeList}${categoryParentId ?? ''}`;
    return this._httpClient.get<CategoryListDto[]>(url);
  }
}
