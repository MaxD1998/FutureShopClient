import { ProductPhotoFormDto } from './product-photo.form-dto';

export interface ProductFormDto {
  name: string;
  productBaseId: string;
  productPhotos: ProductPhotoFormDto[];
}
