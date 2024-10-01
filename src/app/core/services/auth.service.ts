import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthDataService } from '../data-services/auth.data-service';
import { AuthorizeDto } from '../dtos/authorize.dto';
import { LoginDto } from '../dtos/login.dto';
import { UserInputDto } from '../dtos/user-input.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _authDataService: AuthDataService = inject(AuthDataService);
  private readonly _user: BehaviorSubject<AuthorizeDto | undefined> = new BehaviorSubject<AuthorizeDto | undefined>(
    undefined,
  );

  private _intervalId?: any;

  user$: Observable<AuthorizeDto | undefined> = this._user.asObservable();

  login(dto: LoginDto, callback?: () => void): void {
    this._authDataService.login(dto).subscribe({
      next: response => {
        this._user.next(response);
        this.refreshJwt();

        if (callback) {
          callback();
        }
      },
    });
  }

  logout(): void {
    this._authDataService.logout().subscribe({
      next: () => {
        this._user.next(undefined);

        if (this._intervalId) {
          clearInterval(this._intervalId);
          this._intervalId = undefined;
        }
      },
    });
  }

  refreshToken(): Promise<boolean> {
    return new Promise(resolve => {
      this._authDataService.refreshToken().subscribe({
        next: response => {
          if (!response) {
            return resolve(false);
          }

          this._user.next(response);
          this.refreshJwt();

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
          this._user.next(response);
        },
      });
    }, interval);

    this._intervalId = intervalId;
  }

  register(dto: UserInputDto, callback?: () => void): void {
    this._authDataService.register(dto).subscribe({
      next: response => {
        this._user.next(response);

        if (callback) {
          callback();
        }
      },
    });
  }
}
