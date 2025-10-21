import { AdCampaignType } from '../../enums/ad-campaign-type';
import { AdCampaignItemFormDto } from './ad-campaign-item.form-dto';
import { AdCampaignProductFormDto } from './ad-campaign-product.form-dto';

export interface AdCampaignRequestFormDto {
  adCampaignItems: AdCampaignItemFormDto[];
  adCampaignProducts: AdCampaignProductFormDto[];
  end: Date;
  isActive: boolean;
  name: string;
  promotionId?: string;
  start: Date;
  type: AdCampaignType;
}
