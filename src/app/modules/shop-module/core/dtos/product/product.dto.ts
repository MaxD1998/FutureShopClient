import { IdNameValueDto } from '../../../../../core/dtos/id-name-value.dto';

export interface ProductDto {
  fileIds: string[];
  id: string;
  isInPurchaseList: boolean;
  name: string;
  originalPrice: number;
  price: number;
  productParameters: IdNameValueDto[];
  rating: number;
  reviewCount: number;
  userWasReviewer: boolean;
}
