import { ProductParameterFormDto } from './product-parameter.form-dto';

export interface ProductBaseFormDto {
  categoryId: string;
  name: string;
  productParameters: ProductParameterFormDto[];
}
