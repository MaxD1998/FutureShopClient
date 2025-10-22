import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ProductListModel } from '../../../../core/models/product-shop.list-model';
import { ProductShopItemComponent } from '../../../shared/product-shop-item/product-shop-item.component';

@Component({
  selector: 'app-ad-product-shop-list',
  imports: [ProductShopItemComponent],
  templateUrl: './ad-product-shop-list.component.html',
  styleUrl: './ad-product-shop-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdProductShopListComponent {
  products = input.required<ProductListModel[]>();
}
