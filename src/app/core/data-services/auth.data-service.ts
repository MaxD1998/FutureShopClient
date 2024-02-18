import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseDataService } from '../bases/base.data-service';
import { AuthControllerRoute } from '../constants/api-routes/auth-controller.route';
import { AuthorizeDto } from '../dtos/authorize-dto';
import { LoginDto } from '../dtos/login-dto';

@Injectable({
  providedIn: 'root',
})
export class AuthDataService extends BaseDataService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  Login(dto: LoginDto): Observable<AuthorizeDto> {
    return this.post(AuthControllerRoute.login, dto, true);
  }

  RefreshToken(): Observable<AuthorizeDto> {
    return this.get(AuthControllerRoute.refreshToken, true);
  }
}
