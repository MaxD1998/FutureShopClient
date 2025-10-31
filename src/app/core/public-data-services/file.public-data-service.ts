import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { FilePublicControllerRoute } from '../constants/public-controllers/file-public-controller.route';

@Injectable({
  providedIn: 'root',
})
export class FilePublicDataService {
  private readonly _httpClient = inject(HttpClient);

  getById(id: string): Observable<Blob> {
    const url = `${FilePublicControllerRoute.base}${id}`;
    return this._httpClient.get(url, { responseType: 'blob' });
  }
}
