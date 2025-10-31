import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IdNameDto } from '../../../../core/dtos/id-name.dto';
import { PageDto } from '../../../../core/dtos/page.dto';
import { PaginationDto } from '../../../../core/dtos/pagination.dto';
import { UserService } from '../../../auth-module/core/services/user.service';
import { ProductControllerRoute } from '../constants/controllers/product-controller.route';
import { ProductListDto } from '../dtos/product/product.list-dto';
import { ProductRequestFormDto } from '../dtos/product/product.request-form-dto';
import { ProductResponseFormDto } from '../dtos/product/product.response-form-dto';
import { SimulatePriceFormDto } from '../dtos/product/simulate-price.form-dto';
import { SimulatePriceRequestDto } from '../dtos/product/simulate-price.request-dto';
import { SimulateRemovePriceRequestDto } from '../dtos/product/simulate-remove-price.request-dto';

@Injectable({
  providedIn: 'root',
})
export class ProductDataService {
  private readonly _authService = inject(UserService);
  private readonly _httpClient = inject(HttpClient);

  getById(id: string): Observable<ProductResponseFormDto> {
    const url = `${ProductControllerRoute.base}${id}`;
    return this._httpClient.get<ProductResponseFormDto>(url);
  }

  getListIdName(excludedIds: string[]): Observable<IdNameDto[]> {
    const url = `${ProductControllerRoute.list}`;
    let params = new HttpParams();

    excludedIds.forEach(x => {
      params = params.append('excludedIds', x);
    });

    return this._httpClient.get<IdNameDto[]>(url, { params: params });
  }

  getPage(pageNumber: number): Observable<PageDto<ProductListDto>> {
    const dto: PaginationDto = {
      pageNumber: pageNumber,
      pageSize: 25,
    };

    const params = new HttpParams().append('pageNumber', dto.pageNumber).append('pageSize', dto.pageSize);
    const url = `${ProductControllerRoute.page}`;

    return this._httpClient.get<PageDto<ProductListDto>>(url, { params: params });
  }

  simulateAddProduct(dto: SimulatePriceRequestDto): Observable<SimulatePriceFormDto[]> {
    const url = `${ProductControllerRoute.simulateAddPrice}`;
    return this._httpClient.post<SimulatePriceFormDto[]>(url, dto);
  }

  simulateRemoveProduct(dto: SimulateRemovePriceRequestDto): Observable<SimulatePriceFormDto[]> {
    const url = `${ProductControllerRoute.simulateRemovePrice}`;
    return this._httpClient.post<SimulatePriceFormDto[]>(url, dto);
  }

  simulateUpdateProduct(dto: SimulatePriceRequestDto): Observable<SimulatePriceFormDto[]> {
    const url = `${ProductControllerRoute.simulateUpdatePrice}`;
    return this._httpClient.post<SimulatePriceFormDto[]>(url, dto);
  }

  update(id: string, dto: ProductRequestFormDto): Observable<ProductResponseFormDto> {
    const url = `${ProductControllerRoute.base}${id}`;
    return this._httpClient.put<ProductResponseFormDto>(url, dto);
  }
}
