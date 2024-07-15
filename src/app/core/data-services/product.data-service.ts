import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductControllerRoute } from '../constants/api-routes/product-controller.route';
import { PageDto } from '../dtos/page.dto';
import { ProductFormDto } from '../dtos/product.form-dto';
import { ProductListDto } from '../dtos/product.list-dto';

@Injectable({
  providedIn: 'root',
})
export class ProductDataService {
  private readonly _httpClient = inject(HttpClient);

  add(dto: ProductFormDto): Observable<ProductFormDto> {
    return this._httpClient.post<ProductFormDto>(ProductControllerRoute.base, dto);
  }

  delete(id: string): Observable<null> {
    return this._httpClient.delete<null>(`${ProductControllerRoute.base}${id}`);
  }

  getById(id: string): Observable<ProductFormDto> {
    const url = `${ProductControllerRoute.base}${id}`;
    return this._httpClient.get<ProductFormDto>(url);
  }

  getPage(pageNumber: number): Observable<PageDto<ProductListDto>> {
    const url = `${ProductControllerRoute.page}${pageNumber}`;
    return this._httpClient.get<PageDto<ProductListDto>>(url);
  }

  update(id: string, dto: ProductFormDto): Observable<ProductFormDto> {
    const url = `${ProductControllerRoute.base}${id}`;
    return this._httpClient.put<ProductFormDto>(url, dto);
  }
}
