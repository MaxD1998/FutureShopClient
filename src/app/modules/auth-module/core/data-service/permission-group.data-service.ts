import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IdNameDto } from '../../../../core/dtos/id-name.dto';
import { PageDto } from '../../../../core/dtos/page.dto';
import { PaginationDto } from '../../../../core/dtos/pagination.dto';
import { PermissionGroupControllerRoute } from '../constants/controller-routes/permission-group-controller.route';
import { PermissionGroupListDto } from '../dtos/permission-group/permission-group.list-dto';
import { PermissionGroupRequestFormDto } from '../dtos/permission-group/permission-group.request-form-dto';
import { PermissionGroupResponseFormDto } from '../dtos/permission-group/permission-group.response-form-dto';

@Injectable({
  providedIn: 'root',
})
export class PermissionGroupDataService {
  private readonly _httpClient = inject(HttpClient);

  create(dto: PermissionGroupRequestFormDto): Observable<PermissionGroupResponseFormDto> {
    return this._httpClient.post<PermissionGroupResponseFormDto>(PermissionGroupControllerRoute.base, dto);
  }

  delete(id: string): Observable<void> {
    return this._httpClient.delete<void>(`${PermissionGroupControllerRoute.base}${id}`);
  }

  getById(id: string): Observable<PermissionGroupResponseFormDto> {
    const url = `${PermissionGroupControllerRoute.base}${id}`;
    return this._httpClient.get<PermissionGroupResponseFormDto>(url);
  }

  getListIdName(excludedIds: string[]): Observable<IdNameDto[]> {
    const url = `${PermissionGroupControllerRoute.list}`;
    let params = new HttpParams();

    excludedIds.forEach(x => {
      params = params.append('excludedIds', x);
    });

    return this._httpClient.get<IdNameDto[]>(url, { params: params });
  }

  getPage(pageNumber: number): Observable<PageDto<PermissionGroupListDto>> {
    const dto: PaginationDto = {
      pageNumber: pageNumber,
      pageSize: 25,
    };

    const params = new HttpParams().append('pageNumber', dto.pageNumber).append('pageSize', dto.pageSize);
    const url = `${PermissionGroupControllerRoute.page}`;

    return this._httpClient.get<PageDto<PermissionGroupListDto>>(url, { params: params });
  }

  update(id: string, dto: PermissionGroupRequestFormDto): Observable<PermissionGroupResponseFormDto> {
    const url = `${PermissionGroupControllerRoute.base}${id}`;
    return this._httpClient.put<PermissionGroupResponseFormDto>(url, dto);
  }
}
