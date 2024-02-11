import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseDataService {
  private _baseUrl = environment.api;

  constructor(private _httpClient: HttpClient) {}

  protected get<TResult>(url: string, withCredentials: boolean = false): Observable<TResult> {
    return this._httpClient.get<TResult>(`${this._baseUrl}${url}`, { withCredentials: withCredentials });
  }

  protected post<TResult, TModel>(url: string, body: TModel, withCredentials: boolean = false): Observable<TResult> {
    return this._httpClient.post<TResult>(`${this._baseUrl}${url}`, body, { withCredentials: withCredentials });
  }
}
