import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { FileControllerRoute } from '../constants/api-routes/file-controller.route';
import { FileDto } from '../dtos/file.dto';

@Injectable({
  providedIn: 'root',
})
export class FileDataService {
  private readonly _httpClient = inject(HttpClient);

  addList(blobs: Blob[]): Observable<string[]> {
    const form = new FormData();

    blobs.forEach(x => {
      form.append('files', x);
    });

    return this._httpClient.post<string[]>(FileControllerRoute.base, form);
  }

  getById(id: string): Observable<Blob> {
    const url = `${FileControllerRoute.base}${id}`;
    return this._httpClient.get(url, { responseType: 'blob' });
  }

  getListInfoByIds(ids: string[]): Observable<FileDto[]> {
    let params = new HttpParams();

    ids.forEach(x => {
      params = params.append('ids', x);
    });

    return this._httpClient.get<FileDto[]>(FileControllerRoute.info, { params: params });
  }
}
