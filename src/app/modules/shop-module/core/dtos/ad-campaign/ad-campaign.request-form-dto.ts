import { AdCampaignItemFormDto } from './ad-campaign-item.form-dto';

export interface AdCampaignRequestFormDto {
  adCampaignItems: AdCampaignItemFormDto[];
  end: Date;
  id?: string;
  isActive: boolean;
  name: string;
  start: Date;
}
