import { inject, Injectable } from '@angular/core';
import { filter, forkJoin, of, switchMap, take, tap } from 'rxjs';
import { BasketDataService } from '../data-services/basket.data-service';
import { PurchaseListDataService } from '../data-services/purchase-list.data-service';
import { BasketDto } from '../dtos/basket/basket.dto';
import { PurchaseListDto } from '../dtos/purchase-list/purchase-list.dto';
import { BasketService } from './basket.service';
import { PurchaseListService } from './purchase-list.service';

@Injectable({
  providedIn: 'root',
})
export class ImportService {
  private readonly _basketDataService = inject(BasketDataService);
  private readonly _basketService = inject(BasketService);
  private readonly _purchaseListDataService = inject(PurchaseListDataService);
  private readonly _purchaseListService = inject(PurchaseListService);

  importBasketToPurchaseList(name: string): void {
    this._basketService.basket$
      .pipe(
        take(1),
        filter(basket => !!basket),
        switchMap(basket => {
          return forkJoin({
            list: this._purchaseListService.purchaseLists$.pipe(take(1)),
            newValue: this._purchaseListDataService.importBasket({
              basketId: basket?.id,
              name: name,
            }),
          });
        }),
        tap(data => {
          data.list.push(data.newValue);
          const list = data.list.sort((a, b) => {
            if (a.isFavourite > b.isFavourite) {
              return -1;
            }

            if (a.isFavourite < b.isFavourite) {
              return 1;
            }

            if (a.name.toUpperCase() > b.name.toUpperCase()) {
              return 1;
            }

            if (a.name.toUpperCase() < b.name.toUpperCase()) {
              return -1;
            }

            return 0;
          });

          this._purchaseListService.purchaseLists$.next(list);
        }),
        switchMap(() => this._basketService.getBasket$()),
      )
      .subscribe();
  }

  importPurchaseListToBasket(purchaseListId: string): void {
    forkJoin({
      basket: this._basketService.basket$.pipe(take(1)),
      purchaseList: this._purchaseListService.purchaseLists$.pipe(
        take(1),
        switchMap(purchaseLists => {
          return of(purchaseLists.find(x => x.id === purchaseListId));
        }),
      ),
    })
      .pipe(
        filter(data => !!data.basket && !!data.purchaseList),
        switchMap(data => {
          const basket = data.basket as BasketDto;
          const purchaseList = data.purchaseList as PurchaseListDto;

          return this._basketDataService.importPurchaseList({
            basketId: basket.id,
            purchaseListId: purchaseList.id as string,
          });
        }),
        tap(basket => {
          this._basketService.basket$.next(basket);
        }),
      )
      .subscribe();
  }
}
