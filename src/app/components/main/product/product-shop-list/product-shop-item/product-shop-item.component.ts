import { ChangeDetectionStrategy, Component, inject, Injector, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { map, of, switchMap } from 'rxjs';
import { ClientRoute } from '../../../../../core/constants/client-routes/client.route';
import { ProductPhotoDataService } from '../../../../../core/data-services/product-photo.data-service';
import { IconType } from '../../../../../core/enums/icon-type';
import { ProductShopListModel } from '../../../../../core/models/product-shop.list-model';
import { ButtonComponent } from '../../../../shared/button/button.component';

@Component({
  selector: 'app-product-shop-item',
  standalone: true,
  imports: [TranslateModule, ButtonComponent],
  templateUrl: './product-shop-item.component.html',
  styleUrl: './product-shop-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductShopItemComponent {
  private readonly _injector = inject(Injector);
  private readonly _productPhotoDataService = inject(ProductPhotoDataService);
  private readonly _router = inject(Router);

  IconType: typeof IconType = IconType;

  product = input.required<ProductShopListModel>();

  image = toSignal<string>(
    toObservable(this.product, { injector: this._injector }).pipe(
      switchMap(product => {
        return product.image.fileId ? this._productPhotoDataService.getById(product.image.fileId) : of(null);
      }),
      map(response => (response ? URL.createObjectURL(response) : '')),
    ),
  );

  addToBasket(event: Event): void {
    event.stopPropagation();
  }

  goToDetails(): void {
    this._router.navigateByUrl(`${ClientRoute.product}/${ClientRoute.details}/${this.product().id}`);
  }
}
