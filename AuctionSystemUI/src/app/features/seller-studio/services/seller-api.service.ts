import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/config/api-endpoints.config';
import { ProductResponse } from '../../../shared/models/product.model';
import { snakeToCamelKeys } from '../../../core/utils/case-converter.util';

@Injectable({
  providedIn: 'root'
})
export class SellerApiService {
  private http = inject(HttpClient);

  getSellerProducts(): Observable<ProductResponse[]> {
    return this.http.get<any[]>(API_ENDPOINTS.SELLER_PRODUCTS).pipe(
      map((res) => snakeToCamelKeys<ProductResponse[]>(res))
    );
  }

  createProduct(formData: FormData): Observable<ProductResponse> {
    return this.http.post<any>(API_ENDPOINTS.SELLER_PRODUCTS, formData).pipe(
      map((res) => snakeToCamelKeys<ProductResponse>(res))
    );
  }

  updateProduct(id: number, formData: FormData): Observable<ProductResponse> {
    return this.http.put<any>(API_ENDPOINTS.SELLER_PRODUCT_BY_ID(id), formData).pipe(
      map((res) => snakeToCamelKeys<ProductResponse>(res))
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.SELLER_PRODUCT_BY_ID(id));
  }

  cancelAuction(id: number): Observable<ProductResponse> {
    return this.http.put<any>(API_ENDPOINTS.SELLER_CANCEL_AUCTION(id), {}).pipe(
      map((res) => snakeToCamelKeys<ProductResponse>(res))
    );
  }

  relistAuction(auctionId: number): Observable<ProductResponse> {
    return this.http.post<any>(API_ENDPOINTS.SELLER_RELIST_AUCTION(auctionId), {}).pipe(
      map((res) => snakeToCamelKeys<ProductResponse>(res))
    );
  }
}
