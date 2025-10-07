import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IdNameDto } from '../../../../core/dtos/id-name.dto';
import { PageDto } from '../../../../core/dtos/page.dto';
import { PromotionControllerRoute } from '../constants/api-routes/promotion-controller.route';
import { PromotionListDto } from '../dtos/promotion/promotion-list.dto';
import { PromotionRequestFormDto } from '../dtos/promotion/promotion.request-form-dto';
import { PromotionResponseFormDto } from '../dtos/promotion/promotion.response-form-dto';

@Injectable({
  providedIn: 'root',
})
export class PromotionDataService {
  private readonly _httpClient = inject(HttpClient);

  create(dto: PromotionRequestFormDto): Observable<PromotionResponseFormDto> {
    return this._httpClient.post<PromotionResponseFormDto>(PromotionControllerRoute.base, dto);
  }

  delete(id: string): Observable<null> {
    return this._httpClient.delete<null>(`${PromotionControllerRoute.base}${id}`);
  }

  getActualCodes(): Observable<string[]> {
    const url = `${PromotionControllerRoute.actualCodes}`;
    return this._httpClient.get<string[]>(url);
  }

  getById(id: string): Observable<PromotionResponseFormDto> {
    const url = `${PromotionControllerRoute.base}${id}`;
    return this._httpClient.get<PromotionResponseFormDto>(url);
  }

  getListIdName(): Observable<IdNameDto[]> {
    const url = `${PromotionControllerRoute.all}`;
    return this._httpClient.get<IdNameDto[]>(url);
  }

  getPage(pageNumber: number): Observable<PageDto<PromotionListDto>> {
    const url = `${PromotionControllerRoute.page}${pageNumber}`;
    return this._httpClient.get<PageDto<PromotionListDto>>(url);
  }

  update(id: string, dto: PromotionRequestFormDto): Observable<PromotionResponseFormDto> {
    const url = `${PromotionControllerRoute.base}${id}`;
    return this._httpClient.put<PromotionResponseFormDto>(url, dto);
  }
}
