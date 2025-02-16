import { inject, Injectable } from '@angular/core';
import { forkJoin, of, switchMap, tap } from 'rxjs';
import { LoginDto } from '../../modules/auth-module/core/dtos/login.dto';
import { UserService } from '../../modules/auth-module/core/services/user.service';
import { UserInputDto } from '../../modules/shop-module/core/dtos/user-input.dto';
import { BasketService } from '../../modules/shop-module/core/services/basket.service';
import { PurchaseListService } from '../../modules/shop-module/core/services/purchase-list.service';
import { AuthDataService } from '../data-services/auth.data-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _authDataService = inject(AuthDataService);
  private readonly _basketService = inject(BasketService);
  private readonly _userService = inject(UserService);
  private readonly _purchaseListService = inject(PurchaseListService);

  private _intervalId?: NodeJS.Timeout;

  login(dto: LoginDto, callback?: () => void): void {
    this._authDataService
      .login(dto)
      .pipe(
        switchMap(user => {
          this._userService.user$.next(user);
          this.refreshJwt();

          return forkJoin({
            user: of(user),
            basket: this._basketService.getBasket$(),
            purchaseLists: this._purchaseListService.getUserPurchaseLists$(),
          });
        }),
      )
      .subscribe({
        next: () => {
          if (callback) {
            callback();
          }
        },
      });
  }

  logout(): void {
    this._authDataService.logout().subscribe({
      next: () => {
        this._userService.user$.next(undefined);

        if (this._intervalId) {
          clearInterval(this._intervalId);
          this._intervalId = undefined;
        }

        window.location.reload();
      },
    });
  }

  refreshToken(): Promise<boolean> {
    return new Promise(resolve => {
      return this._authDataService
        .refreshToken()
        .pipe(
          tap(user => {
            this._userService.user$.next(user);
            this.refreshJwt();
          }),
          switchMap(user => {
            return forkJoin({
              user: of(user),
              basket: this._basketService.getBasket$(),
              purchaseLists: this._purchaseListService.getUserPurchaseLists$(),
            });
          }),
        )
        .subscribe({
          next: response => {
            if (!response.user) {
              return resolve(false);
            }

            return resolve(true);
          },
          error: () => {
            return resolve(false);
          },
        });
    });
  }

  refreshJwt(): void {
    if (this._intervalId) {
      return;
    }

    const interval = 4 * 60 * 1000;
    const intervalId = setInterval(() => {
      this._authDataService.refreshToken().subscribe({
        next: response => {
          this._userService.user$.next(response);
        },
      });
    }, interval);

    this._intervalId = intervalId;
  }

  register(dto: UserInputDto, callback?: () => void): void {
    this._authDataService.register(dto).subscribe({
      next: response => {
        this._userService.user$.next(response);

        if (callback) {
          callback();
        }
      },
    });
  }
}
