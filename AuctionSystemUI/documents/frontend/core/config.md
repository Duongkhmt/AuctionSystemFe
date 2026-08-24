# Core Sub-module: Configurations & Utility Converters

# Mục đích
Chứa các tập tin cấu hình tập trung hằng số (API Endpoints) và các tiện ích biến đổi dữ liệu (Case Converter) 
giúp kết nối hạ tầng mượt mà giữa Angular và Spring Boot REST API.

---

# Vì sao phải tồn tại
- Tránh việc hardcode chuỗi URL API `http://localhost:8080/v1/...` rải rác khắp các Services.
- Khắc phục sự bất đồng quy chuẩn đặt tên biến giữa **Java Backend** (`snake_case`: `buy_now_price`, `bid_step`) 
- và **TypeScript Frontend** (`camelCase`: `buyNowPrice`, `bidStep`).

---

# Trách nhiệm (Responsibility)

- **Được phép**:
  - Định nghĩa duy nhất 1 điểm thay đổi `API_BASE_URL` và danh sách các Endpoints `API_ENDPOINTS`.
  - Cung cấp tiện ích hàm thuần túy (Pure utility function) biến đổi dữ liệu đệ quy.

- **Không được phép**:
  - Đưa thông tin bí mật (Secrets, Private Keys) vào file config này.
  - Tạo ra các Side-effects làm thay đổi đối tượng truyền vào nếu không cần thiết.

---

# Cấu trúc hiện tại

File trong `src/app/core/config/` và `src/app/core/utils/`:

```text
src/app/core/
├── config/
│   └── api-endpoints.config.ts  # Danh sách URL REST API Endpoints
└── utils/
    └── case-converter.util.ts   # Hàm đệ quy snakeToCamelKeys
```

---

# Phân tích từng file

### 1. `api-endpoints.config.ts`
- **Mục đích**: Lưu trữ tập trung `API_BASE_URL` và tất cả các REST Endpoints được phân loại theo chức năng.
- **Code implementation chi tiết**:
  ```typescript
  export const API_BASE_URL = 'http://localhost:8080';

  export const API_ENDPOINTS = {
    // Public Marketplace
    PUBLIC_PRODUCTS: `${API_BASE_URL}/v1/products`,
    PUBLIC_PRODUCT_DETAIL: (id: number) => `${API_BASE_URL}/v1/products/${id}`,

    // Seller Studio
    SELLER_PRODUCTS: (sellerId: number) => `${API_BASE_URL}/v1/sellers/${sellerId}/products`,
    SELLER_PRODUCT_BY_ID: (sellerId: number, id: number) => `${API_BASE_URL}/v1/sellers/${sellerId}/products/${id}`,
    SELLER_CANCEL_AUCTION: (sellerId: number, id: number) => `${API_BASE_URL}/v1/sellers/${sellerId}/products/${id}/cancel`,
    SELLER_RELIST_AUCTION: (sellerId: number, auctionId: number) => `${API_BASE_URL}/v1/sellers/${sellerId}/products/${auctionId}/relist`,

    // Admin Moderation
    ADMIN_PENDING_PRODUCTS: `${API_BASE_URL}/v1/admin/products/pending`,
    ADMIN_APPROVE_PRODUCT: (id: number) => `${API_BASE_URL}/v1/admin/products/${id}/approve`,
    ADMIN_REJECT_PRODUCT: (id: number) => `${API_BASE_URL}/v1/admin/products/${id}/reject`,

    // Categories DB
    CATEGORIES: `${API_BASE_URL}/v1/categories`,

    // Bidding Real-Time Engine
    BIDDING_PLACE_BID: (auctionId: number, bidderId: number) => `${API_BASE_URL}/v1/auctions/${auctionId}/bids?bidderId=${bidderId}`,
    BIDDING_BUY_NOW: (auctionId: number, bidderId: number) => `${API_BASE_URL}/v1/auctions/${auctionId}/bids/buy-now?bidderId=${bidderId}`,
    BIDDING_HISTORY: (auctionId: number) => `${API_BASE_URL}/v1/auctions/${auctionId}/bids`,
  };
  ```
- **File gọi tới**: Tất cả các Services giao tiếp API 
- (`SellerApiService`, `AdminApiService`, `PublicMarketplaceService`, `BiddingService`, `CategoryService`).

---

### 2. `case-converter.util.ts`
- **Mục đích**: Hàm đệ quy tự động nhận diện và đổi toàn bộ key của Object / Array thu được từ JSON Spring Boot thành `camelCase` phù hợp với TypeScript Interface.
- **Code implementation**:
  ```typescript
  export function snakeToCamelKeys<T = any>(obj: any): T {
    if (Array.isArray(obj)) {
      return obj.map((v) => snakeToCamelKeys(v)) as any;
    } else if (obj !== null && obj.constructor === Object) {
      return Object.keys(obj).reduce((result: any, key: string) => {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        result[camelKey] = snakeToCamelKeys(obj[key]);
        return result;
      }, {});
    }
    return obj;
  }
  ```
- **File gọi tới**: Các Services map dữ liệu API về Observable (`SellerApiService`, `PublicMarketplaceService`, `BiddingService`...).

---

# Best Practice & Bài học thiết kế

1. **Endpoint Functions**: Các URL có tham số động (`id`, `sellerId`, `auctionId`) được định nghĩa dưới dạng Arrow function `(id: number) => ...` giúp code autocomplete chuẩn Type và tránh ghép chuỗi string thủ công `+ id`.
2. **Seamless JSON Mapping**: Nhờ có `snakeToCamelKeys()`, nhóm phát triển Frontend không phải viết các hàm mapper thủ công từng trường cho hàng chục DTOs khác nhau.
