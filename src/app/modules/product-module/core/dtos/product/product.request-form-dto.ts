import { ProductPhotoFormDto } from './product-photo.form-dto';

export interface ProductRequestFormDto {
  name: string;
  productBaseId: string;
  productPhotos: ProductPhotoFormDto[];
}
