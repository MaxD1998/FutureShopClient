import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseDataService {
  protected readonly _httpClient = inject(HttpClient);

  protected _baseUrl = environment.api;

  protected buildUrl(url: string) {
    return `${this._baseUrl}${url}`;
  }
}
