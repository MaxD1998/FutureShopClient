import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageDto } from '../../../../core/dtos/page.dto';
import { PaginationDto } from '../../../../core/dtos/pagination.dto';
import { UserControllerRoute } from '../constants/controller-routes/user-controller.route';
import { UserBasicInfoFormDto } from '../dtos/user/user-basic-info.form-dto';
import { UserCreateRequestFormDto } from '../dtos/user/user-create.request-form-dto';
import { UserPasswordFormDto } from '../dtos/user/user-password.form-dto';
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

  delete(id: string): Observable<void> {
    return this._httpClient.delete<void>(`${UserControllerRoute.base}${id}`);
  }

  deleteOwnAccount(): Observable<void> {
    return this._httpClient.delete<void>(UserControllerRoute.ownAccount);
  }

  getById(id: string): Observable<UserResponseFormDto> {
    const url = `${UserControllerRoute.base}${id}`;
    return this._httpClient.get<UserResponseFormDto>(url);
  }

  getOwnBasicInfo(): Observable<UserBasicInfoFormDto> {
    const url = `${UserControllerRoute.ownBasicInfo}`;
    return this._httpClient.get<UserBasicInfoFormDto>(url);
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

  updateOwnBasicInfo(dto: UserBasicInfoFormDto): Observable<UserBasicInfoFormDto> {
    const url = `${UserControllerRoute.ownBasicInfo}`;
    return this._httpClient.patch<UserBasicInfoFormDto>(url, dto);
  }

  updateOwnPassword(dto: UserPasswordFormDto): Observable<void> {
    const url = `${UserControllerRoute.ownPassword}`;
    return this._httpClient.patch<void>(url, dto);
  }
}
