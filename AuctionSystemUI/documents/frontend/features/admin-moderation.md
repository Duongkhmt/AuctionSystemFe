# Feature: Admin Moderation & Management (Ban Quản Trị Hệ Thống)

# Mục đích
Cổng quản trị toàn diện dành riêng cho Ban Quản Trị (`ADMIN`) bao gồm: Thẩm định & kiểm duyệt bài đăng (`/admin`), Quản lý danh mục sản phẩm (`/admin/categories`) và Quản lý tài khoản người dùng (`/admin/users`).

---

# Cấu trúc & Chi tiết từng File

### 1. `admin.routes.ts`
- **Tuyến đường**:
  - `''`: Render `PendingApprovalComponent` (Quản lý bài đăng chờ duyệt).
  - `'categories'`: Render `CategoryManagementComponent` (Quản lý danh mục sản phẩm).
  - `'users'`: Render `UserManagementComponent` (Quản lý tài khoản người dùng).

---

### 2. `admin-api.service.ts`
- **Mục đích**: Giao tiếp với toàn bộ nhóm REST APIs quản trị của Admin trong `AdminProductController.java`:
- **Methods**:
  - `getPendingProducts()`: `GET /v1/admin/products/pending`
  - `approveProduct(id)`: `PUT /v1/admin/products/{id}/approve`
  - `rejectProduct(id, rejectDTO)`: `PUT /v1/admin/products/{id}/reject`
  - `getAllCategories()`: `GET /v1/admin/products/categories`
  - `createCategory(request)`: `POST /v1/admin/products/categories`
  - `updateCategory(id, request)`: `PUT /v1/admin/products/categories/{id}`
  - `deleteCategory(id)`: `DELETE /v1/admin/products/categories/{id}`
  - `getAllUsers()`: `GET /v1/admin/products/users`
  - `updateUserStatus(id, request)`: `PUT /v1/admin/products/users/{id}/status`

---

### 3. `admin-layout.component.ts`
- **Mục đích**: Khung giao diện Admin Portal phong cách Luxury Dark Emerald (`#09110d` & `#050b08`).
- **Sidebar Trái**:
  - Logo thương hiệu **AuctionHub — BAN QUẢN TRỊ**.
  - Menu điều hướng: **Quản lý bài đăng** (`/admin`), **Quản lý danh mục** (`/admin/categories`), **Người dùng** (`/admin/users`).
  - Khối Profile Admin góc dưới dạng hình thoi kim cương Gold (`Admin System` - Admin ID: 1).
- **Thanh Header**:
  - Đặt liên kết nhỏ tinh tế `← Về sàn đấu giá` ở góc trái bên cạnh đường dẫn `Ban Quản Trị / Admin Portal`.

---

### 4. `pending-approval.component.ts`
- **Mục đích**: Màn hình kiểm duyệt các bài đăng chờ xuất bản dạng hàng ngang (Horizontal Rows).

---

### 5. `category-management.component.ts`
- **Mục đích**: Màn hình quản lý toàn bộ danh mục sản phẩm đấu giá.
- **Tính năng**:
  - Tìm kiếm danh mục theo tên, lọc theo trạng thái (`Đang hoạt động`, `Đã ẩn`).
  - Bảng dữ liệu chi tiết danh mục, nút **➕ Thêm danh mục mới**, nút **✏️ Sửa** và **🔒 Ẩn / 🔓 Hiện**.
  - Popup Modal thêm/sửa danh mục có chọn danh mục cha (Parent Category) và bật/tắt hiển thị.

---

### 6. `user-management.component.ts`
- **Mục đích**: Màn hình quản lý tất cả tài khoản thành viên trong hệ thống.
- **Tính năng**:
  - Thống kê tổng số tài khoản, số người dùng `ACTIVE` và bị `BANNED`.
  - Tìm kiếm theo Username, Email, ID; lọc theo trạng thái tài khoản.
  - Hiển thị chi tiết vai trò, cảnh báo số lần bùng đơn (`unpaidStrikeCount`), thời hạn bị cấm thầu (`bannedUntil`).
  - Nút hành động nhanh **🚫 Khóa tài khoản** / **🔓 Mở khóa tài khoản**.
