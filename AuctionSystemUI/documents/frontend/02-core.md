# 02. Kiến Trúc Lớp Core (Core Layer Architecture)

# Mục đích

Tài liệu này giải thích vai trò của thư mục `src/app/core` - trái tim hạ tầng của dự án **AuctionSystemUI**. Lớp Core chịu trách nhiệm quản lý các dịch vụ Singleton dùng chung toàn cục (Global Services), bảo mật (Auth/Token/Session), xử lý yêu cầu HTTP (Interceptors), bảo vệ điều hướng (Guards) và tiện ích chung (Utilities).

---

# Vì sao phải tồn tại

Nếu không phân chia rõ ràng lớp `core`:
- Các mã nguồn hạ tầng như Auth Token, Interceptors, Error Toast sẽ bị nhét rải rác ở các Feature Module, gây lặp code (Code Duplication).
- Nhiều phiên bản Service Singleton có thể bị khởi tạo lại nhiều lần (Multiple Instances), dẫn đến sai lệch trạng thái User Session và Token trong bộ nhớ.
- Không thể chuẩn hóa luồng giao tiếp API giữa Spring Boot (`snake_case`) và Angular (`camelCase`).

---

# Trách nhiệm (Responsibility)

- **Được phép**:
  - Đăng ký dưới dạng `@Injectable({ providedIn: 'root' })` để đảm bảo duy nhất **1 instance Singleton** tồn tại trong suốt lifecycle của app.
  - Quản lý trạng thái hạ tầng (User Session, Token, Loading, Toast System).
  - Can thiệp vào luồng HTTP Request/Response bằng Functional Interceptors.
  - Chặn hoặc cho phép truy cập Route thông qua Functional Guards.

- **Không được phép**:
  - **KHÔNG ĐƯỢC** import bất kỳ Component, Directive, Pipe nào thuộc về `shared/`, `layout/` hay `features/`.
  - **KHÔNG ĐƯỢC** chứa logic nghiệp vụ đặc thù của giao diện màn hình cụ thể (UI presentation logic).

---

# Cấu trúc hiện tại

```text
src/app/core/
├── auth/
│   ├── auth.service.ts          # Dịch vụ đăng nhập / đăng xuất giả lập & quản lý trạng thái auth
│   ├── permission.service.ts    # Dịch vụ phân quyền hành động theo UserRole (Bidder/Seller/Admin)
│   ├── token.service.ts         # Dịch vụ lưu trữ & truy xuất JWT Access Token trong localStorage
│   └── user-session.service.ts  # Dịch vụ quản lý thông tin User hiện tại bằng Angular Signals & Role Tester Mode
├── config/
│   └── api-endpoints.config.ts  # Khai báo tập trung toàn bộ URLs REST API Backend Spring Boot
├── guards/
│   ├── auth.guard.ts            # Functional Guard kiểm tra người dùng đã đăng nhập chưa
│   └── role.guard.ts            # Functional Guard kiểm tra quyền (Role) trước khi vào trang Seller/Admin
├── interceptors/
│   ├── api-header.interceptor.ts# Tự động chèn Authorization Bearer Header vào mọi HTTP Request
│   ├── error.interceptor.ts     # Bắt lỗi HTTP tập trung và hiển thị Notification Toast Lỗi
│   └── loading.interceptor.ts   # Quản lý hiển thị thanh Loading spinner trong khi chờ API response
├── services/
│   ├── category.service.ts      # Dịch vụ truy vấn danh mục sản phẩm từ DB (/v1/categories)
│   ├── loading.service.ts       # Signal Service đếm số lượng Request đang chờ để bật/tắt Spinner
│   └── toast.service.ts         # Signal Service quản lý hiển thị thông báo Toast nổi trên màn hình
└── utils/
    └── case-converter.util.ts   # Hàm đệ quy chuyển đổi Key từ snake_case (Spring Boot) ➔ camelCase (Angular)
```

---

# Luồng hoạt động

```text
[ Feature Component ] ──► [ Core Service (CategoryService / BiddingService) ]
                                    │
                                    ▼
                         [ HttpClient Request ]
                                    │
    ┌───────────────────────────────┴───────────────────────────────┐
    ▼                               ▼                               ▼
[ apiHeaderInterceptor ]   [ loadingInterceptor ]        [ Spring Boot API ]
(Gắn Bearer Token)         (LoadingService.show)                     │
                                                                    ▼
[ UI Render ] ◄── [ Toast ] ◄── [ errorInterceptor ] ◄───────── Response
```

---

# Phân Tích Chi Tiết Chi Nhánh Trong Core

Để phục vụ lập trình viên đọc chuyên sâu từng nhóm giải pháp, tài liệu Core được chia nhỏ thành các file chi tiết sau:

- 📖 [Core Auth Documentation](file:///home/duong/Projects/Frontend/AuctionSystemUI/documents/frontend/core/auth.md): Giải thích `AuthService`, `TokenService`, `UserSessionService`, `PermissionService`.
- 📖 [Core Guards Documentation](file:///home/duong/Projects/Frontend/AuctionSystemUI/documents/frontend/core/guards.md): Giải thích `authGuard` và `roleGuard`.
- 📖 [Core Interceptors Documentation](file:///home/duong/Projects/Frontend/AuctionSystemUI/documents/frontend/core/interceptors.md): Giải thích `apiHeaderInterceptor`, `errorInterceptor`, `loadingInterceptor`.
- 📖 [Core Config & Utils Documentation](file:///home/duong/Projects/Frontend/AuctionSystemUI/documents/frontend/core/config.md): Giải thích `api-endpoints.config.ts` và `case-converter.util.ts`.
- 📖 [Core Infrastructure Services Documentation](file:///home/duong/Projects/Frontend/AuctionSystemUI/documents/frontend/core/services.md): Giải thích `LoadingService`, `ToastService`, `CategoryService`.

---

# Best Practice & Thiết kế kiến trúc

1. **Root Scope Singleton**: Tất cả Service trong `core` bắt buộc khai báo `providedIn: 'root'` để đảm bảo 1 bộ nhớ duy nhất.
2. **Functional Guards & Interceptors**: Đã chuyển hoàn toàn từ Class-based (`implements CanActivate`, `implements HttpInterceptor`) sang **Functional Interceptors / Guards** của Angular 18 để giảm boilerplate code và tận dụng `inject()`.
3. **Immutability & Signal Reactive**: Dùng Signal (`signal()`) cho `currentUser`, `isLoading`, `toasts` giúp giao diện lắng nghe và phản ứng tức thì không cần RxJS Subject phức tạp.

---

# Kết luận

- Lớp `core` tuyệt đối độc lập và không phụ thuộc ngược lại vào `shared` hay `features`.
- Mọi API call trong dự án đều phải đi qua bộ 3 Interceptors đã đăng ký tại `app.config.ts`.
