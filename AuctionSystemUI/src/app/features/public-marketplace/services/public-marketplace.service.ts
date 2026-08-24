import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/config/api-endpoints.config';
import { ProductResponse } from '../../../shared/models/product.model';
import { snakeToCamelKeys } from '../../../core/utils/case-converter.util';

@Injectable({
  providedIn: 'root'
})
export class PublicMarketplaceService {
  private http = inject(HttpClient);

  getPublicProducts(): Observable<ProductResponse[]> {
    return this.http.get<any[]>(API_ENDPOINTS.PUBLIC_PRODUCTS).pipe(
      map((res) => snakeToCamelKeys<ProductResponse[]>(res))
    );
  }

  getProductById(id: number): Observable<ProductResponse> {
    return this.http.get<any>(API_ENDPOINTS.PUBLIC_PRODUCT_DETAIL(id)).pipe(
      map((res) => snakeToCamelKeys<ProductResponse>(res))
    );
  }
}
