import { ProductReviewRequestFormDto } from './product-review.request-form-dto';

export class ProductReviewResponseFormDto extends ProductReviewRequestFormDto {
  id: string;
  username: string;
}
