import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { PageDto } from '../../../../core/dtos/page.dto';
import { AdCampaignDataService } from '../data-services/ad-campaign.data-service';
import { AdCampaignListDto } from '../dtos/ad-campaign-list.dto';

export const adCampaignListResolver: ResolveFn<PageDto<AdCampaignListDto>> = (route, state) => {
  return inject(AdCampaignDataService).getPage(route.params['pageNumber'] ?? 1);
};
