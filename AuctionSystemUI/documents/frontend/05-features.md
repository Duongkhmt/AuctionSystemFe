# 05. Kiến Trúc Các Module Nghiệp Vụ (Features Layer Architecture)

# Mục đích

Tài liệu này tổng quan kiến trúc tầng **Features** (`src/app/features`) - vùng chứa 100% logic nghiệp vụ sản phẩm, sàn đấu giá trực tuyến, phân quyền giao diện và tích hợp REST API theo 4 miền phân định (Public Marketplace, Bidder Portal, Seller Studio, Admin Moderation).

---

# Vì sao phải tồn tại

Nếu không phân chia theo Feature-Driven Architecture:
- Mã nguồn của các tính năng hoàn toàn khác nhau (ví dụ: Trang Duyệt Bài Admin và Trang Đặt Giá Bidder) sẽ nằm chung một thư mục, gây hỗn loạn khi dự án phát triển lớn.
- Không thể áp dụng chiến lược **Lazy Loading** độc lập cho từng nhóm chức năng, làm chậm tốc độ tải trang ban đầu (High First Contentful Paint).
- Dịch vụ gọi API của Admin và Seller bị trộn lẫn làm tăng rủi ro rò rỉ chức năng.

---

# Trách nhiệm (Responsibility)

- **Được phép**:
  - Sở hữu các trang giao diện riêng biệt (Pages Components), các dịch vụ gọi API tương ứng (`*ApiService`).
  - Định nghĩa các file Route con (`*.routes.ts`) để đăng ký Lazy Loading.
  - Sử dụng các Components, Pipes, Models từ `shared/` và `core/`.

- **Không được phép**:
  - **KHÔNG ĐƯỢC** để 2 Feature Module gọi chéo mã nguồn trang của nhau (Ví dụ: `SellerStudio` không được import trực tiếp `PendingApprovalComponent` từ `AdminModeration`).

---

# Cấu trúc hiện tại

```text
src/app/features/
├── auth/                 # Trang Đăng nhập & Xác thực người dùng
├── public-marketplace/   # Sàn đấu giá công khai (Home & Chi tiết sản phẩm đấu giá)
├── bidder-portal/        # Trang xem Lịch sử nhảy giá & Bảng theo dõi của Bidder
├── seller-studio/        # Kênh Người Bán (Đăng bài mới, Xem danh sách, Hủy/Đăng lại phiên)
└── admin-moderation/     # Trung tâm kiểm duyệt bài chờ đăng của Ban Quản Trị
```

---

# Luồng hoạt động

```text
[ User Route Trigger ]
          │
          ├─────────────────────────┼─────────────────────────┐
          ▼                         ▼                         ▼
[ Public Marketplace ]      [ Seller Studio ]       [ Admin Moderation ]
(Home / Product Detail)     (List / Create)         (Pending Approval)
          │                         │                         │
          ▼                         ▼                         ▼
[ MarketplaceService ]     [ SellerApiService ]     [ AdminApiService ]
          │                         │                         │
          └─────────────────────────┼─────────────────────────┘
                                    ▼
                         [ Spring Boot Backend ]
```

---

# Phân Tích Chi Tiết Chi Nhánh Trong Features

Để lập trình viên tìm hiểu từng phân vùng nghiệp vụ cụ thể:

- 📖 [Public Marketplace Feature](file:///home/duong/Projects/Frontend/AuctionSystemUI/documents/frontend/features/public-marketplace.md)
- 📖 [Bidder Portal Feature](file:///home/duong/Projects/Frontend/AuctionSystemUI/documents/frontend/features/bidder-portal.md)
- 📖 [Seller Studio Feature](file:///home/duong/Projects/Frontend/AuctionSystemUI/documents/frontend/features/seller-studio.md)
- 📖 [Admin Moderation Feature](file:///home/duong/Projects/Frontend/AuctionSystemUI/documents/frontend/features/admin-moderation.md)
- 📖 [Auth Feature](file:///home/duong/Projects/Frontend/AuctionSystemUI/documents/frontend/features/auth-feature.md)

---

# Best Practice & Thiết kế kiến trúc

1. **Feature Encapsulation**: Mỗi feature giữ độc lập các file Routes, Pages, Services của chính nó.
2. **Standardized API Transformation**: Tất cả các `*Service` thuộc feature đều dùng `snakeToCamelKeys` để chuẩn hóa mảng dữ liệu DTO trước khi đẩy lên Component render.
