import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BasketControllerRoute } from '../constants/api-routes/basket-controller.route';
import { BasketDto } from '../dtos/basket.dto';
import { BasketFormDto } from '../dtos/basket.form-dto';
import { ImportPurchaseListToBasketDto } from '../dtos/import-basket-to-purchase-list.dto';

@Injectable({
  providedIn: 'root',
})
export class BasketDataService {
  private readonly _httpClient = inject(HttpClient);

  create(dto: BasketFormDto): Observable<BasketFormDto> {
    return this._httpClient.post<BasketFormDto>(BasketControllerRoute.base, dto);
  }

  getById(id: string): Observable<BasketDto> {
    const favouriteId = localStorage.getItem('favouriteId');
    const url = `${BasketControllerRoute.base}${id}`;

    return this._httpClient.get<BasketDto>(url, {
      params: favouriteId ? new HttpParams().append('favouriteId', favouriteId) : undefined,
    });
  }

  getUserBasket(): Observable<BasketDto> {
    return this._httpClient.get<BasketDto>(BasketControllerRoute.userBasket);
  }

  importPurchaseList(dto: ImportPurchaseListToBasketDto): Observable<BasketDto> {
    return this._httpClient.post<BasketDto>(BasketControllerRoute.importPurchaseList, dto);
  }

  update(id: string, dto: BasketFormDto): Observable<BasketFormDto> {
    return this._httpClient.put<BasketFormDto>(`${BasketControllerRoute.base}${id}`, dto);
  }
}
