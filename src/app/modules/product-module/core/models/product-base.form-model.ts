import { ProductParameterFormModel } from '../../core/models/product-parameter.form-model';
import { ProductBaseFormDto } from '../dtos/product-base.form-dto';

export class ProductBaseFormModel {
  constructor(dto?: ProductBaseFormDto) {
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

  mapToDto(): ProductBaseFormDto {
    return {
      categoryId: this.categoryId,
      name: this.name,
      productParameters: this.productParameters.map(x => x.mapToDto()),
    };
  }
}
