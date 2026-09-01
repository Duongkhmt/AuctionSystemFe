# Feature: Authentication (Xác Thực Người Dùng)

# Mục đích
Quản lý các trang giao diện Đăng nhập (`LoginComponent`), Đăng ký người dùng mới (`RegisterComponent`) và Modal đăng nhập nhanh (`AuthModalComponent`).

---

# Cấu trúc & Chi tiết từng File

### 1. `auth.routes.ts`
- **Tuyến đường**:
  - `'login'`: Render `LoginComponent`.
  - `'register'`: Render `RegisterComponent`.

---

### 2. `login.component.ts`
- **Mục đích**: Màn hình Form đăng nhập người dùng.
- **Dependency Injection**:
  - `private authService = inject(AuthService)`
  - `private router = inject(Router)`
  - `private route = inject(ActivatedRoute)`
- **Logic Đăng nhập**: Gọi `authService.login()` và đọc `returnUrl` từ `route.snapshot.queryParams` để chuyển lại trang người dùng đang làm việc dở trước khi bị chuyển hướng.

---

### 3. `register.component.ts`
- **Mục đích**: Màn hình Form đăng ký tài khoản thành viên mới (`USER`).
- **Logic Đăng ký**: Thu thập thông tin `name`, `email`, `password`, `phoneNumber` và gọi `authService.register()` chuyển hướng đến trang đăng nhập sau khi đăng ký thành công.
