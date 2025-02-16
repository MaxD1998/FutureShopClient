import { ProductParameterFormDto } from '../../../product-module/core/dtos/product-parameter.form-dto';

export interface ProductBaseFormDto {
  categoryId: string;
  name: string;
  productParameters: ProductParameterFormDto[];
}
