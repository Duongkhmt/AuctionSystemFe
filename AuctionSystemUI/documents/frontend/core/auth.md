# Core Sub-module: Authentication & User Session Management

# Mục đích
Quản lý trạng thái đăng nhập, lưu trữ Token bảo mật, phiên làm việc người dùng (User Session) và kiểm tra phân quyền người dùng (Permission Check).

---

# Vì sao phải tồn tại
Nếu không có sub-module này:
- Trạng thái người dùng hiện tại sẽ bị phân tán trên nhiều Component.
- Việc kiểm tra vai trò (Role Bidder/Seller/Admin) sẽ phải lặp lại logic ở nhiều màn hình.
- Không có cơ chế "Role Tester Mode" phục vụ môi trường kiểm thử trực quan cho Developer/QA.

---

# Trách nhiệm (Responsibility)

- **Được phép**:
  - Lưu và đọc Token từ `localStorage`.
  - Giữ trạng thái Reactive User Session thông qua Angular `signal()`.
  - Cung cấp các helper method kiểm tra quyền hành động (`canCreateProduct`, `canModerateProduct`, `canPlaceBid`).

- **Không được phép**:
  - Tự ý gọi trực tiếp các Endpoint nghiệp vụ không liên quan đến Auth.
  - Sửa đổi trực tiếp biến state ngoài hàm setter/switcher được cho phép.

---

# Cấu trúc hiện tại

Các file trong `src/app/core/auth/`:

```text
src/app/core/auth/
├── auth.service.ts          # Facade chính cho việc Login / Logout
├── permission.service.ts    # Helper phân quyền dựa vào UserRole
├── token.service.ts         # Wrapper làm việc trực tiếp với localStorage Token
└── user-session.service.ts  # Quản lý Signal UserSession & Role Tester Mode
```

---

# Luồng hoạt động

```text
[ Login Page / Role Tester Switcher ]
                 │
                 ▼
         [ AuthService ]
                 │
      ┌──────────┴──────────┐
      ▼                     ▼
[ TokenService ]   [ UserSessionService ] ──► (Cập nhật Signal currentUser)
(Lưu JWT Token)             │
                            ▼
                  [ PermissionService ] ──► (Hỗ trợ UI & Guards check role)
```

---

# Phân tích từng file

### 1. `token.service.ts`
- **Mục đích**: Wrapper cho `localStorage` để làm việc với chuỗi JWT Access Token (`auction_access_token`).
- **Dependency Injection**: `@Injectable({ providedIn: 'root' })`.
- **Methods**:
  - `getToken(): string | null`: Trả về JWT Token từ `localStorage`.
  - `saveToken(token: string): void`: Lưu JWT Token vào `localStorage`.
  - `removeToken(): void`: Xóa JWT Token khỏi `localStorage`.
  - `hasToken(): boolean`: Trả về `true` nếu có token.
- **File gọi tới**: `AuthService`, `apiHeaderInterceptor`.

---

### 2. `user-session.service.ts`
- **Mục đích**: Lưu trữ thông tin người dùng hiện tại bằng Angular `signal<UserSession>`, đồng thời cung cấp chế độ **Role Tester Mode** để đổi vai trò nhanh trên giao diện.
- **Dependency Injection**: `@Injectable({ providedIn: 'root' })`.
- **Hằng số thiết lập theo DB**:
  - `DEFAULT_ADMIN`: `id: 1, name: 'Admin', email: 'admin123@gmail.com', role: 'ROLE_ADMIN'`
  - `DEFAULT_SELLER`: `id: 2, name: 'Thanh Trúc', email: 'ttruc00@gmail.com', role: 'ROLE_SELLER'`
  - `DEFAULT_BIDDER`: `id: 3, name: 'T Dương', email: 'TDuong04@gmail.com', role: 'ROLE_BIDDER'`
- **Methods**:
  - `loadInitialSession()`: Đọc `localStorage` key `active_user_session` và validate với ID đúng trong DB.
  - `setSession(session: UserSession)`: Cập nhật `localStorage` & cập nhật `currentUser` signal.
  - `switchToRole(role: UserRole)`: Chuyển đổi qua lại giữa 3 vai trò ADMIN, SELLER, BIDDER.
  - `getCurrentUser()`: Trả về giá trị của `currentUser()`.
  - `hasRole(role: UserRole)`: So sánh `currentUser().role === role`.
- **File gọi tới**: `MainLayoutComponent`, `AuthService`, `PermissionService`, `CreateProductComponent`, `PendingApprovalComponent`.

---

### 3. `permission.service.ts`
- **Mục đích**: Cung cấp các hàm kiểm tra quyền hạn ngắn gọn và dễ hiểu cho giao diện và Guards.
- **Dependency Injection**: `private userSession = inject(UserSessionService)`.
- **Methods**:
  - `hasRole(role: UserRole)`: `return this.userSession.hasRole(role)`.
  - `canCreateProduct()`: `return SELLER || ADMIN`.
  - `canModerateProduct()`: `return ADMIN`.
  - `canPlaceBid()`: `return BIDDER`.
- **File gọi tới**: `roleGuard`, UI components.

---

### 4. `auth.service.ts`
- **Mục đích**: Facade thống nhất nghiệp vụ Đăng nhập & Đăng xuất.
- **Dependency Injection**:
  - `private tokenService = inject(TokenService)`
  - `private userSessionService = inject(UserSessionService)`
- **Methods**:
  - `login(request: LoginRequest): Observable<UserSession>`: Giả lập tạo Mock JWT Token, gọi `saveToken()`, chuyển role tương ứng và trả về `UserSession`.
  - `logout(): void`: Gọi `removeToken()`, chuyển về `ROLE_BIDDER`.
  - `isLoggedIn(): boolean`: `return this.tokenService.hasToken()`.
- **File gọi tới**: `LoginComponent`, `authGuard`.

---

# Best Practice & Bài học thiết kế

1. **Signal State**: Việc dùng Signal cho `currentUser` giúp thanh Header (`MainLayoutComponent`) và các trang tự động cập nhật ngay khi bấm nút chuyển đổi vai trò (Role Tester Switcher) mà không cần reload lại trang.
2. **Synchronized DB Mapping**: Các ID của mock session (`ID: 1`, `ID: 2`, `ID: 3`) đã được đồng bộ 100% với bảng `users` trong PostgreSQL để đảm bảo tính toàn vẹn dữ liệu khi gọi REST API xuống Spring Boot.
