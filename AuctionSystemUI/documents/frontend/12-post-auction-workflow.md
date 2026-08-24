# 12. TÀI LIỆU ĐẶC TẢ CHI TIẾT NGHIỆP VỤ FRONTEND: XỬ LÝ KẾT QUẢ ĐẤU GIÁ & ĐƠN HÀNG (POST-AUCTION FRONTEND SPECIFICATION)

---

## 📌 1. BỐI CẢNH & NGUYÊN TẮC THIẾT KẾ FRONTEND

Sau khi phiên đấu giá đếm ngược kết thúc (`ENDED`), Frontend Angular 18 sẽ chịu trách nhiệm hiển thị trải nghiệm người dùng chuyên nghiệp:
1. **Trang công khai**: Hiển thị Banner Vinh Danh người trúng thầu.
2. **Kênh Người Mua (`/my-bids`)**: Quản lý danh sách sản phẩm thắng cuộc & Thanh toán đơn hàng.
3. **Kênh Người Bán (`/seller/orders`)**: Quản lý đơn hàng trúng thầu & Nhập mã vận đơn.

---

## 🧩 2. ĐẶC TẢ CHI TIẾT TỪNG MÀN HÌNH & COMPONENT FRONTEND

### 2.1. Component `WonAuctionsComponent` (`/my-bids/won` / Trang Sản Phẩm Đã Thắng)

#### 📍 Vị trí file:
`src/app/features/bidder-portal/pages/won-auctions/won-auctions.component.ts`

#### 🛡️ Quy tắc nghiệp vụ & Hiển thị UI:
1. Gửi HTTP GET `/v1/bidders/{bidderId}/won-auctions` bằng `OrderService`.
2. Hiển thị dạng **Grid Card (3 cột)** hoặc **Bảng Danh Sách Đơn Hàng**:
   - Ảnh đại diện sản phẩm, Tiêu đề, Mã đơn hàng `#ORD-101`.
   - **Giá thắng chung cuộc**: Định dạng tiền tệ VNĐ màu xanh lá font-mono.
   - **Badge trạng thái đơn**:
     - `UNPAID` (Cam - Chờ thanh toán)
     - `PAID` (Xanh lá - Đã thanh toán, chờ giao)
     - `SHIPPING` (Xanh dương - Đang vận chuyển)
     - `COMPLETED` (Xám đậm - Hoàn tất)
3. **Nút Thao Tác [💳 Thanh Toán Ngay]**:
   - Chỉ xuất hiện khi `status === 'UNPAID'`.
   - Bấm vào sẽ mở `CheckoutModalComponent`.
4. **Nút Thao Tác [📦 Đã Nhận Hàng Thành Công]**:
   - Chỉ xuất hiện khi `status === 'SHIPPING'`.
   - Bấm vào sẽ gửi HTTP PUT `/v1/bidders/{bidderId}/orders/{orderId}/confirm-received`.

---

### 2.2. Component `CheckoutModalComponent` (Popup Điền Địa Chỉ & Thanh Toán)

#### 📍 Vị trí file:
`src/app/features/bidder-portal/components/checkout-modal/checkout-modal.component.ts`

#### 🛡️ Form Input & Validations:
1. `shippingAddress`: Textarea nhập địa chỉ giao hàng (`Validators.required`).
2. `phoneNumber`: Input nhập SĐT (`Validators.required`, `Validators.pattern('^(0[3|5|7|8|9])+([0-9]{8})$')`).
3. `paymentMethod`: Radio button chọn `VNPAY`, `WALLET`, hoặc `BANK_TRANSFER`.
4. Khi Submit: Gửi HTTP POST `/v1/orders/{orderId}/checkout`. Hiện hiệu ứng `animate-spin` trên nút thanh toán.

---

### 2.3. Component `SellerOrdersComponent` (`/seller/orders` / Kênh Đơn Hàng Người Bán)

#### 📍 Vị trí file:
`src/app/features/seller-studio/pages/seller-orders/seller-orders.component.ts`

#### 🛡️ Quy tắc nghiệp vụ & Hiển thị UI:
1. Gửi HTTP GET `/v1/sellers/{sellerId}/orders`.
2. Hiển thị danh sách bài thầu trúng của shop:
   - Thông tin người trúng (Họ tên, SĐT, Địa chỉ nhận hàng nếu đơn đã `PAID`).
   - Tổng số tiền cần thu.
3. **Nút Thao Tác [🚚 Nhập Mã Vận Chuyển]**:
   - Chỉ hoạt động khi `status === 'PAID'`. (Nếu đơn đang `UNPAID` nút bấm sẽ mờ và cảnh báo *"Chờ Người mua thanh toán tiền trước"*).
   - Mở Popup nhập `courierName` (GHTK/GHN) & `trackingNumber`.
   - Gửi HTTP PUT `/v1/sellers/{sellerId}/orders/{orderId}/ship`.

---

## 📁 3. MÔ HÌNH DỮ LIỆU FRONTEND MODELS (`order.model.ts`)

```typescript
export type OrderStatus = 'UNPAID' | 'PAID' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';

export interface OrderResponse {
  orderId: number;
  auctionId: number;
  productId: number;
  productTitle: string;
  productImage?: string;
  winningPrice: number;
  buyerName?: string;
  buyerPhone?: string;
  shippingAddress?: string;
  courierName?: string;
  trackingNumber?: string;
  status: OrderStatus;
  createdAt: string;
}

export interface CheckoutRequest {
  shippingAddress: string;
  phoneNumber: string;
  paymentMethod: string;
}

export interface ShipOrderRequest {
  courierName: string;
  trackingNumber: string;
}
```
