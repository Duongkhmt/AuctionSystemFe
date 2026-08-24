# Architecture Diagrams: Full ASCII Visual References

# Mục đích

Tài liệu này chứa tập hợp đầy đủ các sơ đồ ASCII đại diện cho Kiến trúc tổng thể, Luồng dữ liệu, Phân quyền Bảo mật và Luồng Xử Lý Thời Gian Thực của dự án **AuctionSystemUI**.

---

# 1. Sơ Đồ Tổng Quan Kiến Trúc Tầng (Layered Architecture Diagram)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                          USER BROWSER / CLIENT LAYER                        │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                            APP CONFIGURATION LAYER                          │
│     app.config.ts (Providers: Router, HttpClient, Interceptors)             │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                             LAYOUT & ROUTING LAYER                          │
│ ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐ │
│ │ MainLayoutComponent  │ │ SellerLayoutComponent│ │ AdminLayoutComponent │ │
│ └──────────┬───────────┘ └──────────┬───────────┘ └──────────┬───────────┘ │
└────────────┼────────────────────────┼────────────────────────┼──────────────┘
             │                        │                        │
┌────────────▼────────────────────────▼────────────────────────▼──────────────┐
│                             FEATURE MODULES LAYER                           │
│ ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐ │
│ │ PublicMarketplace    │ │ SellerStudio         │ │ AdminModeration      │ │
│ └──────────┬───────────┘ └──────────┬───────────┘ └──────────┬───────────┘ │
└────────────┼────────────────────────┼────────────────────────┼──────────────┘
             │                        │                        │
┌────────────▼────────────────────────▼────────────────────────▼──────────────┐
│                                CORE SERVICES LAYER                          │
│   AuthService │ UserSessionService │ LoadingService │ ToastService           │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                         FUNCTIONAL HTTP INTERCEPTORS                        │
│ apiHeaderInterceptor ──► errorInterceptor ──► loadingInterceptor            │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                           SPRING BOOT REST API BACKEND                      │
│                           http://localhost:8080/v1                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# 2. Sơ Đồ Đặt Giá Thầu Real-Time & Anti-Sniping (Bidding Engine Flow)

```text
[ Bidder Click "Đặt Giá Ngay" ]
               │
               ▼
[ ProductDetailComponent.submitBid() ]
               │ (Validate Min Bid = CurrentPrice + BidStep)
               ▼
[ BiddingService.placeBid(auctionId, bidderId, request) ]
               │
               ▼
[ POST /v1/auctions/{auctionId}/bids?bidderId={bidderId} ]
               │
               ▼
[ Spring Boot ProxyBiddingEngine & AntiSniping Check ]
               │
      ┌────────┴────────┐
      ▼ (Thành công)    ▼ (Nếu còn < 5 phút)
[ Lưu Bid vào DB ]   [ Gia hạn thêm 5 phút (timeExtended = true) ]
      │                 │
      └────────┬────────┘
               ▼
[ Trả về BidResponse JSON (snake_case) ]
               │
               ▼
[ snakeToCamelKeys Converter ]
               │
               ▼
[ ProductDetailComponent: Toast Success & Load Live Bid History ]
```
