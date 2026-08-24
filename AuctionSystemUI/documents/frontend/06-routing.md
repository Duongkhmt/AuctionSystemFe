# 06. Kiến Trúc Định Tuyến (Routing & Navigation Architecture)

# Mục đích

Tài liệu này giải thích chiến lược định tuyến (Routing) trong dự án **AuctionSystemUI**. Hệ thống áp dụng **Lazy Loading Route Modules**, **Nested Layout Routes** và **Higher-Order Functional Route Guards** để tối ưu hóa hiệu năng và bảo mật điều hướng.

---

# Vì sao phải tồn tại

Nếu không có kiến trúc định tuyến rõ ràng:
- Toàn bộ Javascript bundle của 4 module nghiệp vụ sẽ bị gộp chung vào 1 file `main.js` siêu lớn, làm giật lắc trang khi ứng dụng vừa nạp.
- Không thể kiểm soát quyền truy cập trang `/admin` và `/seller` ở cấp độ URL.
- Không giữ được trạng thái cố định của Layout (Top Header, Sidebar) khi người dùng bấm chuyển qua lại giữa các trang con.

---

# Cấu trúc hệ thống Route hiện tại

Sơ đồ định tuyến tổng thể trong `app.routes.ts`:

```text
/
├── auth/ (Lazy Load AUTH_ROUTES)
│   └── login -> LoginComponent
│
├── '' (MainLayoutComponent)
│   ├── '' (Lazy Load PUBLIC_MARKETPLACE_ROUTES)
│   │   ├── '' -> HomeComponent
│   │   └── product/:id -> ProductDetailComponent
│   └── my-bids (Lazy Load BIDDER_PORTAL_ROUTES)
│       └── '' -> MyBidsComponent
│
├── seller/ (SellerLayoutComponent + roleGuard(['ROLE_SELLER', 'ROLE_ADMIN']))
│   └── (Lazy Load SELLER_ROUTES)
│       ├── '' -> ProductListComponent
│       └── create -> CreateProductComponent
│
└── admin/ (AdminLayoutComponent + roleGuard(['ROLE_ADMIN']))
    └── (Lazy Load ADMIN_ROUTES)
        └── '' -> PendingApprovalComponent
```

---

# Phân tích Cơ chế Nổi bật

### 1. Lazy Loading bằng ES Dynamic Imports
Tất cả các tuyến đường nghiệp vụ đều dùng cú pháp `loadChildren`:
```typescript
{
  path: 'seller',
  component: SellerLayoutComponent,
  canActivate: [roleGuard(['ROLE_SELLER', 'ROLE_ADMIN'])],
  loadChildren: () => import('./features/seller-studio/seller.routes').then((m) => m.SELLER_ROUTES)
}
```
Lợi ích: Trình duyệt chỉ nạp file Javascript chứa giao diện Seller Studio khi người dùng thực sự bấm truy cập vào `/seller`.

### 2. View Transitions API (`withViewTransitions()`)
Được đăng ký trong `app.config.ts`:
```typescript
provideRouter(routes, withComponentInputBinding(), withViewTransitions())
```
Lợi ích: Tận dụng Native Browser View Transitions API giúp trải nghiệm mượt mà giống như Native Application khi chuyển trang.

### 3. Component Input Binding (`withComponentInputBinding()`)
Cho phép lấy `:id` trên URL trực tiếp qua `@Input() id!: number` thay vì phải inject `ActivatedRoute` để subscribe `paramMap`.
