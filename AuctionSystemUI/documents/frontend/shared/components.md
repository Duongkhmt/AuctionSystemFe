# Shared Components: UI Presentational Widgets

# Mục đích
Chứa các UI Components có khả năng tái sử dụng cao trên nhiều màn hình khác nhau trong toàn bộ ứng dụng.

---

# Cấu trúc & Chi tiết từng File

### 1. `status-badge.component.ts`
- **Mục đích**: Hiển thị nhãn Badge màu sắc rực rỡ tượng trưng cho các trạng thái của Bài đăng hoặc Phiên đấu giá (`RUNNING`, `PENDING_APPROVAL`, `APPROVED`, `ENDED`, `REJECTED`, `CANCELLED`, `EXPIRED`).
- **Input**: `@Input() status: string = ''`
- **Logic Mapping Color**:
  - `RUNNING`: Nền xanh lá emerald (`bg-emerald-50 text-emerald-700`).
  - `PENDING_APPROVAL` / `PENDING`: Nền hổ phách amber (`bg-amber-50 text-amber-700`).
  - `APPROVED` / `SCHEDULED`: Nền xanh dương blue (`bg-blue-50 text-blue-700`).
  - `ENDED`: Nền xám slate (`bg-slate-100 text-slate-700`).
  - `REJECTED` / `CANCELLED`: Nền đỏ rose (`bg-rose-50 text-rose-700`).
  - `EXPIRED`: Nền tím purple (`bg-purple-50 text-purple-700`).
- **File gọi tới**: `ProductDetailComponent`, `ProductListComponent`, `PendingApprovalComponent`, `HomeComponent`.

---

### 2. `toast-container.component.ts`
- **Mục đích**: Component thả nổi ở góc trên bên phải màn hình (`fixed top-5 right-5 z-50`), tự động render danh sách thông báo Toast thu thập từ `ToastService`.
- **Dependency Injection**: `toastService = inject(ToastService)`.
- **Template Control Flow**: Sử dụng cú pháp Angular Control Flow `@for (toast of toastService.toasts(); track toast.id)` để render danh sách toast kèm animation mượt mà.
- **File gọi tới**: `MainLayoutComponent`, `SellerLayoutComponent`, `AdminLayoutComponent`.
