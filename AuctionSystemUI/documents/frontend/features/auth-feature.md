# Feature: Authentication (Xác Thực Người Dùng)

# Mục đích
Quản lý trang giao diện Đăng nhập cho người dùng hệ thống.

---

# Cấu trúc & Chi tiết từng File

### 1. `auth.routes.ts`
- **Tuyến đường**: `'login'`: Render `LoginComponent`.

---

### 2. `login.component.ts`
- **Mục đích**: Màn hình Form đăng nhập.
- **Dependency Injection**:
  - `private authService = inject(AuthService)`
  - `private router = inject(Router)`
  - `private route = inject(ActivatedRoute)`
- **Logic Đăng nhập**: Gọi `authService.login()` và đọc `returnUrl` từ `route.snapshot.queryParams` để chuyển lại trang người dùng đang làm việc dở dở trước khi bị đẩy sang Login.
