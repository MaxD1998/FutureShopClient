import { ChangeDetectionStrategy, Component, inject, input, model, output, signal } from '@angular/core';
import { ButtonIconComponent } from '../../../../../../components/shared/button-icon/button-icon.component';
import { DropDownComponent } from '../../../../../../components/shared/drop-down/drop-down.component';
import { InputPlusMinusComponent } from '../../../../../../components/shared/input-plus-minus/input-plus-minus.component';
import { ButtonLayout } from '../../../../../../core/enums/button-layout';
import { IconType } from '../../../../../../core/enums/icon-type';
import { BasketItemDto } from '../../../../core/dtos/basket-item.dto';
import { BasketService } from '../../../../core/services/basket.service';
import { AddProductToPurchaseListComponent } from '../../../shared/add-product-to-purchase-list/add-product-to-purchase-list.component';

@Component({
  selector: 'app-basket-item',
  imports: [InputPlusMinusComponent, DropDownComponent, AddProductToPurchaseListComponent, ButtonIconComponent],
  templateUrl: './basket-item.component.html',
  styleUrl: './basket-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketItemComponent {
  readonly basketService = inject(BasketService);

  basketItem = model.required<BasketItemDto>();
  image = input<string>('');

  quantityChange = output<BasketItemDto>();

  isFavouriteOpen = signal<boolean>(false);

  ButtonLayout = ButtonLayout;
  IconType = IconType;

  onInPurchaseListChange(value: boolean): void {
    this.basketItem.set({
      id: this.basketItem().id,
      productFileId: this.basketItem().productFileId,
      productId: this.basketItem().productId,
      productIsInPurchaseList: value,
      productName: this.basketItem().productName,
      productPrice: this.basketItem().productPrice,
      quantity: this.basketItem().quantity,
    });
  }

  setIsFavouriteOpen(): void {
    this.isFavouriteOpen.set(!this.isFavouriteOpen());
  }
}
