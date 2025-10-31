import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BasketPublicControllerRoute } from '../constants/public-controllers/basket-public-controller.route';
import { BasketDto } from '../dtos/basket/basket.dto';
import { BasketRequestFormDto } from '../dtos/basket/basket.request-form-dto';
import { BasketResponseFormDto } from '../dtos/basket/basket.response-form-dto';
import { ImportPurchaseListToBasketDto } from '../dtos/purchase-list/import-basket-to-purchase-list.dto';

@Injectable({
  providedIn: 'root',
})
export class BasketPublicDataService {
  private readonly _httpClient = inject(HttpClient);

  create(dto: BasketRequestFormDto): Observable<BasketResponseFormDto> {
    return this._httpClient.post<BasketResponseFormDto>(BasketPublicControllerRoute.base, dto);
  }

  getById(id: string): Observable<BasketDto> {
    const favouriteId = localStorage.getItem('favouriteId');
    const url = `${BasketPublicControllerRoute.base}${id}`;

    return this._httpClient.get<BasketDto>(url, {
      params: favouriteId ? new HttpParams().append('favouriteId', favouriteId) : undefined,
    });
  }

  getUserBasket(): Observable<BasketDto> {
    return this._httpClient.get<BasketDto>(BasketPublicControllerRoute.userBasket);
  }

  importPurchaseList(dto: ImportPurchaseListToBasketDto): Observable<BasketDto> {
    return this._httpClient.post<BasketDto>(BasketPublicControllerRoute.importPurchaseList, dto);
  }

  update(id: string, dto: BasketRequestFormDto): Observable<BasketResponseFormDto> {
    return this._httpClient.put<BasketResponseFormDto>(`${BasketPublicControllerRoute.base}${id}`, dto);
  }
}
