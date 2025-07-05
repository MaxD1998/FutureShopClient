import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PageDto } from '../../../../core/dtos/page.dto';
import { AdCampaignControllerRoute } from '../constants/api-routes/ad-campaign-controller.route';
import { AdCampaignListDto } from '../dtos/ad-campaign/ad-campaign-list.dto';
import { AdCampaignFormDto } from '../dtos/ad-campaign/ad-campaign.form-dto';

@Injectable({
  providedIn: 'root',
})
export class AdCampaignDataService {
  private readonly _httpClient = inject(HttpClient);

  add(dto: AdCampaignFormDto): Observable<AdCampaignFormDto> {
    return this._httpClient.post<AdCampaignFormDto>(AdCampaignControllerRoute.base, dto);
  }

  delete(id: string): Observable<null> {
    return this._httpClient.delete<null>(`${AdCampaignControllerRoute.base}${id}`);
  }

  getActual(): Observable<string[]> {
    const url = `${AdCampaignControllerRoute.actual}`;
    return this._httpClient.get<string[]>(url);
  }

  getById(id: string): Observable<AdCampaignFormDto> {
    const url = `${AdCampaignControllerRoute.base}${id}`;
    return this._httpClient.get<AdCampaignFormDto>(url);
  }

  getPage(pageNumber: number): Observable<PageDto<AdCampaignListDto>> {
    const url = `${AdCampaignControllerRoute.page}${pageNumber}`;
    return this._httpClient.get<PageDto<AdCampaignListDto>>(url);
  }

  update(id: string, dto: AdCampaignFormDto): Observable<AdCampaignFormDto> {
    const url = `${AdCampaignControllerRoute.base}${id}`;
    return this._httpClient.put<AdCampaignFormDto>(url, dto);
  }
}
