import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageDto } from '../../../../core/dtos/page.dto';
import { PaginationDto } from '../../../../core/dtos/pagination.dto';
import { UserControllerRoute } from '../constants/controller-routes/user-controller.route';
import { UserCreateRequestFormDto } from '../dtos/user/user-create.request-form-dto';
import { UserUpdateRequestFormDto } from '../dtos/user/user-update.request-form-dto';
import { UserListDto } from '../dtos/user/user.list-dto';
import { UserResponseFormDto } from '../dtos/user/user.response-form-dto';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private readonly _httpClient = inject(HttpClient);

  create(dto: UserCreateRequestFormDto): Observable<UserResponseFormDto> {
    return this._httpClient.post<UserResponseFormDto>(UserControllerRoute.base, dto);
  }

  delete(id: string): Observable<null> {
    return this._httpClient.delete<null>(`${UserControllerRoute.base}${id}`);
  }

  getById(id: string): Observable<UserResponseFormDto> {
    const url = `${UserControllerRoute.base}${id}`;
    return this._httpClient.get<UserResponseFormDto>(url);
  }

  getPage(pageNumber: number): Observable<PageDto<UserListDto>> {
    const dto: PaginationDto = {
      pageNumber: pageNumber,
      pageSize: 25,
    };

    const params = new HttpParams().append('pageNumber', dto.pageNumber).append('pageSize', dto.pageSize);
    const url = `${UserControllerRoute.page}`;

    return this._httpClient.get<PageDto<UserListDto>>(url, { params: params });
  }

  update(id: string, dto: UserUpdateRequestFormDto): Observable<UserResponseFormDto> {
    const url = `${UserControllerRoute.base}${id}`;
    return this._httpClient.put<UserResponseFormDto>(url, dto);
  }
}
