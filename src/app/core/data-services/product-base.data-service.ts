import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductBaseControllerRoute } from '../constants/api-routes/product-base-controller.route';
import { IdNameDto } from '../dtos/id-name.dto';
import { PageDto } from '../dtos/page.dto';
import { ProductBaseFormDto } from '../dtos/product-base.form-dto';
import { ProductBaseListDto } from '../dtos/product-base.list-dto';

@Injectable({
  providedIn: 'root',
})
export class ProductBaseDataService {
  private readonly _httpClient = inject(HttpClient);

  add(dto: ProductBaseFormDto): Observable<ProductBaseFormDto> {
    return this._httpClient.post<ProductBaseFormDto>(ProductBaseControllerRoute.base, dto);
  }

  delete(id: string): Observable<null> {
    return this._httpClient.delete<null>(`${ProductBaseControllerRoute.base}${id}`);
  }

  getById(id: string): Observable<ProductBaseFormDto> {
    const url = `${ProductBaseControllerRoute.base}${id}`;
    return this._httpClient.get<ProductBaseFormDto>(url);
  }

  getPage(pageNumber: number): Observable<PageDto<ProductBaseListDto>> {
    const url = `${ProductBaseControllerRoute.page}${pageNumber}`;
    return this._httpClient.get<PageDto<ProductBaseListDto>>(url);
  }

  getIdNameById(id: string): Observable<IdNameDto> {
    const url = `${ProductBaseControllerRoute.idNameById}${id}`;
    return this._httpClient.get<IdNameDto>(url);
  }

  getsIdName(): Observable<IdNameDto[]> {
    const url = `${ProductBaseControllerRoute.all}`;
    return this._httpClient.get<IdNameDto[]>(url);
  }

  update(id: string, dto: ProductBaseFormDto): Observable<ProductBaseFormDto> {
    const url = `${ProductBaseControllerRoute.base}${id}`;
    return this._httpClient.put<ProductBaseFormDto>(url, dto);
  }
}
