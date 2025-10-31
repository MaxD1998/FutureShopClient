import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IdFileIdDto } from '../../../../core/dtos/id-fileId.dto';
import { AdCampaignPublicControllerRoute } from '../constants/public-controllers/ad-campaign-public-controller.route';
import { AdCampaignDto } from '../dtos/ad-campaign/ad-campaign.dto';

@Injectable({
  providedIn: 'root',
})
export class AdCampaignPublicDataService {
  private readonly _httpClient = inject(HttpClient);

  getActual(): Observable<IdFileIdDto[]> {
    const url = `${AdCampaignPublicControllerRoute.actual}`;
    return this._httpClient.get<IdFileIdDto[]>(url);
  }

  getActualById(id: string): Observable<AdCampaignDto> {
    const url = `${AdCampaignPublicControllerRoute.actualById}${id}`;
    return this._httpClient.get<AdCampaignDto>(url);
  }
}
