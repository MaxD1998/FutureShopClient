import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { UserService } from '../../../auth-module/core/services/user.service';
import { PurchaseListDataService } from '../data-services/purchase-list.data-service';
import { PurchaseListItemFormDto } from '../dtos/purchase-list-item.from-dto';
import { PurchaseListDto } from '../dtos/purchase-list.dto';
import { PurchaseListFormDto } from '../dtos/purchase-list.from-dto';
import { BasketService } from './basket.service';

@Injectable({
  providedIn: 'root',
})
export class PurchaseListService {
  private readonly _basketService = inject(BasketService);
  private readonly _purchaseListDataService = inject(PurchaseListDataService);
  private readonly _userService = inject(UserService);

  readonly purchaseLists$: BehaviorSubject<PurchaseListDto[]> = new BehaviorSubject<PurchaseListDto[]>([]);

  addOrRemovePurchaseListItem(addPurchaseListIds: string[], productId: string, callback?: () => void): void {
    this.purchaseLists$
      .pipe(
        take(1),
        switchMap(purchaseLists => {
          const purchaseListForms = purchaseLists.map<PurchaseListFormDto>(purchaseList => {
            return {
              id: purchaseList.id,
              isFavourite: purchaseList.isFavourite,
              name: purchaseList.name,
              purchaseListItems: purchaseList.purchaseListItems.map<PurchaseListItemFormDto>(purchaseListItem => {
                return {
                  id: purchaseListItem.id,
                  productId: purchaseListItem.productId,
                };
              }),
            };
          });
          const addPurchaseList = purchaseListForms.filter(x => addPurchaseListIds.includes(x.id as string));
          addPurchaseList.forEach(x => {
            if (!x.purchaseListItems.some(y => y.productId == productId)) {
              x.purchaseListItems.push({
                productId: productId,
              });
            }
          });

          const removePurchaseList = purchaseListForms.filter(
            x =>
              !addPurchaseListIds.includes(x.id as string) && x.purchaseListItems.some(y => y.productId == productId),
          );

          removePurchaseList.forEach(x => {
            x.purchaseListItems = x.purchaseListItems.filter(y => y.productId != productId);
          });

          const resultArray = [addPurchaseList, removePurchaseList].flat();
          const result$ =
            resultArray.length > 0
              ? forkJoin(resultArray.map(x => this._purchaseListDataService.update(x.id as string, x)))
              : of([]);

          return result$;
        }),
        switchMap(response => {
          return forkJoin({
            purchaseLists: response.length > 0 ? this.getUserPurchaseLists$() : this.purchaseLists$.pipe(take(1)),
            basket: this._basketService.basket$.pipe(
              take(1),
              switchMap(basket => {
                return basket ? (basket.basketItems.length > 0 ? this._basketService.getBasket$() : of([])) : of([]);
              }),
            ),
          });
        }),
      )
      .subscribe({
        next: response => {
          this.purchaseLists$.next(response.purchaseLists);

          if (callback) {
            callback();
          }
        },
      });
  }

  create(dto: PurchaseListFormDto, callback?: (dto: PurchaseListDto) => void): void {
    this.create$(dto).subscribe({
      next: response => {
        this.purchaseLists$.next(response.list);
        if (callback) {
          callback(response.newValue);
        }
      },
    });
  }

  getUserPurchaseLists$(): Observable<PurchaseListDto[]> {
    const key = 'favouriteId';
    return this._userService.user$.pipe(
      take(1),
      switchMap(user => {
        if (user) {
          return this._purchaseListDataService.getListByUserIdFromJwt().pipe(
            switchMap(response => {
              if (response && response.length > 0) {
                return of(response);
              } else {
                return this._purchaseListDataService
                  .create({
                    isFavourite: true,
                    purchaseListItems: [],
                  })
                  .pipe(switchMap(() => this._purchaseListDataService.getListByUserIdFromJwt()));
              }
            }),
          );
        } else {
          const favouriteId = localStorage.getItem(key);
          const result$ = favouriteId
            ? this._purchaseListDataService.getById(favouriteId)
            : this._purchaseListDataService.create({ isFavourite: true, purchaseListItems: [] }).pipe(
                switchMap(response =>
                  this._purchaseListDataService.getById(response.id as string).pipe(
                    tap(response => {
                      localStorage.setItem(key, response.id as string);
                    }),
                  ),
                ),
              );
          return result$.pipe(
            switchMap(response => {
              const result$ = response
                ? of([response])
                : this._purchaseListDataService.create({ isFavourite: true, purchaseListItems: [] }).pipe(
                    switchMap(response =>
                      this._purchaseListDataService.getById(response.id as string).pipe(
                        tap(response => {
                          localStorage.setItem(key, response.id as string);
                        }),
                        map(response => [response]),
                      ),
                    ),
                  );

              return result$;
            }),
          );
        }
      }),
      tap(purchaseLists => {
        this.purchaseLists$.next(purchaseLists);
      }),
    );
  }

  private create$(dto: PurchaseListFormDto): Observable<{
    list: PurchaseListDto[];
    newValue: PurchaseListDto;
  }> {
    return this._purchaseListDataService.create(dto).pipe(
      switchMap(response => {
        return forkJoin({
          list: this.purchaseLists$.pipe(take(1)),
          newValue: this._purchaseListDataService.getById(response.id as string),
        });
      }),
      switchMap(response => {
        response.list.push(response.newValue);
        const list = response.list.sort((a, b) => {
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

        return forkJoin({
          list: of(list),
          newValue: of(response.newValue),
        });
      }),
    );
  }
}
