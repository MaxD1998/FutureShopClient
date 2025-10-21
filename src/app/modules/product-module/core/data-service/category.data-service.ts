import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IdNameDto } from '../../../../core/dtos/id-name.dto';
import { PageDto } from '../../../../core/dtos/page.dto';
import { PaginationDto } from '../../../../core/dtos/pagination.dto';
import { CategoryControllerRoute } from '../constants/api-routes/category-controller.route';
import { CategoryListDto } from '../dtos/category/category.list-dto';
import { CategoryRequestFormDto } from '../dtos/category/category.request-form-dto';
import { CategoryResponseFormDto } from '../dtos/category/category.response-form-dto';

@Injectable({
  providedIn: 'root',
})
export class CategoryDataService {
  private readonly _httpClient = inject(HttpClient);

  create(dto: CategoryRequestFormDto): Observable<CategoryResponseFormDto> {
    return this._httpClient.post<CategoryResponseFormDto>(CategoryControllerRoute.base, dto);
  }

  delete(id: string): Observable<null> {
    return this._httpClient.delete<null>(`${CategoryControllerRoute.base}${id}`);
  }

  getById(id: string): Observable<CategoryResponseFormDto> {
    const url = `${CategoryControllerRoute.base}${id}`;
    return this._httpClient.get<CategoryResponseFormDto>(url);
  }

  getPage(pageNumber: number): Observable<PageDto<CategoryListDto>> {
    const dto: PaginationDto = {
      pageNumber: pageNumber,
      pageSize: 25,
    };

    const params = new HttpParams().append('pageNumber', dto.pageNumber).append('pageSize', dto.pageSize);
    const url = `${CategoryControllerRoute.page}`;

    return this._httpClient.get<PageDto<CategoryListDto>>(url, { params: params });
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

  update(id: string, dto: CategoryRequestFormDto): Observable<CategoryResponseFormDto> {
    const url = `${CategoryControllerRoute.base}${id}`;
    return this._httpClient.put<CategoryResponseFormDto>(url, dto);
  }
}
