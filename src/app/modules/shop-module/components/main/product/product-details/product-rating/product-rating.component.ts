import { AsyncPipe } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { forkJoin, switchMap } from 'rxjs';
import { UserService } from '../../../../../../auth-module/core/services/user.service';
import { ProductReviewResponseFormDto } from '../../../../../core/dtos/product/product-review/product-review.response-form-dto';
import { ProductDto } from '../../../../../core/dtos/product/product.dto';
import { ProductReviewPublicDataService } from '../../../../../core/public-data-services/product-review.public-data-service';
import { ProductPublicDataService } from '../../../../../core/public-data-services/product.public-data-service';
import { AddUpdateProductReviewComponent } from './add-update-product-review/add-update-product-review.component';
import { ProductRatingItemComponent } from './product-rating-item/product-rating-item.component';

@Component({
  selector: 'app-product-rating',
  imports: [AsyncPipe, TranslateModule, ProductRatingItemComponent, AddUpdateProductReviewComponent],
  templateUrl: './product-rating.component.html',
  styleUrl: './product-rating.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductRatingComponent {
  private readonly _productPublicDataService = inject(ProductPublicDataService);
  private readonly _productReviewDataService = inject(ProductReviewPublicDataService);
  readonly userService = inject(UserService);

  product = model.required<ProductDto>();

  isEditMode = signal<boolean>(false);
  productReviews = signal<ProductReviewResponseFormDto[]>([]);

  constructor() {
    afterNextRender(() => {
      this._productReviewDataService.getPageByProductId(this.product().id, { pageNumber: 1, pageSize: 10 }).subscribe({
        next: reviews => {
          this.productReviews.set(Array.from(reviews.items));
        },
      });
    });
  }

  remove(productReviewId: string): void {
    this._productReviewDataService
      .delete(productReviewId)
      .pipe(
        switchMap(() => {
          return forkJoin({
            product: this._productPublicDataService.getDetailsById(this.product().id),
            productReviews: this._productReviewDataService.getPageByProductId(this.product().id, {
              pageNumber: 1,
              pageSize: 10,
            }),
          });
        }),
      )
      .subscribe({
        next: ({ product, productReviews }) => {
          this.product.set(product);
          this.productReviews.set(Array.from(productReviews.items));
        },
      });
  }
}
