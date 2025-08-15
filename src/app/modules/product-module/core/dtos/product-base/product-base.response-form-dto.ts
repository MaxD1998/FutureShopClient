import { ProductBaseRequestFormDto } from './product-base.request-form-dto';

export interface ProductBaseResponseFormDto extends ProductBaseRequestFormDto {
  id: string;
}
