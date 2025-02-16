import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PurchaseListControllerRoute } from '../constants/api-routes/purchase-list-controller.route';
import { ImportBasketToPurchaseListDto } from '../dtos/import-purchase-list-to-basket.dto';
import { PurchaseListDto } from '../dtos/purchase-list.dto';
import { PurchaseListFormDto } from '../dtos/purchase-list.from-dto';

@Injectable({
  providedIn: 'root',
})
export class PurchaseListDataService {
  private readonly _httpClient = inject(HttpClient);

  create(dto: PurchaseListFormDto): Observable<PurchaseListFormDto> {
    return this._httpClient.post<PurchaseListFormDto>(PurchaseListControllerRoute.base, dto);
  }

  dalete(id: string): Observable<null> {
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

  update(id: string, dto: PurchaseListFormDto): Observable<PurchaseListFormDto> {
    return this._httpClient.put<PurchaseListFormDto>(`${PurchaseListControllerRoute.base}${id}`, dto);
  }
}
