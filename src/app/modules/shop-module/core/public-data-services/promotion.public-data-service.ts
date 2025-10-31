import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PromotionPublicControllerRoute } from '../constants/public-controllers/promotion-public-controller.route';

@Injectable({
  providedIn: 'root',
})
export class PromotionPublicDataService {
  private readonly _httpClient = inject(HttpClient);

  getActualCodes(): Observable<string[]> {
    const url = `${PromotionPublicControllerRoute.actualCodes}`;
    return this._httpClient.get<string[]>(url);
  }
}
