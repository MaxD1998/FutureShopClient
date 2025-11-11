import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IdNameDto } from '../../../../core/dtos/id-name.dto';
import { PageDto } from '../../../../core/dtos/page.dto';
import { PaginationDto } from '../../../../core/dtos/pagination.dto';
import { CategoryControllerRoute } from '../constants/controller-routes/category-controller.route';
import { CategoryListDto } from '../dtos/category/category.list-dto';
import { CategoryPageListDto } from '../dtos/category/category.page-list-dto';
import { CategoryRequestFormDto } from '../dtos/category/category.request-form-dto';
import { CategoryResponseFormDto } from '../dtos/category/category.response-form-dto';

@Injectable({
  providedIn: 'root',
})
export class CategoryDataService {
  private readonly _httpClient = inject(HttpClient);

  //For public
  getActiveIdNameById(id: string): Observable<IdNameDto> {
    const url = `${CategoryControllerRoute.activeIdName}${id}`;
    return this._httpClient.get<IdNameDto>(url);
  }

  getActiveList(categoryParentId?: string): Observable<CategoryListDto[]> {
    const url = `${CategoryControllerRoute.activeList}${categoryParentId ?? ''}`;
    return this._httpClient.get<CategoryListDto[]>(url);
  }

  //For Employee
  getById(id: string): Observable<CategoryResponseFormDto> {
    const url = `${CategoryControllerRoute.base}${id}`;
    return this._httpClient.get<CategoryResponseFormDto>(url);
  }

  getIdNameById(id: string): Observable<IdNameDto> {
    const url = `${CategoryControllerRoute.idName}${id}`;
    return this._httpClient.get<IdNameDto>(url);
  }

  getPage(pageNumber: number): Observable<PageDto<CategoryPageListDto>> {
    const dto: PaginationDto = {
      pageNumber: pageNumber,
      pageSize: 25,
    };

    const params = new HttpParams().append('pageNumber', dto.pageNumber).append('pageSize', dto.pageSize);
    const url = `${CategoryControllerRoute.page}`;

    return this._httpClient.get<PageDto<CategoryPageListDto>>(url, { params: params });
  }

  update(id: string, dto: CategoryRequestFormDto): Observable<CategoryResponseFormDto> {
    const url = `${CategoryControllerRoute.base}${id}`;
    return this._httpClient.put<CategoryResponseFormDto>(url, dto);
  }
}
