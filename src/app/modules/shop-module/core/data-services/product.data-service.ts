import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, switchMap, take } from 'rxjs';
import { IdNameDto } from '../../../../core/dtos/id-name.dto';
import { PageDto } from '../../../../core/dtos/page.dto';
import { UserService } from '../../../auth-module/core/services/user.service';
import { ProductControllerRoute } from '../constants/api-routes/product-controller.route';
import { ProductShopListDto } from '../dtos/product/product-shop.list-dto';
import { ProductShopLisRequestDto } from '../dtos/product/product-shop.list-request-dto';
import { ProductDto } from '../dtos/product/product.dto';
import { ProductListDto } from '../dtos/product/product.list-dto';
import { ProductRequestFormDto } from '../dtos/product/product.request-form-dto';
import { ProductResponseFormDto } from '../dtos/product/product.response-form-dto';
import { SimulatePriceFormDto } from '../dtos/product/simulate-price.form-dto';
import { SimulatePriceRequestDto } from '../dtos/product/simulate-price.request-dto';
import { SimulateRemovePriceRequestDto } from '../dtos/product/simulate-remove-price.request-dto';

@Injectable({
  providedIn: 'root',
})
export class ProductDataService {
  private readonly _authService = inject(UserService);
  private readonly _httpClient = inject(HttpClient);

  getById(id: string): Observable<ProductResponseFormDto> {
    const url = `${ProductControllerRoute.base}${id}`;
    return this._httpClient.get<ProductResponseFormDto>(url);
  }

  getDetailsById(id: string): Observable<ProductDto> {
    return this._authService.user$.pipe(
      take(1),
      switchMap(user => {
        const url = `${ProductControllerRoute.details}${id}`;
        const favouriteId = localStorage.getItem('favouriteId');

        if (!user && favouriteId) {
          const params = new HttpParams().append('favouriteId', favouriteId);
          return this._httpClient.get<ProductDto>(url, { params: params });
        } else {
          return this._httpClient.get<ProductDto>(url);
        }
      }),
    );
  }

  getListIdName(excludedIds: string[]): Observable<IdNameDto[]> {
    const url = `${ProductControllerRoute.list}`;
    let params = new HttpParams();

    excludedIds.forEach(x => {
      params = params.append('excludedIds', x);
    });

    return this._httpClient.get<IdNameDto[]>(url, { params: params });
  }

  getPage(pageNumber: number): Observable<PageDto<ProductListDto>> {
    const url = `${ProductControllerRoute.page}${pageNumber}`;
    return this._httpClient.get<PageDto<ProductListDto>>(url);
  }

  getShopListByCategoryId(categoryId: string, request?: ProductShopLisRequestDto): Observable<ProductShopListDto[]> {
    return this._authService.user$.pipe(
      take(1),
      switchMap(user => {
        const url = `${ProductControllerRoute.shopList}${categoryId}`;
        const favouriteId = localStorage.getItem('favouriteId');
        let params = new HttpParams();

        if (!user && favouriteId) {
          params = params.append('favouriteId', favouriteId);
        }

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
      }),
    );
  }

  simulateAddProduct(dto: SimulatePriceRequestDto): Observable<SimulatePriceFormDto[]> {
    const url = `${ProductControllerRoute.simulateAddPrice}`;
    return this._httpClient.post<SimulatePriceFormDto[]>(url, dto);
  }

  simulateRemoveProduct(dto: SimulateRemovePriceRequestDto): Observable<SimulatePriceFormDto[]> {
    const url = `${ProductControllerRoute.simulateRemovePrice}`;
    return this._httpClient.post<SimulatePriceFormDto[]>(url, dto);
  }

  simulateUpdateProduct(dto: SimulatePriceRequestDto): Observable<SimulatePriceFormDto[]> {
    const url = `${ProductControllerRoute.simulateUpdatePrice}`;
    return this._httpClient.post<SimulatePriceFormDto[]>(url, dto);
  }

  update(id: string, dto: ProductRequestFormDto): Observable<ProductResponseFormDto> {
    const url = `${ProductControllerRoute.base}${id}`;
    return this._httpClient.put<ProductResponseFormDto>(url, dto);
  }
}
