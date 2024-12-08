import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { skip, Subject, takeUntil } from 'rxjs';
import { ClientRoute } from '../../core/constants/client-routes/client.route';
import { BasketItemDto } from '../../core/dtos/basket-item.dto';
import { IconType } from '../../core/enums/icon-type';
import { BasketService } from '../../core/services/basket.service';
import { ImportService } from '../../core/services/import.service';
import { UserService } from '../../core/services/user.service';
import { AddPurchaseListComponent } from '../shared/add-purchase-list/add-purchase-list.component';
import { ButtonComponent } from '../shared/button/button.component';
import { IconComponent } from '../shared/icon/icon.component';
import { DialogWindowComponent } from '../shared/modals/dialog-window/dialog-window.component';
import { BasketItemComponent } from './basket-item/basket-item.component';

@Component({
  selector: 'app-basket',
  imports: [
    AsyncPipe,
    RouterLink,
    TranslateModule,
    IconComponent,
    ButtonComponent,
    BasketItemComponent,
    DialogWindowComponent,
    AddPurchaseListComponent,
  ],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketComponent implements OnDestroy {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _importService = inject(ImportService);
  private readonly _unsubscribe: Subject<void> = new Subject<void>();

  private _timeout?: NodeJS.Timeout;

  readonly basketService = inject(BasketService);
  readonly userService = inject(UserService);

  images: Record<string, string> = this._activatedRoute.snapshot.data['data']['images'];

  basketItems = signal<BasketItemDto[]>(this._activatedRoute.snapshot.data['data']['basketItems']);
  isDialogActive = signal<boolean>(false);
  isFavouriteOpen = signal<boolean>(false);

  totalAmount = computed<number>(() => {
    const basketItems = this.basketItems();
    return basketItems.map(item => item.productPrice * item.quantity).reduce((total, num) => total + num);
  });

  loginPath = `/${ClientRoute.auth}/${ClientRoute.login}`;
  mainPath = `/${ClientRoute.main}`;
  IconType: typeof IconType = IconType;

  constructor() {
    this.basketService
      .initBasketData()
      .pipe(takeUntil(this._unsubscribe), skip(1))
      .subscribe(response => {
        this.basketItems.set(Array.from(response.basketItems));
        this.images = response.images;
      });
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
    if (this._timeout) {
      clearTimeout(this._timeout);
    }
  }

  changeBasketItem(value: BasketItemDto): void {
    const basketItem = this.basketItems().find(x => x.id == value.id);
    if (basketItem) {
      basketItem.quantity = value.quantity;
      basketItem.productIsInPurchaseList = value.productIsInPurchaseList;
      this.basketItems.set(Array.from(this.basketItems()));
    }
  }

  changeQuantity(basketItem: BasketItemDto): void {
    if (this._timeout) {
      clearTimeout(this._timeout);
    }

    this._timeout = setTimeout(() => {
      this.basketService.editBasketItem({
        id: basketItem.id,
        productId: basketItem.productId,
        quantity: basketItem.quantity,
      });
    }, 600);
  }

  exportToPurchaseList(name: string): void {
    this._importService.importBasketToPurchaseList(name);
    this.isDialogActive.set(false);
  }
}
