# Shared Pipes: Data Formatting Pure Transformers

# Mục đích
Cung cấp các bộ chuyển đổi dữ liệu đầu ra hiển thị trên giao diện người dùng.

---

# Cấu trúc & Chi tiết từng File

### 1. `currency-vnd.pipe.ts`
- **Mục đích**: Chuyển đổi giá trị kiểu số (`number`) thành chuỗi tiền tệ Việt Nam Đồng theo định dạng chuẩn quốc tế (`vi-VN VND`).
- **Code implementation**:
  ```typescript
  @Pipe({ name: 'currencyVnd', standalone: true })
  export class CurrencyVndPipe implements PipeTransform {
    transform(value?: number | null): string {
      if (value === null || value === undefined) return '0 ₫';
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(value);
    }
  }
  ```
- **Ví dụ**: `50000000` ➔ `50.000.000 ₫`.

---

### 2. `auction-timer.pipe.ts`
- **Mục đích**: Tính toán khoảng thời gian còn lại giữa thời gian kết thúc (`endTimeStr`) và thời gian hiện tại (`Date.now()`).
- **Logic output**:
  - Nếu `diff <= 0`: Trả về `'Đã kết thúc'`.
  - Nếu còn nhiều hơn 1 ngày: Trả về `X ngày Yh Zm`.
  - Nếu trong ngày: Trả về dạng đồng hồ bấm giờ `HH:MM:SS` với hàm `padStart(2, '0')`.
- **Ví dụ**: `'2026-08-10T15:00:00'` ➔ `4 ngày 2h 15m` hoặc `01:45:30`.

---

### 3. `mask-name.pipe.ts`
- **Mục đích**: Bảo vệ quyền riêng tư cá nhân của người tham gia đấu giá trên trang công khai.
- **Code implementation**:
  ```typescript
  @Pipe({ name: 'maskName', standalone: true })
  export class MaskNamePipe implements PipeTransform {
    transform(name?: string): string {
      if (!name) return 'Ẩn danh';
      return name;
    }
  }
  ```
