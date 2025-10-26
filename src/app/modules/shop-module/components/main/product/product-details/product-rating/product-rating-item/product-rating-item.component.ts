import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { ButtonSmallIconComponent } from '../../../../../../../../components/shared/button-small-icon/button-small-icon.component';
import { RatingComponent } from '../../../../../../../../components/shared/rating/rating.component';
import { ButtonLayout } from '../../../../../../../../core/enums/button-layout';
import { IconType } from '../../../../../../../../core/enums/icon-type';
import { UserService } from '../../../../../../../auth-module/core/services/user.service';
import { ProductReviewResponseFormDto } from '../../../../../../core/dtos/product/product-review/product-review.response-form-dto';

@Component({
  selector: 'app-product-rating-item',
  imports: [AsyncPipe, RatingComponent, ButtonSmallIconComponent],
  templateUrl: './product-rating-item.component.html',
  styleUrl: './product-rating-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductRatingItemComponent {
  readonly userService = inject(UserService);

  ButtonLayout: typeof ButtonLayout = ButtonLayout;
  IconType: typeof IconType = IconType;

  productReview = input.required<ProductReviewResponseFormDto>();

  onEdit = output<string>();
  onRemove = output<string>();
}
