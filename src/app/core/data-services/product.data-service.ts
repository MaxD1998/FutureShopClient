import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductControllerRoute } from '../constants/api-routes/product-controller.route';
import { PageDto } from '../dtos/page.dto';
import { ProductShopListDto } from '../dtos/product-shop.list-dto';
import { ProductShopLisRequestDto } from '../dtos/product-shop.list-request-dto';
import { ProductDto } from '../dtos/product.dto';
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

  getDetailsById(id: string): Observable<ProductDto> {
    const url = `${ProductControllerRoute.details}${id}`;
    return this._httpClient.get<ProductDto>(url);
  }

  getShopListByCategoryId(categoryId: string, request?: ProductShopLisRequestDto): Observable<ProductShopListDto[]> {
    const url = `${ProductControllerRoute.shopList}${categoryId}`;
    let params = new HttpParams();

    if (request) {
      if (request.name) {
        params = params.append('name', request.name);
      }

      if (request.priceFrom) {
        params = params.append('priceFrom', request.priceFrom);
      }

      if (request.priceTo) {
        params = params.append('priceTo', request.priceTo);
      }

      if (request.sortType) {
        params = params.append('sortType', request.sortType);
      }
    }

    return this._httpClient.get<ProductShopListDto[]>(url, { params: params });
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
