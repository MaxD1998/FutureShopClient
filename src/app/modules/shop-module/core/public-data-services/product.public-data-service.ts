import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, switchMap, take } from 'rxjs';
import { UserService } from '../../../auth-module/core/services/user.service';
import { ProductPublicControllerRoute } from '../constants/public-controllers/product-public-controller.route';
import { ProductShopListDto } from '../dtos/product/product-shop.list-dto';
import { ProductShopLisRequestDto } from '../dtos/product/product-shop.list-request-dto';
import { ProductDto } from '../dtos/product/product.dto';

@Injectable({
  providedIn: 'root',
})
export class ProductPublicDataService {
  private readonly _authService = inject(UserService);
  private readonly _httpClient = inject(HttpClient);

  getDetailsById(id: string): Observable<ProductDto> {
    return this._authService.user$.pipe(
      take(1),
      switchMap(user => {
        const url = `${ProductPublicControllerRoute.details}${id}`;
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

  getShopListByCategoryId(categoryId: string, request?: ProductShopLisRequestDto): Observable<ProductShopListDto[]> {
    return this._authService.user$.pipe(
      take(1),
      switchMap(user => {
        const url = `${ProductPublicControllerRoute.shopList}${categoryId}`;
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
}
