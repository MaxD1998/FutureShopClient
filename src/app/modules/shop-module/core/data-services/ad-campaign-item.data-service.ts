import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AdCampaignItemControllerRoute } from '../constants/api-routes/ad-campaign-item-controller.route';
import { AdCampaignItemInfoDto } from '../dtos/ad-campaign-item.info-dto';

@Injectable({
  providedIn: 'root',
})
export class AdCampaignItemDataService {
  private readonly _httpClient = inject(HttpClient);

  addList(blobs: Blob[]): Observable<string[]> {
    const form = new FormData();

    blobs.forEach(x => {
      form.append('files', x);
    });

    return this._httpClient.post<string[]>(AdCampaignItemControllerRoute.base, form);
  }

  getById(id: string): Observable<Blob> {
    const url = `${AdCampaignItemControllerRoute.base}${id}`;
    return this._httpClient.get(url, { responseType: 'blob' });
  }

  getListInfoByIds(ids: string[]): Observable<AdCampaignItemInfoDto[]> {
    let params = new HttpParams();

    ids.forEach(x => {
      params = params.append('ids', x);
    });

    return this._httpClient.get<AdCampaignItemInfoDto[]>(AdCampaignItemControllerRoute.info, { params: params });
  }
}
