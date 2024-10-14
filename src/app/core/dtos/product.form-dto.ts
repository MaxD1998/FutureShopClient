import { ProductParameterValueFormDto } from './product-parameter-value.form-dto';
import { ProductPhotoFormDto } from './product-photo.form-dto';
import { ProductTranslationFormDto } from './product-translation.form-dto';

export interface ProductFormDto {
  description: string;
  name: string;
  price: number;
  productBaseId: string;
  productParameterValues: ProductParameterValueFormDto[];
  productPhotos: ProductPhotoFormDto[];
  translations: ProductTranslationFormDto[];
}
