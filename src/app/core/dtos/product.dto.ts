import { IdNameValueDto } from './id-name-value.dto';

export interface ProductDto {
  fileIds: string[];
  id: string;
  name: string;
  price: number;
  productParameters: IdNameValueDto[];
}
