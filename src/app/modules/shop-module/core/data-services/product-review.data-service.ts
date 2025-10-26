import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PageDto } from '../../../../core/dtos/page.dto';
import { PaginationDto } from '../../../../core/dtos/pagination.dto';
import { ProductReviewControllerRoute } from '../constants/api-routes/product-review-controller.route';
import { ProductReviewRequestFormDto } from '../dtos/product/product-review/product-review.request-form-dto';
import { ProductReviewResponseFormDto } from '../dtos/product/product-review/product-review.response-form-dto';

@Injectable({
  providedIn: 'root',
})
export class ProductReviewDataService {
  private readonly _httpClient = inject(HttpClient);
  create(dto: ProductReviewRequestFormDto): Observable<ProductReviewResponseFormDto> {
    const url = `${ProductReviewControllerRoute.base}`;
    return this._httpClient.post<ProductReviewResponseFormDto>(url, dto);
  }

  delete(id: string): Observable<null> {
    return this._httpClient.delete<null>(`${ProductReviewControllerRoute.base}${id}`);
  }

  getPageByProductId(productId: string, pagination: PaginationDto): Observable<PageDto<ProductReviewResponseFormDto>> {
    const params = new HttpParams().append('pageNumber', pagination.pageNumber).append('pageSize', pagination.pageSize);
    const url = `${ProductReviewControllerRoute.page}${productId}`;
    return this._httpClient.get<PageDto<ProductReviewResponseFormDto>>(url, { params: params });
  }

  update(id: string, dto: ProductReviewRequestFormDto): Observable<ProductReviewResponseFormDto> {
    const url = `${ProductReviewControllerRoute.base}${id}`;
    return this._httpClient.put<ProductReviewResponseFormDto>(url, dto);
  }
}
