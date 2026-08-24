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
├── app.routes.ts            # Khai báo Routes chính và định tuyến Lazy Loading
├── core/                    # Dịch vụ hạ tầng toàn cục (Auth, Interceptors, Guards, Utility)
├── shared/                  # UI Components, Pipes, Models dùng chung trên nhiều trang
├── layout/                  # Bộ khung giao diện chính (MainLayout, SellerLayout, AdminLayout)
└── features/                # Phân vùng 4 Module nghiệp vụ chính của hệ thống đấu giá
    ├── auth/                # Đăng nhập & Xác thực người dùng
    ├── public-marketplace/  # Sàn đấu giá công khai cho khách hàng & người xem
    ├── bidder-portal/       # Trang quản lý lịch sử đấu giá cá nhân của Bidder
    ├── seller-studio/       # Kênh quản lý bài đăng & tạo đấu giá của Người Bán (Seller)
    └── admin-moderation/    # Trang kiểm duyệt & phê duyệt bài đăng của Admin
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
    [ app.routes.ts ] ──► (Check roleGuard & Nạp Lazy Loading Layout + Feature Routes)
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
        withInterceptors([apiHeaderInterceptor, errorInterceptor, loadingInterceptor])
      )
    ]
  };
  ```
- **Cấu hình nổi bật do Lead thiết kế**:
  - `withComponentInputBinding()`: Tự động bind URL Parameters (ví dụ: `:id`) thẳng vào `@Input()` của Component mà không cần qua `ActivatedRoute.params`.
  - `withViewTransitions()`: Kích hoạt animation mượt mà của trình duyệt khi chuyển trang.
  - `withInterceptors([apiHeaderInterceptor, errorInterceptor, loadingInterceptor])`: Đăng ký chuỗi 3 Functional Interceptors xử lý theo thứ tự: Gắn Header Session ➔ Xử lý lỗi tập trung ➔ Quản lý trạng thái Loading indicator.
- **File gọi tới**: `main.ts`.

---

### 3. `app.routes.ts`
- **Mục đích**: Khai báo danh sách các tuyến đường Root Route của ứng dụng.
- **Vì sao tạo**: Quản lý định tuyến tổng thể, phân quyền người dùng thông qua `canActivate` Guards và ứng dụng **Lazy Loading** để tối ưu tốc độ tải ban đầu (Initial Bundle Size).
- **Phân tích các Route chính**:
  1. `/auth`: Lazy load `AUTH_ROUTES`.
  2. `/`: Sử dụng `MainLayoutComponent`, chứa `PUBLIC_MARKETPLACE_ROUTES` và `/my-bids` (`BIDDER_PORTAL_ROUTES`).
  3. `/seller`: Bọc bởi `SellerLayoutComponent`, được bảo vệ bởi `roleGuard(['ROLE_SELLER', 'ROLE_ADMIN'])`, lazy load `SELLER_ROUTES`.
  4. `/admin`: Bọc bởi `AdminLayoutComponent`, được bảo vệ bởi `roleGuard(['ROLE_ADMIN'])`, lazy load `ADMIN_ROUTES`.
  5. `**`: Redirect tự động về `/`.
- **File gọi tới**: `app.config.ts`.
- **File gọi tiếp**: Các Layout Components và Feature Route files.

---

# Best Practice & Thiết kế kiến trúc

1. **Ứng dụng triệt để Standalone Architecture**:
   - Loại bỏ hoàn toàn `NgModules`. Tất cả Component, Pipe, Directive đều là Standalone (`standalone: true`).
   - Tăng khả năng Tree-shaking, giảm kích thước bundle nạp qua mạng.

2. **Signals State Management**:
   - Sử dụng Signal (`signal()`, `computed()`) cho trạng thái Reactive (User session, Loading indicator, Cart, Data lists) giúp Angular bỏ qua việc Change Detection quá nhiều DOM nodes không cần thiết.

---

# Kết luận

- Thư mục gốc `app` giữ vai trò thiết lập khung gầm và kết nối các thành phần chính.
- Tất cả các Route nghiệp vụ bắt buộc phải sử dụng **Lazy Loading** thông qua `loadChildren` hoặc `loadComponent`.
- Chú ý thứ tự đăng ký HTTP Interceptors trong `app.config.ts` để đảm bảo chuỗi xử lý Request/Response chạy đúng thứ tự mong muốn.
