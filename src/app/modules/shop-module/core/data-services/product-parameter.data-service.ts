import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductParameterControllerRoute } from '../constants/api-routes/product-parameter-controller.route';
import { ProductParameterFlatDto } from '../dtos/product-parameter-flat.dto copy';

@Injectable({
  providedIn: 'root',
})
export class ProductParameterDataService {
  private readonly _httpClient = inject(HttpClient);

  getListByProductId(id: string): Observable<ProductParameterFlatDto[]> {
    const url = `${ProductParameterControllerRoute.productId}${id}`;
    return this._httpClient.get<ProductParameterFlatDto[]>(url);
  }
}
