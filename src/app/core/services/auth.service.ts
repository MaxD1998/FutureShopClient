import { Injectable, TransferState } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthDataService } from '../data-services/auth.data-service';
import { AuthorizeDto } from '../dtos/authorize-dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user: AuthorizeDto;

  constructor(private _authDataService: AuthDataService, private state: TransferState) {}

  login(): void {
    this._authDataService
      .Login({
        Email: 'superadmin@futureshop.pl',
        Password: '123456789',
      })
      .subscribe({
        next: respone => {
          this._user = respone;
        },
      });
  }

  async refreshToken(): Promise<void> {
    await firstValueFrom(this._authDataService.RefreshToken())
      .then(response => {
        if (!response) {
          return;
        }

        this._user = response;
      })
      .catch(response => console.log(response));
  }
}
