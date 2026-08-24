# 08. Luồng Tích Hợp REST API (End-to-End API Integration Flow)

# Mục đích

Tài liệu này giải thích luồng truyền nhận dữ liệu end-to-end từ giao diện người dùng Angular tới các REST API Spring Boot Backend (`http://localhost:8080/v1`).

---

# Sơ Đồ Luồng Truyền Dữ Liệu Tận Cùng (ASCII API Pipeline)

```text
[ UI Component Trigger (e.g. submitBid()) ]
                    │
                    ▼
       [ Feature Service (BiddingService) ]
                    │
                    ▼
        [ API_ENDPOINTS.BIDDING_PLACE_BID ]
                    │
                    ▼
         [ HttpClient POST Request ]
                    │
       ┌────────────┴────────────┐
       ▼                         ▼
[ apiHeaderInterceptor ]   [ loadingInterceptor ]
(Authorization Bearer)     (LoadingService.show)
       │                         │
       └────────────┬────────────┘
                    ▼
      [ Network HTTP / CORS Call ]
                    │
                    ▼
     [ Spring Boot REST Controller ]
                    │
                    ▼
    [ PostgreSQL DB Transaction ]
                    │
                    ▼
      [ Spring Boot JSON Response ] (Snake_case: { "bid_id": 1, "new_current_price": 50000 })
                    │
                    ▼
        [ RxJS Observable Stream ]
                    │
                    ▼
     [ pipe(map(snakeToCamelKeys)) ]  <── Convert key snake_case ➔ camelCase đệ quy!
                    │
                    ▼
   [ Final Typed DTO (BidResponse) ] ({ bidId: 1, newCurrentPrice: 50000 })
                    │
       ┌────────────┴────────────┐
       ▼ (Thành công)            ▼ (Bắt lỗi)
[ Component Signal Update ] [ errorInterceptor ]
 ➔ UI Render mới             ➔ ToastService.showError
```

---

# Quy Chuẩn Chuyển Đổi Dữ Liệu Snake_case ↔ CamelCase

Do Spring Boot Backend trả về JSON dạng `snake_case` nhưng TypeScript định nghĩa kiểu dạng `camelCase`, tất cả các API call trong Services bắt buộc sử dụng tiện ích `snakeToCamelKeys()`:

```typescript
// Trong PublicMarketplaceService / SellerApiService / BiddingService:
getPublicProducts(): Observable<ProductResponse[]> {
  return this.http.get<any[]>(API_ENDPOINTS.PUBLIC_PRODUCTS).pipe(
    map((res) => snakeToCamelKeys<ProductResponse[]>(res))
  );
}
```

Nhờ đó, lập trình viên Frontend khi làm việc với `ProductResponse` sẽ luôn truy cập các trường qua chuẩn TypeScript `res.currentPrice`, `res.buyNowPrice`, `res.maskedWinnerName` vô cùng an toàn và nhất quán.
