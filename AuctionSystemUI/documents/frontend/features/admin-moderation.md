# Feature: Admin Moderation (Ban Kiểm Duyệt Admin)

# Mục đích
Trang chuyên biệt dành riêng cho Ban Quản Trị (`ROLE_ADMIN`) để kiểm duyệt các bài đăng mới ở trạng thái `PENDING_APPROVAL` trước khi cho phép công khai lên Sàn Đấu Giá.

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

### 3. `pending-approval.component.ts`
- **Mục đích**: Giao diện hiển thị danh sách các bài chờ duyệt dạng Card trực quan.
- **Tính năng Duyệt (Approve)**: Chuyển bài sang `APPROVED` để phiên thầu khởi chạy theo lịch.
- **Tính năng Từ Chối (Reject)**: Mở khung nhập `rejectionReason` bắt buộc để trả về phản hồi cho Người bán.
