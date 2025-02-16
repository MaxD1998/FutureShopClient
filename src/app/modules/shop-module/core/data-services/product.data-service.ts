import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, switchMap, take } from 'rxjs';
import { PageDto } from '../../../../core/dtos/page.dto';
import { UserService } from '../../../auth-module/core/services/user.service';
import { ProductControllerRoute } from '../constants/api-routes/product-controller.route';
import { ProductShopListDto } from '../dtos/product-shop.list-dto';
import { ProductShopLisRequestDto } from '../dtos/product-shop.list-request-dto';
import { ProductDto } from '../dtos/product.dto';
import { ProductFormDto } from '../dtos/product.form-dto';
import { ProductListDto } from '../dtos/product.list-dto';

@Injectable({
  providedIn: 'root',
})
export class ProductDataService {
  private readonly _authService = inject(UserService);
  private readonly _httpClient = inject(HttpClient);

  getById(id: string): Observable<ProductFormDto> {
    const url = `${ProductControllerRoute.base}${id}`;
    return this._httpClient.get<ProductFormDto>(url);
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

  update(id: string, dto: ProductFormDto): Observable<ProductFormDto> {
    const url = `${ProductControllerRoute.base}${id}`;
    return this._httpClient.put<ProductFormDto>(url, dto);
  }
}
