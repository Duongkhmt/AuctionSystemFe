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

  getSellerProducts(sellerId: number): Observable<ProductResponse[]> {
    return this.http.get<any[]>(API_ENDPOINTS.SELLER_PRODUCTS(sellerId)).pipe(
      map((res) => snakeToCamelKeys<ProductResponse[]>(res))
    );
  }

  createProduct(sellerId: number, formData: FormData): Observable<ProductResponse> {
    return this.http.post<any>(API_ENDPOINTS.SELLER_PRODUCTS(sellerId), formData).pipe(
      map((res) => snakeToCamelKeys<ProductResponse>(res))
    );
  }

  updateProduct(sellerId: number, id: number, formData: FormData): Observable<ProductResponse> {
    return this.http.put<any>(API_ENDPOINTS.SELLER_PRODUCT_BY_ID(sellerId, id), formData).pipe(
      map((res) => snakeToCamelKeys<ProductResponse>(res))
    );
  }

  deleteProduct(sellerId: number, id: number): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.SELLER_PRODUCT_BY_ID(sellerId, id));
  }

  cancelAuction(sellerId: number, id: number): Observable<ProductResponse> {
    return this.http.put<any>(API_ENDPOINTS.SELLER_CANCEL_AUCTION(sellerId, id), {}).pipe(
      map((res) => snakeToCamelKeys<ProductResponse>(res))
    );
  }

  relistAuction(sellerId: number, auctionId: number): Observable<ProductResponse> {
    return this.http.post<any>(API_ENDPOINTS.SELLER_RELIST_AUCTION(sellerId, auctionId), {}).pipe(
      map((res) => snakeToCamelKeys<ProductResponse>(res))
    );
  }
}
