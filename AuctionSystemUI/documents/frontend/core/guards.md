# Core Sub-module: Functional Route Guards

# Mục đích
Bảo vệ các tuyến đường (Routes) khỏi truy cập trái phép, ngăn người dùng chưa đăng nhập hoặc không đúng quyền truy cập vào các trang dành riêng cho Seller hoặc Admin.

---

# Vì sao phải tồn tại
Nếu không có Route Guards:
- Bất kỳ ai nhập đường dẫn `/seller` hay `/admin` trên URL trình duyệt đều có thể vào giao diện quản trị dù không có quyền.
- Lỗi kết nối API xảy ra khi các trang yêu cầu quyền Seller/Admin gửi request lên Backend với Token hoặc User ID không hợp lệ.

---

# Trách nhiệm (Responsibility)

- **Được phép**:
  - Kiểm tra trạng thái xác thực (`isLoggedIn`) và phân quyền (`hasRole`).
  - Cho phép (`return true`) hoặc điều hướng chuyển trang (`router.navigate`) nếu không đủ điều kiện.

- **Không được phép**:
  - Không được thực hiện gọi API làm thay đổi dữ liệu (Side-effects).
  - Không được xử lý giao diện hiển thị phức tạp.

---

# Cấu trúc hiện tại

File trong `src/app/core/guards/`:

```text
src/app/core/guards/
├── auth.guard.ts  # Chặn người dùng chưa đăng nhập
└── role.guard.ts  # Chặn truy cập trang không khớp Role
```

---

# Luồng hoạt động

```text
[ User Navigate to URL (e.g. /admin) ]
                   │
                   ▼
      [ app.routes.ts matching ]
                   │
                   ▼
       [ roleGuard(['ROLE_ADMIN']) ]
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
    Has Permission      No Permission
         │                   │
         ▼                   ▼
   [ Allow Route ]   [ Redirect to /public ]
```

---

# Phân tích từng file

### 1. `auth.guard.ts`
- **Mục đích**: Kiểm tra người dùng đã đăng nhập chưa trước khi cho phép kích hoạt route.
- **Code implementation**:
  ```typescript
  export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
      return true;
    }

    router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  };
  ```
- **Injection**: Tận dụng `inject(AuthService)` và `inject(Router)` trong Functional Guard của Angular 18.
- **Return URL Feature**: Truyền URL hiện tại vào `queryParams: { returnUrl }` để sau khi login thành công có thể quay lại trang người dùng đang truy cập dở.
- **File gọi tới**: `app.routes.ts` hoặc các child routes.

---

### 2. `role.guard.ts`
- **Mục đích**: Higher-order Functional Guard kiểm tra xem User hiện tại có sở hữu 1 trong các vai trò được phép (`allowedRoles`) hay không.
- **Code implementation**:
  ```typescript
  export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
    return (route, state) => {
      const permissionService = inject(PermissionService);
      const router = inject(Router);

      const hasPermission = allowedRoles.some((role) => permissionService.hasRole(role));

      if (hasPermission) {
        return true;
      }

      router.navigate(['/public']);
      return false;
    };
  };
  ```
- **Sử dụng thực tế trong `app.routes.ts`**:
  - `/seller`: `canActivate: [roleGuard(['ROLE_SELLER', 'ROLE_ADMIN'])]`
  - `/admin`: `canActivate: [roleGuard(['ROLE_ADMIN'])]`
- **File gọi tới**: `app.routes.ts`.

---

# Best Practice & Bài học thiết kế

1. **Functional Guards trong Angular 18**:
   - Sử dụng `CanActivateFn` viết dưới dạng mũi tên (Arrow function) gọn gàng thay vì định nghĩa một Class implements `CanActivate` cồng kềnh như các bản Angular cũ.
2. **Flexible Higher-Order Function**:
   - Thiết kế `roleGuard(allowedRoles)` dạng Curry Function cho phép truyền danh sách Role linh hoạt cho từng Route riêng biệt.
