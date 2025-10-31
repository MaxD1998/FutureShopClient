import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PurchaseListControllerRoute } from '../constants/public-controllers/purchase-list-public-controller.route';
import { ImportBasketToPurchaseListDto } from '../dtos/basket/import-purchase-list-to-basket.dto';
import { PurchaseListDto } from '../dtos/purchase-list/purchase-list.dto';
import { PurchaseListRequestFormDto } from '../dtos/purchase-list/purchase-list.request-from-dto';
import { PurchaseListResponseFormDto } from '../dtos/purchase-list/purchase-list.response-from-dto';

@Injectable({
  providedIn: 'root',
})
export class PurchaseListPublicDataService {
  private readonly _httpClient = inject(HttpClient);

  create(dto: PurchaseListRequestFormDto): Observable<PurchaseListResponseFormDto> {
    return this._httpClient.post<PurchaseListResponseFormDto>(PurchaseListControllerRoute.base, dto);
  }

  delete(id: string): Observable<null> {
    return this._httpClient.delete<null>(`${PurchaseListControllerRoute.base}${id}`);
  }

  getById(id: string): Observable<PurchaseListDto> {
    const url = `${PurchaseListControllerRoute.base}${id}`;
    return this._httpClient.get<PurchaseListDto>(url);
  }

  getListByUserIdFromJwt(): Observable<PurchaseListDto[]> {
    const url = `${PurchaseListControllerRoute.base}`;
    return this._httpClient.get<PurchaseListDto[]>(url);
  }

  importBasket(dto: ImportBasketToPurchaseListDto): Observable<PurchaseListDto> {
    return this._httpClient.post<PurchaseListDto>(PurchaseListControllerRoute.importBasket, dto);
  }

  update(id: string, dto: PurchaseListRequestFormDto): Observable<PurchaseListResponseFormDto> {
    return this._httpClient.put<PurchaseListResponseFormDto>(`${PurchaseListControllerRoute.base}${id}`, dto);
  }
}
