import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductPhotoControllerRoute } from '../constants/api-routes/product-photo-controller.route';
import { ProductPhotoInfoDto } from '../dtos/product-photo.info-dto';

@Injectable({
  providedIn: 'root',
})
export class ProductPhotoDataService {
  private readonly _httpClient = inject(HttpClient);

  addList(blobs: Blob[]): Observable<string[]> {
    const form = new FormData();

    blobs.forEach(x => {
      form.append('files', x);
    });

    return this._httpClient.post<string[]>(ProductPhotoControllerRoute.base, form);
  }

  delete(id: string): Observable<null> {
    return this._httpClient.delete<null>(`${ProductPhotoControllerRoute.base}${id}`);
  }

  deleteList(ids: string[]): Observable<null> {
    let params = new HttpParams();

    ids.forEach(x => {
      params = params.append('ids', x);
    });

    return this._httpClient.delete<null>(`${ProductPhotoControllerRoute.base}`, { params: params });
  }

  getById(id: string): Observable<Blob> {
    const url = `${ProductPhotoControllerRoute.base}${id}`;
    return this._httpClient.get(url, { responseType: 'blob' });
  }

  getListInfoByIds(ids: string[]): Observable<ProductPhotoInfoDto[]> {
    let params = new HttpParams();

    ids.forEach(x => {
      params = params.append('ids', x);
    });

    return this._httpClient.get<ProductPhotoInfoDto[]>(ProductPhotoControllerRoute.info, { params: params });
  }
}
