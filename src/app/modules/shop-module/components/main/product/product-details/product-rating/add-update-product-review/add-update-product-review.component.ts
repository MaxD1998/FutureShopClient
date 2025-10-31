import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { forkJoin, of, switchMap } from 'rxjs';
import { ButtonComponent } from '../../../../../../../../components/shared/button/button.component';
import { InputAreaComponent } from '../../../../../../../../components/shared/input-area/input-area.component';
import { RatingComponent } from '../../../../../../../../components/shared/rating/rating.component';
import { ProductReviewResponseFormDto } from '../../../../../../core/dtos/product/product-review/product-review.response-form-dto';
import { ProductDto } from '../../../../../../core/dtos/product/product.dto';
import { ProductReviewPublicDataService } from '../../../../../../core/public-data-services/product-review.public-data-service';
import { ProductPublicDataService } from '../../../../../../core/public-data-services/product.public-data-service';

@Component({
  selector: 'app-add-update-product-review',
  imports: [TranslateModule, RatingComponent, ButtonComponent, InputAreaComponent],
  templateUrl: './add-update-product-review.component.html',
  styleUrl: './add-update-product-review.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddUpdateProductReviewComponent {
  private readonly _productPublicDataService = inject(ProductPublicDataService);
  private readonly _productReviewDataService = inject(ProductReviewPublicDataService);

  product = model.required<ProductDto>();
  productReviews = model.required<ProductReviewResponseFormDto[]>();

  productReview = input<ProductReviewResponseFormDto | undefined>(undefined);

  onSaved = output<void>();

  comment = signal<string | null>(null);
  rating = signal<number>(0);

  constructor() {
    afterNextRender(() => {
      const productReview = this.productReview();
      if (productReview) {
        this.rating.set(productReview.rating);
        this.comment.set(productReview.comment ?? null);
      }
    });
  }

  submit(): void {
    const productReview = this.productReview();
    if (productReview) {
      this._productReviewDataService
        .update(productReview.id, {
          productId: productReview.productId,
          rating: this.rating(),
          comment: this.comment() ?? undefined,
        })
        .pipe(
          switchMap(response => {
            return forkJoin({
              product: this._productPublicDataService.getDetailsById(this.product().id),
              productReview: of(response),
            });
          }),
        )
        .subscribe({
          next: ({ product, productReview }) => {
            this.product.set(product);

            const array = [productReview, ...this.productReviews().filter(x => x.id !== productReview.id)];
            this.productReviews.set(Array.from(array));
            this.onSaved.emit();
          },
        });
    } else {
      this._productReviewDataService
        .create({
          productId: this.product().id,
          rating: this.rating(),
          comment: this.comment() ?? undefined,
        })
        .pipe(
          switchMap(response => {
            return forkJoin({
              product: this._productPublicDataService.getDetailsById(this.product().id),
              productReview: of(response),
            });
          }),
        )
        .subscribe({
          next: ({ product, productReview }) => {
            this.product.set(product);
            const array = [productReview, ...this.productReviews()];
            this.productReviews.set(Array.from(array));
            this.onSaved.emit();
          },
        });
    }
  }
}
