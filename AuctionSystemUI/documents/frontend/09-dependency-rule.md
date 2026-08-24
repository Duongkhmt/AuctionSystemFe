# 09. Quy Tắc Phụ Thuộc (Dependency Rules & Boundaries)

# Mục đích

Tài liệu này quy định nghiêm ngặt các ranh giới phụ thuộc (Architectural Boundaries) giữa các tầng thư mục trong **AuctionSystemUI** nhằm duy trì kiến trúc sạch (Clean Architecture) và ngăn chặn việc lặp mã nguồn hoặc tạo phụ thuộc vòng (Circular Dependencies).

---

# Sơ Đồ Quy Tắc Phụ Thuộc 1 Chiều (Unidirectional Dependency Flow)

```text
       ┌───────────────────────────────┐
       │         Core Layer            │ ◄── Tầng thấp nhất (Hạ tầng, Auth, Config)
       └───────────────▲───────────────┘
                       │ (Import)
       ┌───────────────┴───────────────┐
       │        Shared Layer           │ ◄── Tầng dùng chung (UI Components, Pipes, Models)
       └───────────────▲───────────────┘
                       │ (Import)
       ┌───────────────┴───────────────┐
       │     Layout / Features Layer   │ ◄── Tầng nghiệp vụ & Giao diện người dùng
       └───────────────────────────────┘
```

---

# Bảng Quy Tắc Phụ Thuộc Chi Tiết

| Tầng hiện tại | ĐƯỢC PHÉP Import từ | KHÔNG ĐƯỢC PHÉP Import từ | Lý do |
| :--- | :--- | :--- | :--- |
| `core/` | Chỉ import các thư viện npm ngoài, Angular core, RxJS. | `shared/`, `layout/`, `features/` | Core là hạ tầng gốc. Nếu import ngược sẽ gây Circular Dependency và vỡ kiến trúc Singleton. |
| `shared/` | `core/`, Angular core, npm. | `layout/`, `features/` | Shared chứa các Presentational UI & Pipes dùng chung. Không được biết thông tin của các tính năng cụ thể. |
| `layout/` | `core/`, `shared/`, Angular core. | `features/` | Layout là khung bọc ứng dụng, chỉ chứa các router-outlets và UI chung. |
| `features/` | `core/`, `shared/`, `layout/`, Angular core. | Không import cross-feature (Ví dụ: `seller-studio` không import `admin-moderation`). | Giữ cho từng Feature hoàn toàn độc lập để phục vụ Lazy Loading. |

---

# Công Cụ Kiểm Tra Lỗi Phụ Thuộc Vòng (Circular Dependency Check)

Để phát hiện sớm lỗi phụ thuộc vòng khi phát triển code mới, lập trình viên chạy lệnh biên dịch kiểm tra:

```bash
npx ng build --configuration production
```
Nếu có bất kỳ phụ thuộc vòng nào giữa các file, Angular Build Engine sẽ lập tức cảnh báo `Circular dependency detected` trong terminal log.
