import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductPhotoControllerRoute } from '../../../../core/constants/api-routes/product-photo-controller.route';

@Injectable({
  providedIn: 'root',
})
export class ProductPhotoDataService {
  private readonly _httpClient = inject(HttpClient);

  getById(id: string): Observable<Blob> {
    const url = `${ProductPhotoControllerRoute.base}${id}`;
    return this._httpClient.get(url, { responseType: 'blob' });
  }
}
