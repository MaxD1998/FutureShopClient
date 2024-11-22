import { ChangeDetectionStrategy, Component, inject, Injector, model, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { map, of, switchMap } from 'rxjs';
import { ClientRoute } from '../../../../../core/constants/client-routes/client.route';
import { ProductPhotoDataService } from '../../../../../core/data-services/product-photo.data-service';
import { IconType } from '../../../../../core/enums/icon-type';
import { ProductShopListModel } from '../../../../../core/models/product-shop.list-model';
import { AddProductToPurchaseListComponent } from '../../../../shared/add-product-to-purchase-list/add-product-to-purchase-list.component';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { DropDownComponent } from '../../../../shared/drop-down/drop-down.component';
import { IconComponent } from '../../../../shared/icon/icon.component';

@Component({
  selector: 'app-product-shop-item',
  standalone: true,
  imports: [TranslateModule, ButtonComponent, IconComponent, DropDownComponent, AddProductToPurchaseListComponent],
  templateUrl: './product-shop-item.component.html',
  styleUrl: './product-shop-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductShopItemComponent {
  private readonly _injector = inject(Injector);
  private readonly _productPhotoDataService = inject(ProductPhotoDataService);
  private readonly _router = inject(Router);

  IconType: typeof IconType = IconType;

  product = model.required<ProductShopListModel>();

  image = toSignal<string>(
    toObservable(this.product, { injector: this._injector }).pipe(
      switchMap(product => {
        return product.image.fileId ? this._productPhotoDataService.getById(product.image.fileId) : of(null);
      }),
      map(response => (response ? URL.createObjectURL(response) : '')),
    ),
  );

  isFavouriteOpen = signal<boolean>(false);
  isHover = signal<boolean>(false);

  addToBasket(event: Event): void {
    event.stopPropagation();
  }

  addToFavourite(): void {
    this.isFavouriteOpen.set(!this.isFavouriteOpen());
  }

  goToDetails(): void {
    this._router.navigateByUrl(`${ClientRoute.product}/${ClientRoute.details}/${this.product().id}`);
  }

  onInPurchaseListChange(value: boolean): void {
    const product = this.product();
    if (!product) {
      return;
    }

    product.isInPurchaseList = value;
    this.product.set(product);
  }

  setHover(value: boolean): void {
    if (this.isHover() != value) {
      this.isHover.set(value);
    }

    if (this.isFavouriteOpen() && !this.isHover()) {
      this.isFavouriteOpen.set(value);
    }
  }
}