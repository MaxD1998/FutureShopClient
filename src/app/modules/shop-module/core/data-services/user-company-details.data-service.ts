import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserCompanyDetailsControllerRoute } from '../constants/controller-routes/user-company-details-controller.route';
import { UserCompanyDetailsRequestFormDto } from '../dtos/user-company-details/user-company-details.request-form-dto';
import { UserCompanyDetailsResponseFormDto } from '../dtos/user-company-details/user-company-details.response-form-dto';

@Injectable({
  providedIn: 'root',
})
export class UserCompanyDetailsDataService {
  private readonly _httpClient = inject(HttpClient);

  create(dto: UserCompanyDetailsRequestFormDto): Observable<UserCompanyDetailsResponseFormDto> {
    return this._httpClient.post<UserCompanyDetailsResponseFormDto>(UserCompanyDetailsControllerRoute.base, dto);
  }

  delete(id: string): Observable<void> {
    return this._httpClient.delete<void>(`${UserCompanyDetailsControllerRoute.base}${id}`);
  }

  getList(): Observable<UserCompanyDetailsResponseFormDto[]> {
    const url = `${UserCompanyDetailsControllerRoute.list}`;
    return this._httpClient.get<UserCompanyDetailsResponseFormDto[]>(url);
  }

  update(id: string, dto: UserCompanyDetailsRequestFormDto): Observable<UserCompanyDetailsResponseFormDto> {
    return this._httpClient.put<UserCompanyDetailsResponseFormDto>(
      `${UserCompanyDetailsControllerRoute.base}${id}`,
      dto,
    );
  }
}
