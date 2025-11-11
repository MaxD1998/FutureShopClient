import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginDto } from '../../modules/auth-module/core/dtos/login.dto';
import { UserInputDto } from '../../modules/shop-module/core/dtos/user-input.dto';
import { AuthorizationControllerRoute } from '../constants/controllers-routes/auth-controller.route';
import { AuthorizeDto } from '../dtos/authorize.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthDataService {
  private readonly _httpClient = inject(HttpClient);

  login(dto: LoginDto): Observable<AuthorizeDto> {
    return this._httpClient.post<AuthorizeDto>(AuthorizationControllerRoute.login, dto, {
      withCredentials: true,
    });
  }

  logout(): Observable<void> {
    return this._httpClient.get<void>(AuthorizationControllerRoute.logout, { withCredentials: true });
  }

  refreshToken(): Observable<AuthorizeDto> {
    return this._httpClient.get<AuthorizeDto>(AuthorizationControllerRoute.refreshToken, {
      withCredentials: true,
    });
  }

  register(dto: UserInputDto): Observable<AuthorizeDto> {
    return this._httpClient.post<AuthorizeDto>(AuthorizationControllerRoute.register, dto, {
      withCredentials: true,
    });
  }
}
