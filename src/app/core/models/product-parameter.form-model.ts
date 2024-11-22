import { ProductParameterTranslationFormDto } from '../dtos/product-parameter-translation.form-dto';
import { ProductParameterFormDto } from '../dtos/product-parameter.form-dto';

export class ProductParameterFormModel implements ProductParameterFormDto {
  constructor(dto: ProductParameterFormDto, index: number) {
    this.id = dto.id;
    this.index = index + 1;
    this.name = dto.name;
    this.translations = dto.translations;
  }

  id?: string | undefined;
  index: number;
  name: string;
  translations: ProductParameterTranslationFormDto[];

  mapToDto(): ProductParameterFormDto {
    return {
      id: this.id,
      name: this.name,
      translations: this.translations.filter(x => x.translation),
    };
  }
}
