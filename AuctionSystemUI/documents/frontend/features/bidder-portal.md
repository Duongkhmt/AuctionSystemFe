# Feature: Bidder Portal (Cổng Sản Phẩm Đã Thắng & Cá Nhân)

# Mục đích
Quản lý các bài thầu đã chiến thắng của người dùng vai trò `USER` (Bidder), thực hiện thanh toán đơn hàng (Checkout Payment) và xác nhận nhận hàng. Được bảo vệ bởi `authGuard` và `roleGuard(['USER'])`.

---

# Cấu trúc & Chi tiết từng File

### 1. `bidder-portal.routes.ts`
- **Tuyến đường**:
  - `''`: Render `WonAuctionsComponent`.
  - `'won'`: Render `WonAuctionsComponent`.

---

### 2. `bidding.service.ts` & `order.service.ts`
- **Mục đích**: Gọi API đặt giá thầu và xử lý quy trình đơn hàng trúng thầu.
- **Methods**:
  - `getWonAuctions()`: `GET /v1/bidders/{bidderId}/won-auctions`
  - `checkoutOrder(orderId, data)`: `POST /v1/bidders/{bidderId}/orders/{orderId}/checkout`
  - `confirmReceived(orderId)`: `PUT /v1/bidders/{bidderId}/orders/{orderId}/confirm-received`

---

### 3. `won-auctions.component.ts`
- **Mục đích**: Trang cá nhân hiển thị danh sách các lô sản phẩm mà người dùng đã đấu giá thắng cuộc.
- **Giao diện Gold Luxury**: Thẻ đơn hàng 3 cột phong cách quý phái, phân loại theo 5 Tab trạng thái (`Tất cả`, `Chờ thanh toán`, `Đã thanh toán`, `Đang giao hàng`, `Hoàn tất`).
- **Thao tác**: Mở Modal Checkout điền thông tin giao hàng hoặc bấm nút xác nhận "Đã Nhận Hàng".

---

### 4. `checkout-modal.component.ts`
- **Mục đích**: Popup Modal cho phép người mua nhập địa chỉ nhận hàng chi tiết, số điện thoại liên hệ và lựa chọn cổng thanh toán (VNPAY, Ví điện tử, Chuyển khoản ngân hàng).
