# Feature: Seller Studio (Kênh Dành Cho Người Bán)

# Mục đích
Cung cấp môi trường quản lý cho người bán (Seller): Đăng sản phẩm mới kèm hình ảnh (Upload Multipart/Cloudinary), theo dõi danh sách bài đăng, chủ động hủy bài thầu chưa có người bid hoặc relist bài thầu đã hết hạn.

---

# Cấu trúc & Chi tiết từng File

### 1. `seller.routes.ts`
- **Tuyến đường**:
  - `''`: Render `ProductListComponent`.
  - `'create'`: Render `CreateProductComponent`.

---

### 2. `seller-api.service.ts`
- **Mục đích**: Giao tiếp với các REST API thuộc nhóm `/v1/sellers/{sellerId}/products`.
- **Methods**:
  - `getSellerProducts(sellerId)`: `GET /v1/sellers/{sellerId}/products`
  - `createProduct(sellerId, formData)`: `POST /v1/sellers/{sellerId}/products` với `FormData` upload ảnh.
  - `updateProduct(sellerId, id, formData)`: `PUT /v1/sellers/{sellerId}/products/{id}`
  - `deleteProduct(sellerId, id)`: `DELETE /v1/sellers/{sellerId}/products/{id}`
  - `cancelAuction(sellerId, id)`: `PUT /v1/sellers/{sellerId}/products/{id}/cancel`
  - `relistAuction(sellerId, auctionId)`: `POST /v1/sellers/{sellerId}/products/{auctionId}/relist`

---

### 3. `product-list.component.ts`
- **Mục đích**: Màn hình xem tất cả sản phẩm của Seller hiện tại.
- **Thao tác**: Cho phép người bán bấm Hủy phiên (Cancel) hoặc Đăng lại (Relist) 30 ngày mới nếu trạng thái bài thầu là `EXPIRED`.

---

### 4. `create-product.component.ts`
- **Mục đích**: Màn hình Form tạo sản phẩm mới.
- **Dynamic Categories**: Gọi `CategoryService.getCategories()` khi `ngOnInit()` để nạp danh mục động từ DB PostgreSQL (`📁 Bất Động Sản`, `↳ Biệt Thự & Căn Hộ`...).
- **FormData Upload**: Đóng gói các trường text cùng mảng file ảnh `selectedFiles` vào `FormData` gửi lên Spring Boot upload trực tiếp Cloudinary.
