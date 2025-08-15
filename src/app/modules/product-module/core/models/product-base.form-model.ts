import { ProductParameterFormModel } from '../../core/models/product-parameter.form-model';
import { ProductBaseRequestFormDto } from '../dtos/product-base/product-base.request-form-dto';

export class ProductBaseFormModel {
  constructor(dto?: ProductBaseRequestFormDto) {
    if (!dto) {
      return;
    }

    this.categoryId = dto.categoryId;
    this.name = dto.name;
    this.productParameters = dto.productParameters.map((x, index) => new ProductParameterFormModel(x, index));
  }

  categoryId: string;
  name: string;
  productParameters: ProductParameterFormModel[] = [];

  mapToDto(): ProductBaseRequestFormDto {
    return {
      categoryId: this.categoryId,
      name: this.name,
      productParameters: this.productParameters.map(x => x.mapToDto()),
    };
  }
}
