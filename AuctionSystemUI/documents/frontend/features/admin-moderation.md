# Feature: Admin Moderation & Management (Ban Quản Trị Hệ Thống)

# Mục đích
Cổng quản trị toàn diện dành riêng cho Ban Quản Trị (`ADMIN`) bao gồm 4 phân khu chức năng:
1. **Kiểm duyệt bài đăng** (`/admin` - `PendingApprovalComponent`)
2. **Két Escrow & Dòng Tiền Sàn** (`/admin/finance` - `FinancialDashboardComponent`)
3. **Quản lý danh mục sản phẩm** (`/admin/categories` - `CategoryManagementComponent`)
4. **Quản lý tài khoản người dùng** (`/admin/users` - `UserManagementComponent`)

---

# Cấu trúc & Chi tiết từng File

### 1. `admin.routes.ts`
- **Tuyến đường (Guard: `roleGuard(['ADMIN'])`)**:
  - `''`: Render `PendingApprovalComponent` (Quản lý & thẩm định bài đăng chờ duyệt).
  - `'finance'`: Render `FinancialDashboardComponent` (Quản lý Két Escrow Sàn, tổng doanh số & dòng tiền).
  - `'categories'`: Render `CategoryManagementComponent` (Quản lý danh mục sản phẩm đấu giá).
  - `'users'`: Render `UserManagementComponent` (Quản lý danh sách thành viên & khóa/mở khóa tài khoản).

---

### 2. `admin-api.service.ts` & `OrderService.java`
- **Mục đích**: Giao tiếp với toàn bộ nhóm REST APIs quản trị của Admin trong `AdminProductController.java` (`/v1/admin/products/...`):
- **Methods**:
  - `getPendingProducts()`: `GET /v1/admin/products/pending` (Danh sách bài `PENDING`)
  - `approveProduct(id)`: `PUT /v1/admin/products/{id}/approve` (Duyệt bài đăng)
  - `rejectProduct(id, rejectDTO)`: `PUT /v1/admin/products/{id}/reject` (Từ chối bài đính kèm lý do)
  - `getAllCategories()`: `GET /v1/admin/products/categories` (Xem tất cả danh mục)
  - `createCategory(request)`: `POST /v1/admin/products/categories` (Tạo danh mục mới)
  - `updateCategory(id, request)`: `PUT /v1/admin/products/categories/{id}` (Cập nhật danh mục)
  - `deleteCategory(id)`: `DELETE /v1/admin/products/categories/{id}` (Ẩn danh mục)
  - `getAllUsers()`: `GET /v1/admin/products/users` (Xem danh sách tài khoản)
  - `updateUserStatus(id, request)`: `PUT /v1/admin/products/users/{id}/status` (Thay đổi trạng thái ACTIVE / BANNED / LOCKED)
  - `getAdminOrders(status)`: `GET /v1/admin/products/orders` (Quản lý toàn bộ đơn hàng & Két Escrow Sàn)

---

### 3. `admin-layout.component.ts`
- **Mục đích**: Khung giao diện Admin Portal phong cách Luxury Dark Emerald (`#09110d` & `#050b08`).
- **Sidebar Trái**:
  - Logo thương hiệu **AuctionHub — BAN QUẢN TRỊ**.
  - Menu điều hướng 4 mục:
    1. **Quản lý bài đăng** (`/admin`)
    2. **🔒 Két Escrow & Dòng Tiền** (`/admin/finance`)
    3. **Quản lý danh mục** (`/admin/categories`)
    4. **Người dùng** (`/admin/users`)
  - Khối Profile Admin góc dưới dạng hình thoi kim cương Gold (`Admin System` - Admin ID: 1).
- **Thanh Header**:
  - Đặt liên kết nhỏ tinh tế `← Về sàn đấu giá` ở góc trái bên cạnh đường dẫn `Ban Quản Trị / Admin Portal`.

---

### 4. `pending-approval.component.ts`
- **Mục đích**: Màn hình kiểm duyệt các bài đăng chờ xuất bản dạng hàng ngang (Horizontal Rows).
- **Chức năng**: Xem chi tiết bộ ảnh Cloudinary, thông số kỹ thuật động JSONB, duyệt bài (`APPROVE`) hoặc từ chối bài (`REJECT`) kèm lưu lý do vi phạm.

---

### 5. `financial-dashboard.component.ts` & `.html`
- **Mục đích**: Bảng cân đối tài chính & quản lý Két Escrow Sàn đấu giá.
- **Tính năng**:
  - Thống kê tổng số dư Escrow đang giữ hộ, tổng số đơn đã giải ngân và tổng số đơn hoàn tất.
  - Bộ lọc Tab trạng thái đơn hàng toàn hệ thống (`Tất cả`, `Chờ thanh toán`, `Đã thanh toán`, `Đang giao`, `Hoàn tất`).
  - Hiển thị chi tiết thời gian giao dịch theo múi giờ `UTC+7` (`Asia/Ho_Chi_Minh`).

---

### 6. `category-management.component.ts`
- **Mục đích**: Màn hình quản lý toàn bộ danh mục sản phẩm đấu giá.
- **Tính năng**:
  - Tìm kiếm danh mục theo tên, lọc theo trạng thái (`Đang hoạt động`, `Đã ẩn`).
  - Bảng dữ liệu chi tiết danh mục, nút **➕ Thêm danh mục mới**, nút **✏️ Sửa** và **🔒 Ẩn / 🔓 Hiện**.
  - Popup Modal thêm/sửa danh mục có chọn danh mục cha (Parent Category) và bật/tắt hiển thị.

---

### 7. `user-management.component.ts`
- **Mục đích**: Màn hình quản lý tất cả tài khoản thành viên trong hệ thống.
- **Tính năng**:
  - Thống kê tổng số tài khoản, số người dùng `ACTIVE` và bị `BANNED`.
  - Tìm kiếm theo Username, Email, ID; lọc theo trạng thái tài khoản.
  - Hiển thị chi tiết vai trò, cảnh báo số lần bùng đơn (`unpaidStrikeCount`), thời hạn bị cấm thầu (`bannedUntil`).
  - Nút hành động nhanh **🚫 Khóa tài khoản** / **🔓 Mở khóa tài khoản**.
