# 03. Kiến Trúc Lớp Shared (Shared Layer Architecture)

# Mục đích

Tài liệu này định nghĩa vai trò của thư mục `src/app/shared` - nơi chứa toàn bộ các UI Components vô hướng (Dumb/Presentational Components), Custom Pipes định dạng dữ liệu và các TypeScript Interfaces/Enums được dùng chung rải rác ở các trang nghiệp vụ.

---

# Vì sao phải tồn tại

Nếu không có tầng `shared`:
- Logic định dạng tiền tệ VNĐ (`100.000.000 ₫`), đồng hồ đếm ngược phiên đấu giá (`02:45:12`) sẽ bị lặp lại ở mọi màn hình (`Home`, `ProductDetail`, `PendingApproval`, `ProductList`).
- Trạng thái phiên đấu giá (Status Badge) bị thiết kế không nhất quán về màu sắc và nhãn hiển thị giữa trang Admin và trang Người bán.
- Thiếu tập trung hóa kiểu dữ liệu Models/Enums làm tăng nguy cơ lỗi Runtime type mismatches khi gọi API.

---

# Trách nhiệm (Responsibility)

- **Được phép**:
  - Chứa các Component thuần túy không sở hữu Side-effects (Stateless UI Component).
  - Định nghĩa kiểu dữ liệu Interface/Enum chuẩn từ Backend Spring Boot.
  - Định nghĩa Custom Pipes làm sạch và định dạng dữ liệu đầu ra trên Template.

- **Không được phép**:
  - **KHÔNG ĐƯỢC** inject các Business API Services (`SellerApiService`, `AdminApiService`, `BiddingService`).
  - **KHÔNG ĐƯỢC** import bất kỳ Component hay Route nào từ `features/` hoặc `layout/`.

---

# Cấu trúc hiện tại

```text
src/app/shared/
├── components/
│   ├── status-badge/
│   │   └── status-badge.component.ts      # Component hiển thị Huy hiệu Trạng thái (RUNNING, APPROVED, PENDING...)
│   └── toast-container/
│       └── toast-container.component.ts  # Component khung hiển thị mảng Toast Notifications thả nổi
├── models/
│   ├── bid.model.ts                      # Interfaces DTO cho lượt Bid & Lịch sử Bid
│   ├── enums.model.ts                    # Enums cho ProductStatus, AuctionStatus, AuctionType, UserRole
│   └── product.model.ts                  # Interfaces DTO cho Bài đăng & Sản phẩm đấu giá
└── pipes/
    ├── auction-timer.pipe.ts             # Custom Pipe chuyển đổi EndTime String thành đếm ngược HH:MM:SS
    ├── currency-vnd.pipe.ts              # Custom Pipe định dạng số thành Tiền Việt Nam (vi-VN VND)
    └── mask-name.pipe.ts                 # Custom Pipe ẩn danh tính người đấu giá (Masking Name)
```

---

# Luồng hoạt động

```text
[ Feature Component (ProductDetailComponent) ]
                │
                ├───────────────────────────────┐
                ▼                               ▼
    [ StatusBadgeComponent ]         [ CurrencyVndPipe / AuctionTimerPipe ]
    (Hiển thị Badge màu sắc)        (Định dạng tiền & đồng hồ)
                │                               │
                └───────────────┬───────────────┘
                                ▼
                        [ Rendered DOM UI ]
```

---

# Phân Tích Chi Tiết Chi Nhánh Trong Shared

Để phục vụ lập trình viên đọc chuyên sâu từng nhóm thành phần:

- 📖 [Shared UI Components](file:///home/duong/Projects/Frontend/AuctionSystemUI/documents/frontend/shared/components.md): Giải thích `StatusBadgeComponent` và `ToastContainerComponent`.
- 📖 [Shared Custom Pipes](file:///home/duong/Projects/Frontend/AuctionSystemUI/documents/frontend/shared/pipes.md): Giải thích `AuctionTimerPipe`, `CurrencyVndPipe`, `MaskNamePipe`.
- 📖 [Shared Models & Enums](file:///home/duong/Projects/Frontend/AuctionSystemUI/documents/frontend/shared/models.md): Giải thích `enums.model.ts`, `product.model.ts`, `bid.model.ts`.

---

# Best Practice & Thiết kế kiến trúc

1. **Dumb Components Pattern**: Tất cả Component trong `shared/components/` chỉ nhận đầu vào qua `@Input()` và đẩy ra qua `@Output()` (hoặc inject Service thông báo hạ tầng như `ToastService`), hoàn toàn độc lập với API Backend.
2. **Pure Standalone Pipes**: Tất cả Pipes đều mang cờ `standalone: true` và triển khai `PipeTransform` tinh gọn, giúp tái sử dụng linh hoạt trên mọi Template mà không phải khai báo Module rườm rà.
