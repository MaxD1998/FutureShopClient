import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserDeliveryAddressControllerRoute } from '../constants/controller-routes/user-delivery-address-controller.route';
import { UserDeliveryAddressRequestFormDto } from '../dtos/user-delivery-address/user-delivery-address.request-form.dto';
import { UserDeliveryAddressResponseFormDto } from '../dtos/user-delivery-address/user-delivery-address.response-form.dto';

@Injectable({
  providedIn: 'root',
})
export class UserDeliveryAddressDataService {
  private readonly _httpClient = inject(HttpClient);

  create(dto: UserDeliveryAddressRequestFormDto): Observable<UserDeliveryAddressResponseFormDto> {
    return this._httpClient.post<UserDeliveryAddressResponseFormDto>(UserDeliveryAddressControllerRoute.base, dto);
  }

  delete(id: string): Observable<null> {
    return this._httpClient.delete<null>(`${UserDeliveryAddressControllerRoute.base}${id}`);
  }

  getList(): Observable<UserDeliveryAddressResponseFormDto[]> {
    const url = `${UserDeliveryAddressControllerRoute.list}`;
    return this._httpClient.get<UserDeliveryAddressResponseFormDto[]>(url);
  }

  update(id: string, dto: UserDeliveryAddressRequestFormDto): Observable<UserDeliveryAddressResponseFormDto> {
    return this._httpClient.put<UserDeliveryAddressResponseFormDto>(
      `${UserDeliveryAddressControllerRoute.base}${id}`,
      dto,
    );
  }
}
