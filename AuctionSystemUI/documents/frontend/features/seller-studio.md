# Feature: Seller Studio (Kênh Dành Cho Người Bán)

# Mục đích
Cung cấp môi trường quản lý cho người bán (Seller): Đăng sản phẩm mới kèm hình ảnh (Upload Multipart/Cloudinary), xem trước trực tiếp (Live Preview Card), theo dõi danh sách bài đăng, quản lý đơn hàng đã bán, xuất hàng kèm nhập mã vận đơn, hủy bài thầu chưa có người bid hoặc relist bài thầu đã hết hạn.

---

# Cấu trúc & Chi tiết từng File

### 1. `seller.routes.ts`
- **Tuyến đường**:
  - `''`: Render `SellerProductListComponent`.
  - `'create'`: Render `CreateProductComponent`.
  - `'edit/:id'`: Render `EditProductComponent`.
  - `'orders'`: Render `SellerOrdersComponent`.

---

### 2. `seller-api.service.ts`
- **Mục đích**: Giao tiếp với các REST API thuộc nhóm `/v1/sellers/{sellerId}/products` và `/v1/sellers/{sellerId}/orders`.
- **Methods**:
  - `getSellerProducts()`: `GET /v1/sellers/{sellerId}/products`
  - `createProduct(formData)`: `POST /v1/sellers/{sellerId}/products` với `FormData` upload ảnh.
  - `updateProduct(id, formData)`: `PUT /v1/sellers/{sellerId}/products/{id}`
  - `deleteProduct(id)`: `DELETE /v1/sellers/{sellerId}/products/{id}`
  - `cancelAuction(id)`: `PUT /v1/sellers/{sellerId}/products/{id}/cancel`
  - `relistAuction(auctionId)`: `POST /v1/sellers/{sellerId}/products/{auctionId}/relist`
  - `getSellerOrders()`: `GET /v1/sellers/{sellerId}/orders`
  - `shipOrder(orderId, shipData)`: `PUT /v1/sellers/{sellerId}/orders/{orderId}/ship`

---

### 3. `product-list.component.ts`
- **Mục đích**: Màn hình xem tất cả sản phẩm của Seller hiện tại.
- **Thao tác**: Cho phép người bán bấm Sửa (Edit), Hủy phiên (Cancel) hoặc Đăng lại (Relist) 30 ngày mới nếu trạng thái bài thầu là `EXPIRED`.

---

### 4. `create-product.component.ts` & `edit-product.component.ts`
- **Mục đích**: Màn hình Form tạo và chỉnh sửa bài đăng sản phẩm.
- **Dynamic Categories**: Nạp danh mục động từ DB PostgreSQL (`📁 Bất Động Sản`, `↳ Biệt Thự & Căn Hộ`...).
- **Live Preview Card (Khung Xem Trước Trực Tiếp)**:
  - Tên danh mục tự động nhảy theo ô chọn `selectedCategoryName()`.
  - Số ngày thời lượng phiên thầu tự động tính toán từ `startTime` và `endTime` (`durationDays()`).
  - Tiêu đề sản phẩm tự động phản hồi theo từng phím gõ của người dùng (Reactive Signals).
- **FormData Upload**: Đóng gói các trường text cùng mảng file ảnh `selectedFiles` vào `FormData` gửi lên Spring Boot.

---

### 5. `seller-orders.component.ts` & `ship-modal.component.ts`
- **Mục đích**: Quản lý danh sách đơn hàng đã bán được của Seller, theo dõi doanh thu và mở Popup Modal chọn đơn vị bưu cục (GHTK, GHN, Viettel Post...) kèm nhập Mã vận đơn xuất hàng (**Tracking Code**).
