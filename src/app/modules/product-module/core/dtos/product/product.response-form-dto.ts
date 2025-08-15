import { ProductRequestFormDto } from './product.request-form-dto';

export interface ProductResponseFormDto extends ProductRequestFormDto {
  id: string;
}
