# 01. Tổng Quan Dự Án (Project Overview)

# Mục đích

Tài liệu này đóng vai trò giới thiệu tổng thể bức tranh kiến trúc Frontend của ứng dụng **AuctionSystemUI**, giúp lập trình viên mới hiểu được lý do chọn lựa công nghệ, tư duy thiết kế hệ thống và cấu trúc phân bổ các thư mục trong dự án.

---

# Vì sao phải tồn tại

Nếu không có tài liệu tổng quan này, người mới gia nhập dự án sẽ:
- Không hiểu tư duy chuyển đổi từ NgModules truyền thống sang **Standalone Architecture** trong Angular 18.
- Viết sai vị trí các file (ví dụ: đưa logic nghiệp vụ vào `shared/` hoặc tạo Component dùng chung ở `core/`).
- Phá vỡ quy tắc giao tiếp 1 chiều giữa các tầng trong ứng dụng web đấu giá trực tuyến.

---

# Trách nhiệm (Responsibility)

- **Được phép**:
  - Định nghĩa công nghệ cốt lõi và các thư viện dùng chung cho toàn bộ Frontend.
  - Thiết lập quy chuẩn phân chia cây thư mục theo tính năng (Feature-driven structure).
  - Khai báo các điểm khởi chạy gốc (`app.config.ts`, `app.routes.ts`, `app.component.ts`).

- **Không được phép**:
  - Chứa bất kỳ logic nghiệp vụ (business logic) chi tiết của từng màn hình.
  - Gọi trực tiếp API HTTP Backend hoặc xử lý thao tác DOM trong tài liệu này.

---

# Cấu trúc hiện tại

Cấu trúc thư mục gốc của dự án `src/app`:

```text
src/app/
├── app.component.ts         # Root Component chính chỉ chứa <router-outlet />
├── app.config.ts            # Cấu hình Providers gốc (Router, HttpClient, Interceptors)
├── app.routes.ts            # Khai báo Routes chính và định tuyến Lazy Loading + Role Guards
├── core/                    # Dịch vụ hạ tầng toàn cục (Auth, Interceptors, Guards, Services, Language)
├── shared/                  # UI Components, Pipes, Models dùng chung trên nhiều trang
├── layout/                  # Bộ khung giao diện chính (MainLayout, SellerLayout, AdminLayout)
└── features/                # Phân vùng 4 Module nghiệp vụ chính của hệ thống đấu giá
    ├── auth/                # Đăng nhập, Đăng ký & Xác thực người dùng (Login, Register)
    ├── public-marketplace/  # Sàn đấu giá công khai cho khách hàng & người xem (Home, Product Detail)
    ├── bidder-portal/       # Cổng cá nhân quản lý các lô đã thắng (Won Auctions, Order Checkout)
    ├── seller-studio/       # Kênh quản lý bài đăng, xem trước & xuất hàng của Người Bán (Seller)
    └── admin-moderation/    # Cổng kiểm duyệt bài đăng chờ xuất bản của Ban Quản Trị (Admin)
```

---

# Luồng hoạt động

```text
[ Browser / Client Access ]
            │
            ▼
     [ main.ts / index.html ]
            │
            ▼
    [ app.config.ts ] ──► (Đăng ký HttpClient Interceptors & View Transitions)
            │
            ▼
   [ app.component.ts ]
            │
            ▼
    [ app.routes.ts ] ──► (Check authGuard & roleGuard ➔ Nạp Lazy Loading Layout + Feature Routes)
            │
            ▼
 [ Responsive Layout & Component Rendering ]
```

---

# Phân tích từng file trong ROOT APP

### 1. `app.component.ts`
- **Mục đích**: Root Component cấp cao nhất của ứng dụng.
- **Vì sao tạo**: Bắt buộc có trong ứng dụng Angular để đóng vai trò làm Anchor Point nhúng toàn bộ trang web vào `index.html`.
- **Constructor & Dependency Injection**: Không có.
- **Method & Template**:
  - Template tối giản: `<router-outlet />`
  - Đảm nhận nhiệm vụ làm Container động cho router thay đổi các bộ khung Layout (`MainLayoutComponent`, `SellerLayoutComponent`, `AdminLayoutComponent`).
- **File gọi tới**: `main.ts` (thông qua `bootstrapApplication(AppComponent, appConfig)`).
- **File gọi tiếp**: Các Router Outlets trong `app.routes.ts`.

---

### 2. `app.config.ts`
- **Mục đích**: Cấu hình các Global Providers cho Angular 18 Standalone App thay thế cho `AppModule` cũ.
- **Vì sao tạo**: Thiết lập các cơ chế hạ tầng quan trọng ngay từ khi ứng dụng khởi chạy (Change Detection, Router, View Transitions, HTTP Interceptors).
- **Phân tích code chi tiết**:
  ```typescript
  export const appConfig: ApplicationConfig = {
    providers: [
      provideZoneChangeDetection({ eventCoalescing: true }),
      provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
      provideHttpClient(
        withInterceptors([apiHeaderInterceptor, errorInterceptor])
      )
    ]
  };
  ```
- **Cấu hình nổi bật do Lead thiết kế**:
  - `withComponentInputBinding()`: Tự động bind URL Parameters (ví dụ: `:id`) thẳng vào `@Input()` của Component mà không cần qua `ActivatedRoute.params`.
  - `withViewTransitions()`: Kích hoạt animation mượt mà của trình duyệt khi chuyển trang.
  - `withInterceptors([apiHeaderInterceptor, errorInterceptor])`: Đăng ký chuỗi Functional Interceptors xử lý theo thứ tự: Gắn Header Session (`x-user-id`) ➔ Xử lý lỗi tập trung và phát thông báo Toast cảnh báo trực quan.
- **File gọi tới**: `main.ts`.

---

### 3. `app.routes.ts`
- **Mục đích**: Khai báo danh sách các tuyến đường Root Route của ứng dụng.
- **Vì sao tạo**: Quản lý định tuyến tổng thể, phân quyền người dùng thông qua `canActivate` Guards và ứng dụng **Lazy Loading** để tối ưu tốc độ tải ban đầu (Initial Bundle Size).
- **Phân tích các Route chính**:
  1. `/login` & `/register`: Trang đăng nhập và trang đăng ký người dùng mới.
  2. `/auth`: Lazy load `AUTH_ROUTES`.
  3. `/`: Sử dụng `MainLayoutComponent`, chứa `PUBLIC_MARKETPLACE_ROUTES`.
  4. `/my-bids`: Bọc bởi `authGuard` và `roleGuard(['USER'])`, lazy load `BIDDER_PORTAL_ROUTES` (Trang các lô sản phẩm đã thắng).
  5. `/seller`: Bọc bởi `SellerLayoutComponent`, bảo vệ bởi `authGuard` và `roleGuard(['USER', 'ADMIN'])`, lazy load `SELLER_ROUTES`.
  6. `/admin`: Bọc bởi `AdminLayoutComponent`, bảo vệ bởi `authGuard` và `roleGuard(['ADMIN'])`, lazy load `ADMIN_ROUTES`.
  7. `**`: Redirect tự động về `/`.
- **File gọi tới**: `app.config.ts`.
- **File gọi tiếp**: Các Layout Components và Feature Route files.

---

# Best Practice & Thiết kế kiến trúc

1. **Ứng dụng triệt để Standalone Architecture**:
   - Loại bỏ hoàn toàn `NgModules`. Tất cả Component, Pipe, Directive đều là Standalone (`standalone: true`).
   - Tăng khả năng Tree-shaking, giảm kích thước bundle nạp qua mạng.

2. **Signals State Management & Global Bilingual Dictionary**:
   - Sử dụng Signal (`signal()`, `computed()`) cho trạng thái Reactive (User session, Language code, Selected tab, Form value changes).
   - Tích hợp `LanguageService` với Signal `currentLang` cho phép bấm chuyển ngữ tức thì giữa **Tiếng Việt (VN)** và **Tiếng Anh (EN)** toàn hệ thống.

---

# Kết luận

- Thư mục gốc `app` giữ vai trò thiết lập khung gầm và kết nối các thành phần chính.
- Tất cả các Route nghiệp vụ bắt buộc phải sử dụng **Lazy Loading** thông qua `loadChildren` hoặc `loadComponent`.
- Phân định rõ ranh giới vai trò: `USER` tham gia đấu giá & xem lô thắng; `ADMIN` tập trung thẩm định & duyệt bài xuất bản.
