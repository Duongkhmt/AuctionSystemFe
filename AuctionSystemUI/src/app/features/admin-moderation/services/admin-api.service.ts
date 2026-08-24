import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/config/api-endpoints.config';
import { ProductRejectRequest, ProductResponse } from '../../../shared/models/product.model';
import { snakeToCamelKeys } from '../../../core/utils/case-converter.util';

@Injectable({
  providedIn: 'root'
})
export class AdminApiService {
  private http = inject(HttpClient);

  getPendingProducts(): Observable<ProductResponse[]> {
    return this.http.get<any[]>(API_ENDPOINTS.ADMIN_PENDING_PRODUCTS).pipe(
      map((res) => snakeToCamelKeys<ProductResponse[]>(res))
    );
  }

  approveProduct(id: number): Observable<ProductResponse> {
    return this.http.put<any>(API_ENDPOINTS.ADMIN_APPROVE_PRODUCT(id), {}).pipe(
      map((res) => snakeToCamelKeys<ProductResponse>(res))
    );
  }

  rejectProduct(id: number, rejectDTO: ProductRejectRequest): Observable<ProductResponse> {
    return this.http.put<any>(API_ENDPOINTS.ADMIN_REJECT_PRODUCT(id), rejectDTO).pipe(
      map((res) => snakeToCamelKeys<ProductResponse>(res))
    );
  }
}
