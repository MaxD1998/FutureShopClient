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
  private _authDataService: AuthDataService = inject(AuthDataService);
  private _user: BehaviorSubject<AuthorizeDto | undefined> = new BehaviorSubject<AuthorizeDto | undefined>(undefined);

  user$: Observable<AuthorizeDto | undefined> = this._user.asObservable();

  login(dto: LoginDto, callback?: () => void): void {
    this._authDataService.login(dto).subscribe({
      next: response => {
        this._user.next(response);

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
      },
    });
  }

  refreshToken(): void {
    this._authDataService.refreshToken().subscribe({
      next: response => {
        if (!response) {
          return;
        }

        this._user.next(response);
      },
    });
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
