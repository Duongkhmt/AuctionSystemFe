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
  - Hiển thị thông tin phiên làm việc hiện tại (`UserSessionService`) và bộ đổi ngôn ngữ toàn hệ thống (`LanguageService`).

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
(Top Header + VN/EN)     (Left Sidebar Dark Gold)  (Left Sidebar Dark Emerald)
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
  - **Top Navigation Bar**: Thương hiệu AuctionHub (⚖ Gold Logo), Menu lọc danh mục hot (`Sàn Đấu Giá`, `Bất Động Sản`, `Đồng Hồ & Trang Sức`, `Đồ Cổ`).
  - **Phân định vai trò linh hoạt**:
    - Tài khoản `USER`: Hiển thị liên kết **`Tài Khoản Của Tôi`** (`/my-bids`).
    - Tài khoản `ADMIN`: Tự động ẩn `Tài Khoản Của Tôi` và thay bằng liên kết **`Quản Lý Bài Đăng`** (`/admin`).
  - **Language Switcher Toggle**: Nút bấm chuyển đổi nhanh **VN ↔ EN** dùng chung toàn hệ thống.
  - **User Session Badge**: Hiển thị tên tài khoản, vai trò và nút 🚪 **Đăng xuất**.

---

### 2. `seller-layout.component.ts`
- **Mục đích**: Bộ khung chuyên biệt cho Kênh Người Bán (Seller Studio) với tone màu Gold Luxury tối sang trọng.
- **Thành phần nổi bật**:
  - **Sidebar bên trái (`w-64`)**: Chứa Menu quản lý (`📋 Danh sách sản phẩm`, `📦 Đơn hàng đã bán`, `+ Tạo bài đăng mới`).
  - **Header Switcher**: Nút bấm chuyển qua lại giữa `Xem: Sản Phẩm Đã Thắng` và `Xem: Sản Phẩm Đã Đăng`.

---

### 3. `admin-layout.component.ts`
- **Mục đích**: Bộ khung quản trị nội dung nghiêm ngặt dành cho Ban Quản Trị (Admin) với tone màu Luxury Dark Emerald (`#09110d` & `#050b08`).
- **Thành phần nổi bật**:
  - **Sidebar bên trái (`w-64`)**: Biểu tượng ⚖ AuctionHub — BAN QUẢN TRỊ, Menu quản lý (`Quản lý bài đăng` với badge `3`, `Quản lý danh mục`, `Người dùng`, `Đơn hàng & khiếu nại`).
  - **Thẻ Admin Profile góc dưới**: Khối hình thoi kim cương Gold **`A`** kèm tên `Admin System` (Admin ID: 1).
  - **Thanh Header Top Bar**: Đặt liên kết nhỏ tinh tế **`← Về sàn đấu giá`** ở góc trái bên cạnh đường dẫn `Ban Quản Trị / Quản lý bài đăng`.

---

# Best Practice & Thiết kế kiến trúc

1. **Separation of Layout Contexts**: Phân tách 3 Layouts hoàn toàn độc lập giúp CSS Tailwind, màu sắc chủ đạo và cấu trúc Sidebar/Header không bị chồng chéo phức tạp.
2. **Nested Router Outlets**: Áp dụng triệt me mô hình Parent Layout ➔ Child Route trong `app.routes.ts` giúp duy trì trạng thái Sidebar/Header cố định khi người dùng di chuyển giữa các trang trong cùng phân vùng.
