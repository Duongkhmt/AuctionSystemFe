# 07. Mô Hình Xác Thực & Session (Authentication & Session Architecture)

# Mục đích

Tài liệu này chi tiết hóa mô hình Xác thực (Auth), Quản lý JWT Token, Session người dùng và đặc biệt là cơ chế **Role Tester Mode** độc đáo được thiết kế riêng cho dự án **AuctionSystemUI**.

---

# Kiến Trúc Quản Lý Session Dựa Trên Signals

```text
               ┌────────────────────────┐
               │    localStorage        │
               │ 'active_user_session'  │
               └───────────┬────────────┘
                           │ (Initial Read)
                           ▼
              ┌──────────────────────────┐
              │   UserSessionService     │
              │ currentUser = signal(...)│
              └────────────┬─────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
[ MainLayout Header ] [ CreateProduct ] [ PendingApproval ]
 (Hiển thị Name/ID)  (Gửi sellerId)    (Duyệt bài Admin)
```

---

# Cơ Chế "Role Tester Mode" Chuyển Vai Trò Nhanh

Do đặc thụ hệ thống Đấu giá cần kiểm thử liên tục hành vi tương tác giữa 3 vai trò (Bidder thầu ➔ Seller tạo bài ➔ Admin duyệt bài), hệ thống được trang bị công cụ **Role Tester Bar** ngay trên thanh Top Header của `MainLayoutComponent`.

Khi bấm chọn 1 trong 3 vai trò:
1. `UserSessionService.switchToRole(role)` được kích hoạt.
2. Signal `currentUser` lập tức cập nhật đối tượng User khớp với DB PostgreSQL:
   - **`ROLE_ADMIN`**: `ID: 1` (`Admin`)
   - **`ROLE_SELLER`**: `ID: 2` (`Thanh Trúc`)
   - **`ROLE_BIDDER`**: `ID: 3` (`T Dương`)
3. `localStorage` đồng bộ lưu đối tượng mới để khi nhấn F5 refresh trang vẫn giữ nguyên vai trò đang chọn.
4. Giao diện điều hướng tự động chuyển tới phân vùng tương ứng (`/seller`, `/admin` hoặc `/`).

---

# Điểm Đồng Bộ Quan Trọng Với PostgreSQL Database

Tất cả ID trong Mock Session được khớp 100% với dữ liệu thực tế trong DB:

```sql
SELECT id, username, email, role FROM users;
-- Output:
-- 1 | Admin      | admin123@gmail.com | ADMIN
-- 2 | Thanh Trúc | ttruc00@gmail.com  | SELLER
-- 3 | T Dương    | TDuong04@gmail.com | BIDDER
```

Nhờ thiết kế này, khi Seller `Thanh Trúc` tạo sản phẩm mới, Backend nhận đúng `sellerId = 2` và ghi nhận Foreign Key chính xác trong bảng `products`.
