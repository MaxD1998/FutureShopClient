import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthDataService } from '../data-services/auth.data-service';
import { AuthorizeDto } from '../dtos/authorize-dto';
import { LoginDto } from '../dtos/login-dto';

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

  async refreshToken(): Promise<void> {
    await firstValueFrom(this._authDataService.refreshToken()).then(response => {
      if (!response) {
        return;
      }

      this._user = response;
    });
  }
}
