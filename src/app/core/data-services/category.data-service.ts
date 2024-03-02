import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryControllerRoute } from '../constants/api-routes/category-controller.route';
import { CategoryDto } from '../dtos/category.dto';

@Injectable({
  providedIn: 'root',
})
export class CategoryDataService {
  private readonly _httpClient = inject(HttpClient);

  GetsByCategoryId(categoryParentId: string | null): Observable<CategoryDto[]> {
    const url = `${CategoryControllerRoute.categoryParentId}${categoryParentId ?? ''}`;
    return this._httpClient.get<CategoryDto[]>(url);
  }
}
