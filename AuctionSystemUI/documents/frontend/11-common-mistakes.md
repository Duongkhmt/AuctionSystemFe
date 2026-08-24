# 11. Các Lỗi Thường Gặp & Cách Khắc Phục (Common Mistakes & Solutions)

# Mục đích

Tài liệu tổng hợp các lỗi phổ biến mà lập trình viên mới thường mắc phải khi làm việc trong dự án **AuctionSystemUI** cùng giải pháp khắc phục triệt để.

---

# Danh Sách Lỗi & Hướng Xử Lý

### 1. ❌ Quên bọc `snakeToCamelKeys` khiến dữ liệu hiển thị `undefined`
- **Tình huống**: Viết API Service gọi HTTP GET nhưng bỏ qua toán tử `.pipe(map(res => snakeToCamelKeys(res)))`.
- **Hậu quả**: JSON trả về từ Spring Boot có thuộc tính `current_price`, nhưng trên Angular TypeScript Interface khai báo `currentPrice`. Giao diện hiển thị giá tiền bị rỗng hoặc lỗi `NaN`.
- **Khắc phục**: Luôn qua toán tử map chuyển đổi keys trước khi trả về cho Component.

### 2. ❌ Sai lệch User ID giữa Mock Session và PostgreSQL Database
- **Tình huống**: Khai báo ID cứng người bán `sellerId = 1` trong mock session nhưng trong DB PostgreSQL ID `1` lại là tài khoản `Admin`.
- **Hậu quả**: Khi người bán bấm Đăng bài, bài đăng được ghi nhận cho `Admin` khiến Seller không thấy sản phẩm của mình trong trang danh sách cá nhân.
- **Khắc phục**: Luôn kiểm tra đối chiếu ID trong `user-session.service.ts` khớp đúng 100% với câu lệnh `SELECT id, username, role FROM users;`.

### 3. ❌ Hardcode chuỗi URL API trực tiếp trong Component/Service
- **Tình huống**: Viết `this.http.get('http://localhost:8080/v1/products')` trực tiếp trong code.
- **Hậu quả**: Khi đổi IP server staging hoặc production phải đi tìm và sửa ở hàng chục file khác nhau.
- **Khắc phục**: Tất cả URLs phải khai báo trong tập tin duy nhất [api-endpoints.config.ts](file:///home/duong/Projects/Frontend/AuctionSystemUI/src/app/core/config/api-endpoints.config.ts).

### 4. ❌ Không xử lý Unsubscribe cho RxJS Observables
- **Tình huống**: Subscribe HTTP hoặc Route params nhưng không hủy khi Component ngắt kết nối.
- **Khắc phục**: Sử dụng toán tử `takeUntilDestroyed()` hoặc chuyển sang dùng Signals + `toSignal()` của Angular 18 để tự động quản lý Lifecycle.
