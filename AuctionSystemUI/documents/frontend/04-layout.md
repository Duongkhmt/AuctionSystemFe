# 04. Kiến Trúc Bộ Khung Giao Diện (Layout Layer Architecture)

# Mục đích

Tài liệu này giải thích cấu trúc và vai trò của các bộ khung giao diện (**Layout Components**) trong ứng dụng `AuctionSystemUI`. Tầng Layout chịu trách nhiệm bọc các Feature Pages trong các bộ khung hiển thị phù hợp với từng phân vùng ứng dụng (Public Marketplace, Seller Studio, Admin Moderation).

---

# Vì sao phải tồn tại

Nếu không có tầng `layout`:
- Mọi trang sẽ phải tự copy-paste thanh Navigation Header, Sidebar điều hướng, Footer và Toast Container.
- Trải nghiệm chuyển trang sẽ bị nhấp nháy (Flickering) do các thành phần cố định bị khởi tạo lại nhiều lần.
- Không thể phân chia rõ ràng không gian làm việc giữa **Người xem/Bidder**, **Người bán (Seller)** và **Quản trị viên (Admin)**.

---

# Trách nhiệm (Responsibility)

- **Được phép**:
  - Chứa `<router-outlet />` làm nơi nhúng động các trang con (Child routes).
  - Nhúng `<app-toast-container />` để sẵn sàng hiển thị thông báo nổi trên toàn bộ khung làm việc.
  - Hiển thị thông tin phiên làm việc hiện tại (`UserSessionService`) và công cụ chuyển vai trò (`Role Tester`).

- **Không được phép**:
  - **KHÔNG ĐƯỢC** chứa logic nghiệp vụ gọi API của sản phẩm hay đấu giá.
  - **KHÔNG ĐƯỢC** can thiệp vào dữ liệu form nhập liệu của các trang con.

---

# Cấu trúc hiện tại

Các file trong `src/app/layout/`:

```text
src/app/layout/
├── main-layout/
│   └── main-layout.component.ts    # Khung giao diện chính cho Sàn Đấu Giá Public & Trang Cá Nhân
├── seller-layout/
│   └── seller-layout.component.ts  # Khung giao diện Sidebar + Main Content dành riêng cho Seller Studio
└── admin-layout/
    └── admin-layout.component.ts   # Khung giao diện Sidebar + Main Content dành riêng cho Admin Moderation
```

---

# Luồng hoạt động

```text
[ URL Requested ]
       │
       ├─────────────────────────┼─────────────────────────┐
       ▼                         ▼                         ▼
 [ path: '' ]            [ path: 'seller' ]        [ path: 'admin' ]
       │                         │                         │
       ▼                         ▼                         ▼
[ MainLayoutComponent ]  [ SellerLayoutComponent ] [ AdminLayoutComponent ]
(Top Header + Tester)    (Left Sidebar Indigo)     (Left Sidebar Rose)
       │                         │                         │
       ▼                         ▼                         ▼
<router-outlet />         <router-outlet />         <router-outlet />
(Child Marketplace Page) (Child Seller Page)       (Child Admin Page)
```

---

# Phân tích từng file trong Layout Layer

### 1. `main-layout.component.ts`
- **Mục đích**: Bộ khung tổng thể cho khách truy cập, bidder theo dõi sàn đấu giá và lịch sử thầu cá nhân.
- **Thành phần nổi bật**:
  - **Top Navigation Bar**: Thương hiệu AuctionHub, Menu chuyển trang nhanh (`Sàn Đấu Giá`, `Kênh Người Bán`, `Duyệt Bài Admin`).
  - **Role Tester Switcher Bar**: Thanh chuyển đổi nhanh 3 vai trò (`Bidder`, `Seller`, `Admin`) trực tiếp kích hoạt `UserSessionService.switchToRole(role)`.
  - **Session Badge**: Đọc Signal `userSession.currentUser().name` và `id` hiển thị avatar chữ cái đầu.
- **Routing Integration**: Phục vụ các tuyến đường thuộc nhóm `MainLayout`: `/` (Sàn đấu giá), `/product/:id` (Chi tiết), `/my-bids` (Lịch sử giá cá nhân).

---

### 2. `seller-layout.component.ts`
- **Mục đích**: Bộ khung chuyên biệt cho Kênh Người Bán (Seller Studio) với tone màu thương hiệu Indigo.
- **Thành phần nổi bật**:
  - **Sidebar bên trái (`w-64`)**: Chứa Menu quản lý (`📋 Danh sách sản phẩm`, `➕ Tạo bài đăng mới`).
  - **Link quay lại**: Nút `← Về Sàn Đấu Giá Public` trên Header top bar giúp Seller thoát về giao diện chính nhanh chóng.
- **Routing Integration**: Được bọc bảo vệ bởi `roleGuard(['ROLE_SELLER', 'ROLE_ADMIN'])` trong `app.routes.ts`.

---

### 3. `admin-layout.component.ts`
- **Mục đích**: Bộ khung quản trị nội dung nghiêm ngặt dành cho Ban Quản Trị (Admin) với tone màu Cảnh báo Rose.
- **Thành phần nổi bật**:
  - **Sidebar bên trái (`w-64`)**: Biểu tượng 🛡️ Admin Moderation, Menu kiểm duyệt `🔍 Duyệt bài chờ (Pending)`.
  - **Profile Badge**: Hiển thị nhãn `AD` nổi bật cùng tên Admin và ID thực tế (`ID: 1`).
- **Routing Integration**: Được bọc bảo vệ nghiêm ngặt bởi `roleGuard(['ROLE_ADMIN'])`.

---

# Best Practice & Thiết kế kiến trúc

1. **Separation of Layout Contexts**: Phân tách 3 Layouts hoàn toàn độc lập giúp CSS Tailwind, màu sắc chủ đạo và cấu trúc Sidebar/Header không bị chồng chéo phức tạp.
2. **Nested Router Outlets**: Áp dụng triệt để mô hình Parent Layout -> Child Route trong `app.routes.ts` giúp duy trì trạng thái Sidebar/Header cố định khi người dùng di chuyển giữa các trang trong cùng phân vùng.
