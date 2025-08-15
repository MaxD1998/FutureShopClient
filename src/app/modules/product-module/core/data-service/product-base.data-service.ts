import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IdNameDto } from '../../../../core/dtos/id-name.dto';
import { PageDto } from '../../../../core/dtos/page.dto';
import { ProductBaseControllerRoute } from '../constants/api-routes/product-base-controller.route';
import { ProductBaseListDto } from '../dtos/product-base/product-base.list-dto';
import { ProductBaseRequestFormDto } from '../dtos/product-base/product-base.request-form-dto';
import { ProductBaseResponseFormDto } from '../dtos/product-base/product-base.response-form-dto';

@Injectable({
  providedIn: 'root',
})
export class ProductBaseDataService {
  private readonly _httpClient = inject(HttpClient);

  create(dto: ProductBaseRequestFormDto): Observable<ProductBaseResponseFormDto> {
    return this._httpClient.post<ProductBaseResponseFormDto>(ProductBaseControllerRoute.base, dto);
  }

  delete(id: string): Observable<null> {
    return this._httpClient.delete<null>(`${ProductBaseControllerRoute.base}${id}`);
  }

  getById(id: string): Observable<ProductBaseResponseFormDto> {
    const url = `${ProductBaseControllerRoute.base}${id}`;
    return this._httpClient.get<ProductBaseResponseFormDto>(url);
  }

  getPage(pageNumber: number): Observable<PageDto<ProductBaseListDto>> {
    const url = `${ProductBaseControllerRoute.page}${pageNumber}`;
    return this._httpClient.get<PageDto<ProductBaseListDto>>(url);
  }

  getIdNameById(id: string): Observable<IdNameDto> {
    const url = `${ProductBaseControllerRoute.idNameById}${id}`;
    return this._httpClient.get<IdNameDto>(url);
  }

  getListIdName(): Observable<IdNameDto[]> {
    const url = `${ProductBaseControllerRoute.all}`;
    return this._httpClient.get<IdNameDto[]>(url);
  }

  update(id: string, dto: ProductBaseRequestFormDto): Observable<ProductBaseResponseFormDto> {
    const url = `${ProductBaseControllerRoute.base}${id}`;
    return this._httpClient.put<ProductBaseResponseFormDto>(url, dto);
  }
}
