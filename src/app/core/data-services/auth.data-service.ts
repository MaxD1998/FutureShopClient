import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginDto } from '../../modules/auth-module/core/dtos/login.dto';
import { UserInputDto } from '../../modules/shop-module/core/dtos/user-input.dto';
import { AuthControllerRoute } from '../constants/api-routes/auth-controller.route';
import { AuthorizeDto } from '../dtos/authorize.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthDataService {
  private readonly _httpClient = inject(HttpClient);

  login(dto: LoginDto): Observable<AuthorizeDto> {
    return this._httpClient.post<AuthorizeDto>(AuthControllerRoute.login, dto, { withCredentials: true });
  }

  logout(): Observable<void> {
    return this._httpClient.get<void>(AuthControllerRoute.logout, { withCredentials: true });
  }

  refreshToken(): Observable<AuthorizeDto> {
    return this._httpClient.get<AuthorizeDto>(AuthControllerRoute.refreshToken, { withCredentials: true });
  }

  register(dto: UserInputDto): Observable<AuthorizeDto> {
    return this._httpClient.post<AuthorizeDto>(AuthControllerRoute.register, dto, { withCredentials: true });
  }
}
