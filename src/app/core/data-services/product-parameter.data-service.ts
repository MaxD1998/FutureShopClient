import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductParameterControllerRoute } from '../constants/api-routes/product-parameter-controller.route';
import { IdNameDto } from '../dtos/id-name.dto';

@Injectable({
  providedIn: 'root',
})
export class ProductParameterDataService {
  private readonly _httpClient = inject(HttpClient);

  getsByProductBaseId(id: string): Observable<IdNameDto[]> {
    const url = `${ProductParameterControllerRoute.productBaseId}${id}`;
    return this._httpClient.get<IdNameDto[]>(url);
  }
}
