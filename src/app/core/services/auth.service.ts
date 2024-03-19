import { Injectable, inject } from '@angular/core';
import { AuthDataService } from '../data-services/auth.data-service';
import { AuthorizeDto } from '../dtos/authorize.dto';
import { LoginDto } from '../dtos/login.dto';
import { UserInputDto } from '../dtos/user-input.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _authDataService: AuthDataService = inject(AuthDataService);
  private _user: AuthorizeDto | null = null;

  get jwt(): string {
    return this._user?.token ?? '';
  }

  get isSignedIn(): boolean {
    return this._user !== null;
  }

  login(dto: LoginDto, callback?: () => void): void {
    this._authDataService.login(dto).subscribe({
      next: respone => {
        this._user = respone;

        if (callback) {
          callback();
        }
      },
    });
  }

  logout(): void {
    this._authDataService.logout().subscribe({
      next: () => {
        this._user = null;
      },
    });
  }

  refreshToken(): void {
    this._authDataService.refreshToken().subscribe({
      next: response => {
        if (!response) {
          return;
        }

        this._user = response;
      },
    });
  }

  register(dto: UserInputDto, callback?: () => void): void {
    this._authDataService.register(dto).subscribe({
      next: response => {
        this._user = response;

        if (callback) {
          callback();
        }
      },
    });
  }
}
