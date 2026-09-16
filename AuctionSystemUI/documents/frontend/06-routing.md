# 06. Kiến Trúc Định Tuyến (Routing & Navigation Architecture)

# Mục đích

Tài liệu này giải thích chiến lược định tuyến (Routing) trong dự án **AuctionSystemUI**. Hệ thống áp dụng **Lazy Loading Route Modules**, **Nested Layout Routes** và **Higher-Order Functional Route Guards** (`authGuard`, `roleGuard`) để tối ưu hóa hiệu năng và bảo mật điều hướng theo vai trò người dùng (`USER`, `ADMIN`).

---

# Vì sao phải tồn tại

Nếu không có kiến trúc định tuyến rõ ràng:
- Toàn bộ Javascript bundle của các module nghiệp vụ sẽ bị gộp chung vào 1 file `main.js` siêu lớn, làm chậm tốc độ nạp trang ban đầu.
- Không thể kiểm soát quyền truy cập trang `/admin`, `/seller`, `/my-bids` ở cấp độ URL.
- Không giữ được trạng thái cố định của Layout (Header, Sidebar) khi người dùng bấm chuyển qua lại giữa các trang con.

---

# Cấu trúc hệ thống Route hiện tại

Sơ đồ định tuyến tổng thể trong `app.routes.ts`:

```text
/
├── login -> LoginComponent
├── register -> RegisterComponent
├── auth/ (Lazy Load AUTH_ROUTES)
│   ├── login -> LoginComponent
│   └── register -> RegisterComponent
│
├── '' (MainLayoutComponent)
│   ├── '' (Lazy Load PUBLIC_MARKETPLACE_ROUTES)
│   │   ├── '' -> HomeComponent
│   │   └── product/:id -> ProductDetailComponent
│   ├── my-bids (Lazy Load BIDDER_PORTAL_ROUTES + authGuard + roleGuard(['USER']))
│   │   ├── '' -> WonAuctionsComponent
│   │   └── won -> WonAuctionsComponent
│   └── seller (Lazy Load SELLER_ROUTES + authGuard + roleGuard(['USER', 'ADMIN']))
│       ├── '' -> SellerProductListComponent
│       ├── create -> CreateProductComponent
│       ├── edit/:id -> EditProductComponent
│       └── orders -> SellerOrdersComponent
│
└── admin/ (AdminLayoutComponent + authGuard + roleGuard(['ADMIN']))
    └── (Lazy Load ADMIN_ROUTES)
        ├── '' -> PendingApprovalComponent (Duyệt bài đăng)
        ├── finance -> FinancialDashboardComponent (Két Escrow Sàn & Dòng tiền)
        ├── categories -> CategoryManagementComponent (Quản lý danh mục)
        └── users -> UserManagementComponent (Quản lý người dùng)
```

---

# Phân tích Cơ chế Nổi bật

### 1. Lazy Loading bằng ES Dynamic Imports
Tất cả các tuyến đường nghiệp vụ đều dùng cú pháp `loadChildren`:
```typescript
{
  path: 'admin',
  component: AdminLayoutComponent,
  canActivate: [authGuard, roleGuard(['ADMIN'])],
  loadChildren: () => import('./features/admin-moderation/admin.routes').then((m) => m.ADMIN_ROUTES)
}
```
Lợi ích: Trình duyệt chỉ nạp file Javascript chứa giao diện Admin khi tài khoản Quản trị viên truy cập vào `/admin`.

### 2. Luồng Điều Hướng Đăng Nhập Đã Chuẩn Hóa
- Tất cả mọi người dùng (`USER`, `ADMIN`) sau khi đăng nhập thành công từ trang `/login` sẽ **luôn quay về Trang Chủ Sàn Đấu Giá (`/`)**.
- Quản trị viên `ADMIN` có thể bấm nút **`Quản Lý Bài Đăng`** trên thanh Navigation Header để tiến vào Admin Portal bất cứ lúc nào.

### 3. Bảo Vệ Route Theo Vai Trò (`roleGuard`)
- Đường dẫn `/my-bids` (Tài khoản của tôi - Các lô đã thắng) chỉ dành cho vai trò `USER`. Tài khoản `ADMIN` sẽ bị ngăn truy cập và tự động chuyển hướng về trang quản trị.
- Đường dẫn `/admin` (Quản lý bài đăng, danh mục, người dùng) chỉ dành riêng cho vai trò `ADMIN`.
- Thanh Header công khai sẽ tự động ẩn `Tài Khoản Của Tôi` đối với `ADMIN` và chỉ hiển thị `Quản Lý Bài Đăng`.

### 4. View Transitions API (`withViewTransitions()`)
Được đăng ký trong `app.config.ts`:
```typescript
provideRouter(routes, withComponentInputBinding(), withViewTransitions())
```
Lợi ích: Tận dụng Native Browser View Transitions API giúp trải nghiệm mượt mà giống như Native Application khi chuyển trang.

### 5. Component Input Binding (`withComponentInputBinding()`)
Cho phép lấy `:id` trên URL trực tiếp qua `@Input() id!: number` thay vì phải inject `ActivatedRoute` để subscribe `paramMap`.
