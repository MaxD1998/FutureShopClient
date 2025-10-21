import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PageDto } from '../../../../core/dtos/page.dto';
import { PaginationDto } from '../../../../core/dtos/pagination.dto';
import { ProductControllerRoute } from '../constants/api-routes/product-controller.route';
import { ProductListDto } from '../dtos/product/product.list-dto';
import { ProductRequestFormDto } from '../dtos/product/product.request-form-dto';
import { ProductResponseFormDto } from '../dtos/product/product.response-form-dto';

@Injectable({
  providedIn: 'root',
})
export class ProductDataService {
  private readonly _httpClient = inject(HttpClient);

  create(dto: ProductRequestFormDto): Observable<ProductResponseFormDto> {
    return this._httpClient.post<ProductResponseFormDto>(ProductControllerRoute.base, dto);
  }

  delete(id: string): Observable<null> {
    return this._httpClient.delete<null>(`${ProductControllerRoute.base}${id}`);
  }

  getById(id: string): Observable<ProductResponseFormDto> {
    const url = `${ProductControllerRoute.base}${id}`;
    return this._httpClient.get<ProductResponseFormDto>(url);
  }

  getPage(pageNumber: number): Observable<PageDto<ProductListDto>> {
    const dto: PaginationDto = {
      pageNumber: pageNumber,
      pageSize: 25,
    };

    const params = new HttpParams().append('pageNumber', dto.pageNumber).append('pageSize', dto.pageSize);
    const url = `${ProductControllerRoute.page}`;

    return this._httpClient.get<PageDto<ProductListDto>>(url, { params: params });
  }

  update(id: string, dto: ProductRequestFormDto): Observable<ProductResponseFormDto> {
    const url = `${ProductControllerRoute.base}${id}`;
    return this._httpClient.put<ProductResponseFormDto>(url, dto);
  }
}
