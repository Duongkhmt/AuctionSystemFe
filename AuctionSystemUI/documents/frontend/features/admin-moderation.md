# Feature: Admin Moderation (Cổng Quản Lý Bài Đăng Ban Quản Trị)

# Mục đích
Trang chuyên biệt dành riêng cho Ban Quản Trị (`ADMIN`) để thẩm định và kiểm duyệt các bài đăng mới ở trạng thái `PENDING` trước khi cho phép công khai lên Sàn Đấu Giá.

---

# Cấu trúc & Chi tiết từng File

### 1. `admin.routes.ts`
- **Tuyến đường**: `''`: Render `PendingApprovalComponent`.

---

### 2. `admin-api.service.ts`
- **Mục đích**: Gọi các REST APIs kiểm duyệt bài đăng của Admin.
- **Methods**:
  - `getPendingProducts()`: `GET /v1/admin/products/pending`
  - `approveProduct(id)`: `PUT /v1/admin/products/{id}/approve`
  - `rejectProduct(id, rejectDTO)`: `PUT /v1/admin/products/{id}/reject` kèm lý do từ chối `rejectionReason`.

---

### 3. `admin-layout.component.ts`
- **Mục đích**: Khung giao diện Admin Portal phong cách Luxury Dark Emerald (`#09110d` & `#050b08`).
- **Sidebar Trái**:
  - Logo thương hiệu **AuctionHub — BAN QUẢN TRỊ**.
  - Menu điều hướng: **Quản lý bài đăng** (có badge đếm số lượng bài chờ duyệt), **Quản lý danh mục**, **Người dùng**, **Đơn hàng & khiếu nại**.
  - Khối Profile Admin góc dưới dạng hình thoi kim cương Gold (`Admin System` - Admin ID: 1).
- **Thanh Header**:
  - Đặt liên kết nhỏ tinh tế `← Về sàn đấu giá` ở góc trái bên cạnh đường dẫn `Ban Quản Trị / Quản lý bài đăng`.

---

### 4. `pending-approval.component.ts`
- **Mục đích**: Màn hình danh sách bài chờ duyệt thiết kế dạng hàng ngang (Horizontal Rows) chuẩn mockup.
- **Thành phần giao diện**:
  - Header: Subtitle `— THẨM ĐỊNH NỘI DUNG`, Tiêu đề `Duyệt bài đăng chờ xuất bản`.
  - Filter Tabs: `Xem: Có bài chờ duyệt` (Active Gold Button) và `Xem: Đã xử lý hết`.
  - Danh sách bài chờ duyệt: Thẻ hàng ngang hiển thị ảnh thumbnail, nhãn `LOT — CHỜ CẤP MÃ`, tên sản phẩm, thông tin `Người bán`, `Danh mục`, `Giá khởi điểm` và cặp nút bấm **Từ chối** / **Phê duyệt**.
- **Tính năng Duyệt (Approve)**: Chuyển bài sang `APPROVED` để phiên thầu khởi chạy theo lịch.
- **Tính năng Từ Chối (Reject)**: Mở Modal nhập lý do từ chối `rejectionReason` gửi tới Người bán.
