import { PromotionType } from '../../enums/promotion-type';
import { PromotionProductFormDto } from './promotion-product.form-dto';

export interface PromotionRequestFormDto {
  adCampaignId?: string;
  code: string;
  end: Date;
  isActive: boolean;
  name: string;
  promotionProducts: PromotionProductFormDto[];
  start: Date;
  type: PromotionType;
  value: any;
}
