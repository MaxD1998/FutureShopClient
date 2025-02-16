import { IdNameValueDto } from '../../../../core/dtos/id-name-value.dto';

export interface ProductDto {
  fileIds: string[];
  id: string;
  isInPurchaseList: boolean;
  name: string;
  price: number;
  productParameters: IdNameValueDto[];
}
