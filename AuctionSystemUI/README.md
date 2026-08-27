# 1. Project Overview

**AuctionSystemUI** là ứng dụng Single Page Application (SPA) Frontend xây dựng trên nền tảng **Angular 18** hiện đại, đóng vai trò là giao diện điều khiển và sàn giao dịch đấu giá trực tuyến cho hệ thống **AuctionSystem**.

Hệ thống cung cấp trải nghiệm giao diện đẳng cấp, trực quan hóa dữ liệu theo thời gian thực (Realtime Countdown, Live Bidding, Anti-Sniping Notifications), áp dụng các chuẩn thiết kế **Glassmorphism**, **Dark Mode Cyberpunk** và kiến trúc quản lý trạng thái phản ứng **Angular 18 Signals**.

---

### Đối tượng sử dụng & Tính năng cốt lõi:

**🏆 Bidder (Người tham gia đấu giá & Người mua):**
- Khám phá danh sách sản phẩm đấu giá công khai theo danh mục và loại hình (`ENGLISH`, `RESERVE`, `BUY_NOW`).
- Theo dõi đồng hồ đếm ngược từng giây và xem chi tiết sản phẩm, phóng to bộ sưu tập ảnh mây.
- Tham gia đặt giá cạnh tranh trực tiếp, cài đặt bước giá trần tự động (**Proxy Bidding Engine**), hoặc chốt mua ngay lập tức (**Buy Now**).
- Xem bảng Lịch sử đặt giá công khai được ẩn danh tên người tham gia (Ví dụ: `d***g`).
- Cổng cá nhân **`🏆 Sản Phẩm Đã Thắng`**: Xem danh sách các bài đấu giá trúng thầu, thực hiện **`💳 Checkout`** điền địa chỉ & SĐT thanh toán, và bấm nút **`📦 Xác Nhận Đã Nhận Hàng`**.

**📦 Seller (Người bán & Kênh Seller Studio):**
- Quản lý danh sách bài đăng của shop, tạo bài đăng mới kèm tải lên đến 20 ảnh mây Cloudinary.
- Cấu hình thông số kỹ thuật động bằng **JSONB Attributes** (Số km xe đi, Diện tích nhà đất, Tác giả...), cài đặt giá khởi điểm, bước giá hoặc giá mua ngay.
- Chỉnh sửa thông tin bài đăng, hủy phiên đấu giá trước giờ G, hoặc tái đăng bài thầu đã hết hạn (**Relist Auction 30d**).
- Cổng quản lý **`📦 Đơn Hàng Đã Bán`**: Xem thống kê tổng doanh thu, lọc trạng thái trả tiền của khách mua, chọn bưu cục vận chuyển (GHTK, GHN, Viettel Post...) và nhập mã vận đơn (**Tracking Code**) để xuất hàng.

**🛡️ Admin (Quản trị viên kiểm duyệt):**
- Cổng kiểm duyệt **`🛡️ Bài Đăng Chờ Duyệt`**: Xem xét nội dung và danh sách ảnh của bài đăng ở trạng thái `PENDING`.
- Thực hiện **Phê duyệt (`Approve`)** để bài đăng chính thức lên sàn hoặc **Từ chối (`Reject`)** kèm nhập lý do cụ thể gửi về cho Seller.

---

# 2. Tech Stack

- **Framework:** Angular 18.2 (Standalone Components Architecture)
- **Language:** TypeScript 5.5
- **Styling & Design System:** Vanilla Tailwind CSS 3.4 (Glassmorphism, Dark Cyberpunk Theme, Dynamic HSL Gradients)
- **State Management:** Angular 18 Signals (`signal`, `computed`, `effect`)
- **Routing:** Angular Router (Lazy Loading Feature Modules & Role Guards)
- **HTTP Client & Async:** Angular HttpClient, RxJS 7.8 (`Observable`, `pipe`, `map`, `catchError`)
- **Forms:** Angular Reactive Forms & FormsModule (`[(ngModel)]` bi-directional binding)
- **Data Conversion Utility:** `snakeToCamelKeys` (Tự động chuyển đổi JSON `snake_case` từ Spring Boot sang `camelCase` TypeScript)
- **Build Tool:** Angular CLI 18.2 (`esbuild` & `vite` bundler cực nhanh)

---

# 3. System Requirements

- **Node.js:** 18.19.0 trở lên (Khuyến nghị LTS 20+)
- **Package Manager:** npm 10+
- **Angular CLI:** 18.2.0 trở lên (`npm install -g @angular/cli`)
- **Backend Service:** Spring Boot Backend (`DuAnTrainning`) đang khởi chạy tại `http://localhost:8080`

---

# 4. Installation & Running

### Bước 1: Clone dự án
```bash
git clone https://github.com/Duongkhmt/AuctionSystemFe.git
cd Frontend/AuctionSystemUI
```

### Bước 2: Cài đặt các gói phụ thuộc (Dependencies)
```bash
npm install
```

### Bước 3: Khởi chạy Máy chủ Phát triển (Development Server)
```bash
ng serve
# Hoặc npm start
```
Truy cập trình duyệt tại địa chỉ: `http://localhost:4200/`

### Bước 4: Đóng gói Sản xuất (Production Build)
```bash
ng build --configuration production
```
Mã nguồn sản xuất sẽ được biên dịch tối ưu hóa vào thư mục `dist/auction-system-ui`.

---

# 5. Project Structure

Mã nguồn được tổ chức theo cấu trúc Enterprise 3 tầng chuẩn hóa:

```text
src/app/
├── ⚙️ core/                      # Tầng Lõi Trung Tâm (Auth, Interceptors, Services & Utils toàn cục)
│   ├── auth/                    # Quản lý phiên làm việc & Tài khoản mẫu (user-session.service.ts)
│   ├── config/                  # Cấu hình đường dẫn API endpoints (api-endpoints.config.ts)
│   ├── guards/                  # Vệ sĩ gác cổng đường dẫn (role.guard.ts, auth.guard.ts)
│   ├── interceptors/            # Bộ chặn HTTP (api-header.interceptor.ts, error.interceptor.ts)
│   ├── services/                # Các dịch vụ dùng chung (order.service.ts, toast.service.ts...)
│   └── utils/                   # Hàm tiện ích (case-converter.util.ts)
│
├── 🧩 shared/                    # Tầng Tái Sử Dụng (Components, Badges, Modals, Pipes, Models)
│   ├── components/              # UI Components (status-badge, product-detail-modal, toast-container)
│   ├── models/                  # Khai báo kiểu TypeScript (product.model.ts, order.model.ts...)
│   └── pipes/                   # Bộ định dạng (currency-vnd.pipe.ts, auction-timer.pipe.ts)
│
├── 🖼️ layout/                    # Tầng Khung Vỏ Giao Diện (Header, Navigation Bars, Sidebars)
│   ├── main-layout/             # Khung dành cho Công khai & Người Mua (Header + User Switcher)
│   ├── seller-layout/           # Khung Kênh Người Bán (Sidebar tối + Menu điều hướng)
│   └── admin-layout/            # Khung Kênh Quản Trị Viên Admin
│
└── 📦 features/                  # Tầng Phân Vùng Nghiệp Vụ Theo Vai Trò (Lazy Loaded Modules)
    ├── public-marketplace/      # Sàn công khai (Home Marketplace, Product Detail & Live Bidding)
    ├── seller-studio/           # Kênh Người Bán (Product List, Create/Edit Product, Seller Orders)
    ├── bidder-portal/           # Cổng Người Mua (Won Auctions List, Checkout Payment Modal)
    └── admin-moderation/        # Cổng Admin (Pending Approval List & Approval Action Bar)
```

---

# 6. Business Overview & Architecture

### 1. Luồng Dữ Liệu Tự Động Đồng Bộ (Data Flow Architecture)
```text
[ User Action ] ──► [ Component Signals ] ──► [ Feature / Core Service ]
                                                      │
                                                      ▼
[ Browser Screen ] ◄── [ case-converter ] ◄── [ HTTP Interceptor ] ◄── [ Spring Boot REST API ]
```

### 2. Chuyển Đổi Định Dạng Tự Động (`snakeToCamelKeys`)
Dữ liệu gửi từ Spring Boot Backend sử dụng định dạng `snake_case` (như `product_title`, `winning_price`, `shipping_address`). Tại tầng Service (`order.service.ts`, `seller-api.service.ts`), dữ liệu tự động được lọc qua hàm đệ quy `snakeToCamelKeys` để chuyển đổi mượt mà sang `camelCase` (`productTitle`, `winningPrice`, `shippingAddress`), giúp mã nguồn TypeScript luôn nhất quán.

### 3. Đấu Giá Trực Tiếp Realtime & Redis Atomic Concurrency Integration
- **Tích hợp Đấu Giá Siêu Tốc Redis Atomic:** Kết nối API đặt giá siêu tốc `< 2ms` với Backend. Khi người dùng bị thua giá (outbid) hoặc trả giá không hợp lệ, `errorInterceptor` tự động giải mã thông báo từ Spring Boot và hiển thị Toast cảnh báo màu đỏ trực quan lập tức mà không gây đứng trang.
- **Live Countdown Pipe (`auctionTimer`):** Tính toán và cập nhật nhịp tim đồng hồ từng giây (`HH:mm:ss`).
- **Auto Polling Engine:** Tự động gửi request 3 giây/lần ở trang chi tiết sản phẩm để lấy số tiền thầu mới nhất mà không gây giật lag màn hình.
- **Chốt thầu thời gian cứng (Hard-Close Mode):** Đếm ngược đồng hồ chính xác tới thời điểm kết thúc phiên (`endTime`) và tự động chốt thầu ngầm (hết giờ là hết giờ).

### 4. Quy Trình Xử Lý Đơn Hàng Hậu Đấu Giá (Post-Auction Order Settlement)
```text
  [Phiên kết thúc ENDED] ➔ [Hệ thống tự tạo Đơn hàng UNPAID] 
                                    │
                                    ▼
  [Người mua vào /my-bids] ➔ [Bấm Checkout điền địa chỉ/SĐT] ➔ [Trạng thái PAID]
                                                                     │
                                                                     ▼
  [Người bán vào /seller/orders] ➔ [Nhập Mã vận đơn Tracking] ➔ [Trạng thái SHIPPING]
                                                                     │
                                                                     ▼
  [Người mua nhận hàng] ➔ [Bấm "Xác Nhận Đã Nhận Hàng"] ➔ [Trạng thái COMPLETED]
```

---

# 7. Frontend Routes & Service Integrations

### 1. Routes Công Khai & Người Mua (Public & Bidder Routes)
| Route Đường Dẫn | Component Màn Hình       | Mô Tả & Nghiệp Vụ                                                 | API Backend Kết Nối                                                                           |
|:----------------|:-------------------------|:------------------------------------------------------------------|:----------------------------------------------------------------------------------------------|
| `/`             | `HomeComponent`          | Danh sách bài đăng công khai & Bộ lọc danh mục                    | `GET /v1/products`, `GET /v1/categories`                                                      |
| `/product/:id`  | `ProductDetailComponent` | Chi tiết sản phẩm, Live Bidding, Auto-Bid, Buy Now & Lịch sử thầu | `GET /v1/products/{id}`, `POST /v1/auctions/{id}/bids`, `POST /v1/auctions/{id}/buy-now`      |
| `/my-bids`      | `WonAuctionsComponent`   | Cổng danh sách sản phẩm thắng thầu của người mua & bộ lọc Tab     | `GET /v1/bidders/{id}/won-auctions`, `PUT /v1/bidders/{id}/orders/{orderId}/confirm-received` |
| `-- (Modal)`    | `CheckoutModalComponent` | Popup điền địa chỉ giao hàng, SĐT & chọn cổng thanh toán VNPAY/Ví | `POST /v1/bidders/{id}/orders/{orderId}/checkout`                                             |

### 2. Routes Người Bán (Seller Studio Routes)
| Route Đường Dẫn    | Component Màn Hình       | Mô Tả & Nghiệp Vụ                                                        | API Backend Kết Nối                                                                        |
|:-------------------|:-------------------------|:-------------------------------------------------------------------------|:-------------------------------------------------------------------------------------------|
| `/seller`          | `ProductListComponent`   | Quản lý danh sách bài đăng của Seller (Sửa, Hủy, Relist)                 | `GET /v1/sellers/{id}/products`, `PUT /products/{id}/cancel`, `POST /auctions/{id}/relist` |
| `/seller/create`   | `CreateProductComponent` | Đăng bài mới đính kèm chọn loại thầu, bước giá, thuộc tính động & 20 ảnh | `POST /v1/sellers/{id}/products`                                                           |
| `/seller/edit/:id` | `EditProductComponent`   | Chỉnh sửa nội dung bài đăng và cập nhật danh sách ảnh                    | `PUT /v1/sellers/{id}/products/{id}`                                                       |
| `/seller/orders`   | `SellerOrdersComponent`  | Thống kê doanh thu & Quản lý danh sách đơn hàng đã bán được              | `GET /v1/sellers/{id}/orders`                                                              |
| `-- (Modal)`       | `ShipModalComponent`     | Popup chọn bưu cục (GHTK, GHN...) và nhập Mã vận đơn xuất hàng           | `PUT /v1/sellers/{id}/orders/{orderId}/ship`                                               |

### 3. Routes Quản Trị Viên (Admin Routes)
| Route Đường Dẫn | Component Màn Hình         | Mô Tả & Nghiệp Vụ                                             | API Backend Kết Nối                                                                                     |
|:----------------|:---------------------------|:--------------------------------------------------------------|:--------------------------------------------------------------------------------------------------------|
| `/admin`        | `PendingApprovalComponent` | Màn hình kiểm duyệt danh sách các bài đăng sản phẩm chờ duyệt | `GET /v1/admin/products/pending`, `PUT /admin/products/{id}/approve`, `PUT /admin/products/{id}/reject` |

---

# 8. UI Design System & Component Guidelines

- **Thiết kế Kính Mờ (Glassmorphism):** Áp dụng hiệu ứng `backdrop-blur-md`, nền tối `bg-slate-900/60` kết hợp viền mờ `border-slate-800` tạo ấn tượng cực kỳ sang trọng.
- **Bảng Màu Hiện Đại (Color Palette):**
  - Emerald Xanh Lá (`#10b981`): Dành cho Giá thầu, Doanh thu, Đã thanh toán (`PAID`) & Hoàn tất (`COMPLETED`).
  - Indigo Xanh Tím (`#6366f1`): Dành cho Nút hành động chính, Mã đơn hàng `#ORD` & Bước giá.
  - Amber Vàng Da Cam (`#f59e0b`): Dành cho Cảnh báo Chờ kiểm duyệt (`PENDING`), Chờ thanh toán (`UNPAID`) & Vinh danh Winner.
  - Rose Đỏ (`#f43f5e`): Dành cho Nút Từ chối & Báo lỗi hệ thống.
- **Phông Chữ Chuyên Nghiệp:** Sử dụng phông chữ Sans-serif hiện đại kết hợp `font-mono` cho tất cả các con số giá tiền, mã định danh ID và mã vận đơn.

---

# 9. Development Status & Roadmap

Checklist các tính năng đã hoàn thiện 100%:

- [x] Trang chủ Sàn đấu giá công khai & Tìm kiếm/Lọc theo danh mục
- [x] Xem chi tiết sản phẩm, phóng to ảnh gallery & Xem thông số động JSONB
- [x] Đấu giá trực tiếp Realtime (Live Bidding & Auto-Bid Proxy Bidding)
- [x] Tính năng Mua Ngay giá cố định (Buy Now)
- [x] Lịch sử đặt giá công khai ẩn danh người dùng (`d***g`)
- [x] Kênh Seller Studio: Đăng sản phẩm mới tải 20 ảnh Cloudinary, Sửa bài, Hủy phiên, Relist 30d
- [x] Kênh Admin Moderation: Phê duyệt (`Approve`) hoặc Từ chối bài (`Reject`) kèm lưu lý do
- [x] Cổng Người Mua (`WonAuctionsComponent`): Quản lý bài thắng thầu, lọc Tab trạng thái
- [x] Modal Popup Checkout Thanh Toán: Nhập Địa chỉ chi tiết, SĐT & Chọn phương thức VNPAY/Ví/Chuyển khoản
- [x] Cổng Người Bán (`SellerOrdersComponent`): Thống kê doanh thu, quản lý đơn hàng đã bán
- [x] Modal Popup Ship Hàng: Nhập đơn vị bưu cục & Mã vận đơn (Tracking Code)
- [x] Tự động chuyển đổi `snake_case` ➔ `camelCase` cho toàn bộ HTTP API responses
- [x] Toàn bộ mã nguồn được bổ sung JSDoc & Chú thích giải thích Tiếng Việt chi tiết từng dòng code
- [x] Đóng gói và kiểm thử biên dịch thành công 100% với Angular 18 Production Build
