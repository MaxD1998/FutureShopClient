import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IdNameDto } from '../../../../core/dtos/id-name.dto';
import { PageDto } from '../../../../core/dtos/page.dto';
import { CategoryFormDto } from '../../../product-module/core/dtos/category.form-dto';
import { CategoryListDto } from '../../../product-module/core/dtos/category.list-dto';
import { CategoryControllerRoute } from '../constants/api-routes/category-controller.route';

@Injectable({
  providedIn: 'root',
})
export class CategoryDataService {
  private readonly _httpClient = inject(HttpClient);

  add(dto: CategoryFormDto): Observable<CategoryFormDto> {
    return this._httpClient.post<CategoryFormDto>(CategoryControllerRoute.base, dto);
  }

  delete(id: string): Observable<null> {
    return this._httpClient.delete<null>(`${CategoryControllerRoute.base}${id}`);
  }

  getById(id: string): Observable<CategoryFormDto> {
    const url = `${CategoryControllerRoute.base}${id}`;
    return this._httpClient.get<CategoryFormDto>(url);
  }

  getPage(pageNumber: number): Observable<PageDto<CategoryListDto>> {
    const url = `${CategoryControllerRoute.page}${pageNumber}`;
    return this._httpClient.get<PageDto<CategoryListDto>>(url);
  }

  getListPotentialSubcategories(exceptionIds: string[], parentId?: string, id?: string): Observable<IdNameDto[]> {
    const url = `${CategoryControllerRoute.potentialSubcategories}${id ?? ''}`;
    let params = new HttpParams();

    if (parentId) {
      params = params.append('parentId', parentId);
    }

    exceptionIds.forEach(x => (params = params.append('childIds', x)));

    return this._httpClient.get<IdNameDto[]>(url, { params: params });
  }

  getListPotentialParentCategories(exceptionIds: string[], id?: string): Observable<IdNameDto[]> {
    const url = `${CategoryControllerRoute.potentialParentCategories}${id ?? ''}`;
    let params = new HttpParams();
    exceptionIds.forEach(x => (params = params.append('childIds', x)));

    return this._httpClient.get<IdNameDto[]>(url, { params: params });
  }

  getsByCategoryParentId(categoryParentId?: string): Observable<CategoryListDto[]> {
    const url = `${CategoryControllerRoute.categoryParentId}${categoryParentId ?? ''}`;
    return this._httpClient.get<CategoryListDto[]>(url);
  }

  getsIdName(): Observable<IdNameDto[]> {
    return this._httpClient.get<IdNameDto[]>(CategoryControllerRoute.all);
  }

  update(id: string, dto: CategoryFormDto): Observable<CategoryFormDto> {
    const url = `${CategoryControllerRoute.base}${id}`;
    return this._httpClient.put<CategoryFormDto>(url, dto);
  }
}
