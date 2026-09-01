# Core Sub-module: Core Infrastructure Services

# Mục đích
Chứa các Dịch vụ hạ tầng toàn cục dùng chung phục vụ hiển thị phản hồi người dùng (Toast Notifications), quản lý từ điển đa ngôn ngữ (`LanguageService`), truy vấn danh mục sản phẩm (`CategoryService`) và quản lý đơn hàng trúng thầu (`OrderService`).

---

# Vì sao phải tồn tại
- Trợ giúp giao diện hiển thị các trạng thái bất đồng bộ (Asynchronous Loading) mượt mà mà không làm giật lắc trang.
- Đưa thông báo Toast thả nổi từ góc màn hình một cách nhất quán (Success, Error, Info, Warning).
- Đảm bảo từ điển đa ngôn ngữ VN ↔ EN được quản lý tập trung bằng Signals và truy xuất tức thì ở mọi Component.

---

# Trách nhiệm (Responsibility)

- **Được phép**:
  - Đăng ký Singleton bằng `@Injectable({ providedIn: 'root' })`.
  - Quản lý trạng thái bằng Angular `signal()` và toán tử `update()`.

- **Không được phép**:
  - Trực tiếp render HTML DOM thủ công (Phải để Component tương ứng render dựa theo Signal state).

---

# Cấu trúc hiện tại

Các file trong `src/app/core/services/`:

```text
src/app/core/services/
├── category.service.ts  # Dịch vụ gọi API nạp danh mục DB (/v1/categories)
├── language.service.ts  # Dịch vụ quản lý từ điển song ngữ VN ↔ EN toàn hệ thống
├── order.service.ts     # Dịch vụ gọi API Đơn hàng trúng thầu, Checkout & Nhận hàng
└── toast.service.ts     # Quản lý danh sách các thông báo Toast thả nổi
```

---

# Phân tích từng file

### 1. `language.service.ts`
- **Mục đích**: Quản lý trạng thái ngôn ngữ hiện tại (`currentLang = signal<LanguageCode>('vi')`) và tra cứu từ điển đa ngôn ngữ VN ↔ EN cho toàn bộ ứng dụng.
- **Code implementation**:
  ```typescript
  @Injectable({ providedIn: 'root' })
  export class LanguageService {
    currentLang = signal<LanguageCode>('vi');

    setLanguage(lang: LanguageCode): void {
      localStorage.setItem('app_language', lang);
      this.currentLang.set(lang);
    }

    translate(key: string): string {
      const lang = this.currentLang();
      return DICTIONARY[lang]?.[key] || DICTIONARY['vi']?.[key] || key;
    }
  }
  ```
- **File gọi tới**: `MainLayoutComponent`, `AdminLayoutComponent`, `HomeComponent`, `ProductDetailComponent`, `CreateProductComponent`, `EditProductComponent`, `WonAuctionsComponent`, `SellerProductListComponent`.

---

### 2. `toast.service.ts`
- **Mục đích**: Quản lý mảng danh sách các thông báo Toast nổi (`toasts = signal<ToastMessage[]>([])`) và tự động đếm ngược xóa khỏi màn hình sau 4 giây.
- **File gọi tới**: `error.interceptor.ts`, `CreateProductComponent`, `PendingApprovalComponent`, `ProductDetailComponent`, `ToastContainerComponent`.

---

### 3. `category.service.ts`
- **Mục đích**: Nạp trực tiếp danh sách danh mục từ API Spring Boot (`/v1/categories`).
- **File gọi tới**: `CreateProductComponent`, `EditProductComponent`, `HomeComponent`.

---

### 4. `order.service.ts`
- **Mục đích**: Gọi các API liên quan đến đơn hàng trúng thầu: nạp danh sách đơn hàng đã thắng, Checkout điền địa chỉ giao hàng và xác nhận nhận hàng.
- **Methods**:
  - `getWonAuctions()`: `GET /v1/bidders/{id}/won-auctions`
  - `checkoutOrder(orderId, payload)`: `POST /v1/bidders/{id}/orders/{orderId}/checkout`
  - `confirmReceived(orderId)`: `PUT /v1/bidders/{id}/orders/{orderId}/confirm-received`
- **File gọi tới**: `WonAuctionsComponent`, `CheckoutModalComponent`.

---

# Best Practice & Bài học thiết kế

1. **Immutable Signal Updates**: Dùng `this.toasts.update(current => [...current, toast])` giúp Angular Signal chủ động báo về UI render lại mảng mới cực kỳ an toàn.
2. **Centralized Global Translation Dictionary**: Đưa tập trung từ điển vào `LanguageService` giúp việc bổ sung ngôn ngữ mới dễ dàng mà không làm nảy sinh lỗi vặt trên giao diện.
