import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, filter, forkJoin, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { BasketDataService } from '../data-services/basket.data-service';
import { ProductPhotoDataService } from '../data-services/product-photo.data-service';
import { BasketItemDto } from '../dtos/basket-item.dto';
import { BasketItemFormDto } from '../dtos/basket-item.form-dto';
import { BasketDto } from '../dtos/basket.dto';
import { BasketFormDto } from '../dtos/basket.form-dto';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  private readonly _userService = inject(UserService);
  private readonly _basketDataService = inject(BasketDataService);
  private readonly _productPhotoDataService = inject(ProductPhotoDataService);

  readonly basket$: BehaviorSubject<BasketDto | undefined> = new BehaviorSubject<BasketDto | undefined>(undefined);

  addToBasket(item: BasketItemFormDto): void {
    this.basket$
      .pipe(
        take(1),
        filter(basket => !!basket),
        switchMap(basket => {
          const dto: BasketFormDto = {
            basketItems: basket.basketItems.map(x => {
              return {
                id: x.id,
                productId: x.productId,
                quantity: x.quantity,
              };
            }),
            id: basket.id,
          };

          const basketItem = dto.basketItems.find(x => x.productId == item.productId);

          if (basketItem) {
            basketItem.quantity += item.quantity;
          } else {
            dto.basketItems.push({
              productId: item.productId,
              quantity: item.quantity,
            });
          }

          return this._basketDataService.update(basket.id, dto).pipe(switchMap(() => this.getBasket$()));
        }),
      )
      .subscribe({
        next: response => {
          this.basket$.next(response);
        },
      });
  }

  clearAllItems(): void {
    this.basket$
      .pipe(
        take(1),
        filter(basket => !!basket),
        switchMap(basket =>
          this._basketDataService.update(basket?.id, {
            basketItems: [],
            id: basket.id,
          }),
        ),
        switchMap(() => this.getBasket$()),
      )
      .subscribe();
  }

  deleteFromBasket(itemId: string): void {
    this.basket$
      .pipe(
        take(1),
        filter(basket => !!basket),
        switchMap(basket => {
          const dto: BasketFormDto = {
            basketItems: basket.basketItems
              .filter(x => x.id != itemId)
              .map(x => {
                return {
                  id: x.id,
                  productId: x.productId,
                  quantity: x.quantity,
                };
              }),
            id: basket.id,
          };

          return this._basketDataService.update(basket.id, dto).pipe(switchMap(() => this.getBasket$()));
        }),
      )
      .subscribe({
        next: response => {
          this.basket$.next(response);
        },
      });
  }

  editBasketItem(item: BasketItemFormDto): void {
    this.basket$
      .pipe(
        take(1),
        filter(basket => !!basket),
        filter(basket => basket.basketItems.some(x => x.productId == item.productId)),
        switchMap(basket => {
          const dto: BasketFormDto = {
            basketItems: basket.basketItems.map(x => {
              return {
                id: x.id,
                productId: x.productId,
                quantity: x.quantity,
              };
            }),
            id: basket.id,
          };

          const basketItem = dto.basketItems.find(x => x.productId == item.productId);

          if (basketItem) {
            basketItem.quantity = item.quantity;
          }

          return this._basketDataService.update(basket.id, dto).pipe(switchMap(() => this.getBasket$()));
        }),
      )
      .subscribe({
        next: response => {
          this.basket$.next(response);
        },
      });
  }

  getBasket$(): Observable<BasketDto> {
    return this._userService.user$.pipe(
      take(1),
      switchMap(user => {
        if (user) {
          return this._basketDataService.getUserBasket().pipe(
            switchMap(basket => {
              if (basket) {
                return of(basket);
              } else {
                return this._basketDataService.create({ basketItems: [] }).pipe(
                  switchMap(() => {
                    return this._basketDataService.getUserBasket();
                  }),
                );
              }
            }),
          );
        } else {
          const basketId = localStorage.getItem('basketId');

          return basketId
            ? this._basketDataService.getById(basketId).pipe(
                switchMap(basket => {
                  if (basket) {
                    return of(basket);
                  } else {
                    return this.create$();
                  }
                }),
              )
            : this.create$();
        }
      }),
      tap(basket => {
        this.basket$.next(basket);
      }),
    );
  }

  initBasketData(): Observable<{
    basketItems: BasketItemDto[];
    images: Record<string, string>;
  }> {
    return this.basket$.pipe(
      switchMap(basket => {
        if (basket && basket.basketItems.length > 0) {
          return forkJoin({
            basketItems: of(basket.basketItems),
            images: forkJoin(
              basket.basketItems
                .filter(x => !!x.productFileId)
                .map(x =>
                  forkJoin({
                    fileId: of(x.productFileId as string),
                    image: this._productPhotoDataService
                      .getById(x.productFileId as string)
                      .pipe(map(blob => URL.createObjectURL(blob))),
                  }),
                ),
            ),
          }).pipe(
            map(response => {
              let images: Record<string, string> = {};

              response.images.forEach(image => {
                images[image.fileId] = image.image;
              });

              return {
                basketItems: response.basketItems,
                images: images,
              };
            }),
          );
        } else {
          return forkJoin({
            basketItems: of([]),
            images: of({}),
          });
        }
      }),
    );
  }

  private create$(): Observable<BasketDto> {
    return this._basketDataService.create({ basketItems: [] }).pipe(
      switchMap(basket => {
        const id = basket.id as string;

        localStorage.setItem('basketId', id);
        return this._basketDataService.getById(id);
      }),
    );
  }
}
