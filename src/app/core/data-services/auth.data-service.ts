import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseDataService } from '../bases/base.data-service';
import { AuthRoute } from '../constants/api-routes/auth.route';
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
    return this.post(AuthRoute.login, dto, true);
  }

  RefreshToken(): Observable<AuthorizeDto> {
    return this.get(AuthRoute.refreshToken, true);
  }
}
