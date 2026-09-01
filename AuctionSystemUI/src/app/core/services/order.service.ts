import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../config/api-endpoints.config';
import { snakeToCamelKeys, camelToSnakeKeys } from '../utils/case-converter.util';
import {
  WonAuctionResponse,
  SellerOrderResponse,
  CheckoutRequest,
  CheckoutResponse,
  ShipOrderRequest,
  OrderStatus
} from '../../shared/models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private baseUrl = API_BASE_URL;

  // 1. Bidder: Lấy danh sách sản phẩm đã thắng cuộc của chính mình (REST /v1/bidders/me/won-auctions)
  getWonAuctions(): Observable<WonAuctionResponse[]> {
    return this.http.get<any[]>(`${this.baseUrl}/v1/bidders/me/won-auctions`).pipe(
      map((res) => snakeToCamelKeys<WonAuctionResponse[]>(res))
    );
  }

  // 2. Bidder: Điền địa chỉ & Thanh toán (Checkout) -> Gửi payload dạng snake_case sang Backend
  checkout(orderId: number, request: CheckoutRequest): Observable<CheckoutResponse> {
    const payload = camelToSnakeKeys(request);
    return this.http.post<any>(
      `${this.baseUrl}/v1/bidders/me/orders/${orderId}/checkout`,
      payload
    ).pipe(
      map((res) => snakeToCamelKeys<CheckoutResponse>(res))
    );
  }

  // 3. Bidder: Bấm nút xác nhận "Đã nhận hàng thành công"
  confirmReceived(orderId: number): Observable<WonAuctionResponse> {
    return this.http.put<any>(
      `${this.baseUrl}/v1/bidders/me/orders/${orderId}/confirm-received`,
      {}
    ).pipe(
      map((res) => snakeToCamelKeys<WonAuctionResponse>(res))
    );
  }

  // 4. Seller: Truy vấn danh sách đơn hàng đã bán được của chính mình (REST /v1/sellers/me/orders)
  getSellerOrders(status?: OrderStatus): Observable<SellerOrderResponse[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<any[]>(`${this.baseUrl}/v1/sellers/me/orders`, { params }).pipe(
      map((res) => snakeToCamelKeys<SellerOrderResponse[]>(res))
    );
  }

  // 5. Seller: Bấm nút xuất hàng / giao hàng (Nhập mã vận đơn) -> Gửi payload dạng snake_case sang Backend
  shipOrder(orderId: number, request: ShipOrderRequest): Observable<SellerOrderResponse> {
    const payload = camelToSnakeKeys(request);
    return this.http.put<any>(
      `${this.baseUrl}/v1/sellers/me/orders/${orderId}/ship`,
      payload
    ).pipe(
      map((res) => snakeToCamelKeys<SellerOrderResponse>(res))
    );
  }
}
