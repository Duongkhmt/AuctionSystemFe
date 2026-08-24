# Kiến Trúc Frontend - AuctionSystemUI (Angular 18 Enterprise)

Tài liệu này được biên soạn bởi **Technical Lead** nhằm phục vụ làm tài liệu **Onboarding & Architecture Documentation** chính thức dành cho các lập trình viên mới gia nhập phát triển hệ thống Frontend của **AuctionSystemUI**.

Hệ thống được xây dựng trên nền tảng **Angular 18** ứng dụng các chuẩn kiến trúc hiện đại nhất: **Standalone Components**, **Signals State Management**, **Functional Interceptors/Guards**, và **Modular Feature Architecture**.

---

# Lộ Trình Đọc Tài Liệu Chi Tiết (Recommended Onboarding Path)

Vui lòng đọc tài liệu theo đúng thứ tự được đề xuất dưới đây để nắm bắt kiến trúc hệ thống một cách hệ thống nhất:

| Thứ tự | Tên tài liệu | Nội dung chính |
| :---: | :--- | :--- |
| **01** | [01-project-overview.md](file:///home/duong/Projects/Frontend/AuctionSystemUI/documents/frontend/01-project-overview.md) | Tổng quan hệ thống, Stack công nghệ, Cấu trúc thư mục chuẩn. |
| **02** | [02-core.md](file:///home/duong/Projects/Frontend/AuctionSystemUI/documents/frontend/02-core.md) | Khám phá lớp Core: Auth, Interceptors, Guards, Services toàn cục. |
| **03** | [03-shared.md](file:///home/duong/Projects/Frontend/AuctionSystemUI/documents/frontend/03-shared.md) | Thành phần dùng chung: Custom Pipes, Shared Components, Enums & Models. |
| **04** | [04-layout.md](file:///home/duong/Projects/Frontend/AuctionSystemUI/documents/frontend/04-layout.md) | Các bộ khung Layout chính (MainLayout, SellerLayout, AdminLayout). |
| **05** | [05-features.md](file:///home/duong/Projects/Frontend/AuctionSystemUI/documents/frontend/05-features.md) | Các Module nghiệp vụ (Marketplace, SellerStudio, AdminModeration, BidderPortal). |
| **06** | [06-routing.md](file:///home/duong/Projects/Frontend/AuctionSystemUI/documents/frontend/06-routing.md) | Cơ chế điều hướng Lazy Loading, Route Guard protection. |
| **07** | [07-authentication.md](file:///home/duong/Projects/Frontend/AuctionSystemUI/documents/frontend/07-authentication.md) | Mô hình Authentication, User Session Signal & Role Tester Mode. |
| **08** | [08-api-flow.md](file:///home/duong/Projects/Frontend/AuctionSystemUI/documents/frontend/08-api-flow.md) | Luồng tích hợp REST API end-to-end (Snake_case ↔ CamelCase, Error handling). |
| **09** | [09-dependency-rule.md](file:///home/duong/Projects/Frontend/AuctionSystemUI/documents/frontend/09-dependency-rule.md) | Quy tắc phụ thuộc 1 chiều (Core ← Shared ← Features/Layout). |
| **10** | [10-best-practices.md](file:///home/duong/Projects/Frontend/AuctionSystemUI/documents/frontend/10-best-practices.md) | Chuẩn viết code Angular 18 (Signals, Functional APIs, Performance). |
| **11** | [11-common-mistakes.md](file:///home/duong/Projects/Frontend/AuctionSystemUI/documents/frontend/11-common-mistakes.md) | Tổng hợp các lỗi phổ biến cần tránh khi code dự án này. |
| **12** | [12-post-auction-workflow.md](file:///home/duong/Projects/Frontend/AuctionSystemUI/documents/frontend/12-post-auction-workflow.md) | **Tài liệu nghiệp vụ giai đoạn tiếp theo: Xử lý thắng đấu giá, Tạo đơn hàng, Thanh toán & Giao hàng.** |
| **13** | [architecture-diagrams.md](file:///home/duong/Projects/Frontend/AuctionSystemUI/documents/frontend/architecture-diagrams.md) | Sơ đồ ASCII tổng quan về luồng dữ liệu và quan hệ giữa các module. |

---

# Sơ Đồ Tổng Quan Hệ Thống (High-Level Architecture)

```text
[ Browser / User Interaction ]
              │
              ▼
    [ App Configuration ] (app.config.ts / app.routes.ts)
              │
              ▼
   [ Functional Guards ] (auth.guard.ts / role.guard.ts)
              │
              ▼
  [ Layouts & Standalone Pages ] (MainLayout, SellerStudio, AdminModeration)
              │
              ▼
 [ Business Services / Signals ] (PublicMarketplaceService, SellerApiService)
              │
              ▼
 [ Functional Interceptors ] (apiHeaderInterceptor, errorInterceptor)
              │
              ▼
[ Spring Boot REST API Backend ] (http://localhost:8080/v1)
```

---

# Tài Liệu Bổ Sung Theo Phân Vùng

Ngoài ra, bạn có thể xem nhanh các tài liệu chuyên sâu theo từng thư mục cụ thể:

- 📂 [Core Module Documentation](file:///home/duong/Projects/Frontend/AuctionSystemUI/documents/frontend/core/README.md)
- 📂 [Shared Module Documentation](file:///home/duong/Projects/Frontend/AuctionSystemUI/documents/frontend/shared/README.md)
- 📂 [Features Module Documentation](file:///home/duong/Projects/Frontend/AuctionSystemUI/documents/frontend/features/README.md)
