import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IdFileIdDto } from '../../../../core/dtos/id-fileId.dto';
import { IdNameDto } from '../../../../core/dtos/id-name.dto';
import { PageDto } from '../../../../core/dtos/page.dto';
import { PaginationDto } from '../../../../core/dtos/pagination.dto';
import { AdCampaignControllerRoute } from '../constants/controller-routes/ad-campaign-controller.route';
import { AdCampaignListDto } from '../dtos/ad-campaign/ad-campaign-list.dto';
import { AdCampaignDto } from '../dtos/ad-campaign/ad-campaign.dto';
import { AdCampaignRequestFormDto } from '../dtos/ad-campaign/ad-campaign.request-form-dto';
import { AdCampaignResponseFormDto } from '../dtos/ad-campaign/ad-campaign.response-form-dto';

@Injectable({
  providedIn: 'root',
})
export class AdCampaignDataService {
  private readonly _httpClient = inject(HttpClient);

  //For public
  getActual(): Observable<IdFileIdDto[]> {
    const url = `${AdCampaignControllerRoute.actual}`;
    return this._httpClient.get<IdFileIdDto[]>(url);
  }

  getActualById(id: string): Observable<AdCampaignDto> {
    const url = `${AdCampaignControllerRoute.actualById}${id}`;
    return this._httpClient.get<AdCampaignDto>(url);
  }

  //For Employee
  add(dto: AdCampaignRequestFormDto): Observable<AdCampaignResponseFormDto> {
    return this._httpClient.post<AdCampaignResponseFormDto>(AdCampaignControllerRoute.base, dto);
  }

  delete(id: string): Observable<null> {
    return this._httpClient.delete<null>(`${AdCampaignControllerRoute.base}${id}`);
  }

  getById(id: string): Observable<AdCampaignResponseFormDto> {
    const url = `${AdCampaignControllerRoute.base}${id}`;
    return this._httpClient.get<AdCampaignResponseFormDto>(url);
  }

  getListIdName(): Observable<IdNameDto[]> {
    const url = `${AdCampaignControllerRoute.all}`;
    return this._httpClient.get<IdNameDto[]>(url);
  }

  getPage(pageNumber: number): Observable<PageDto<AdCampaignListDto>> {
    const dto: PaginationDto = {
      pageNumber: pageNumber,
      pageSize: 25,
    };

    const params = new HttpParams().append('pageNumber', dto.pageNumber).append('pageSize', dto.pageSize);
    const url = `${AdCampaignControllerRoute.page}`;

    return this._httpClient.get<PageDto<AdCampaignListDto>>(url, { params: params });
  }

  update(id: string, dto: AdCampaignRequestFormDto): Observable<AdCampaignResponseFormDto> {
    const url = `${AdCampaignControllerRoute.base}${id}`;
    return this._httpClient.put<AdCampaignResponseFormDto>(url, dto);
  }
}
