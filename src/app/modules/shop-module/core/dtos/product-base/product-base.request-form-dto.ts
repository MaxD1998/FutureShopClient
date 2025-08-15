import { ProductParameterFormDto } from './product-parameter.form-dto';

export interface ProductBaseRequestFormDto {
  categoryId: string;
  name: string;
  productParameters: ProductParameterFormDto[];
}
