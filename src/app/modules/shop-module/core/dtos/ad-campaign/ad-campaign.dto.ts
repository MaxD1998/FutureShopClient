import { IdFileIdDto } from '../../../../../core/dtos/id-fileId.dto';
import { AdCampaignType } from '../../enums/ad-campaign-type';
import { ProductShopListDto } from '../product/product-shop.list-dto';
import { PromotionDto } from '../promotion/promotion.dto';

export interface AdCampaignDto extends IdFileIdDto {
  products: ProductShopListDto[];
  promotion: PromotionDto;
  type: AdCampaignType;
}
