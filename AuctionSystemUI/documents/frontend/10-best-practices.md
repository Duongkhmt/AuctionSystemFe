# 10. Tiêu Chuẩn Lập Trình & Best Practices (Frontend Coding Guidelines)

# Mục đích

Tài liệu này tổng hợp các tiêu chuẩn lập trình **Best Practices** bắt buộc tuân thủ khi phát triển ứng dụng **AuctionSystemUI** với Angular 18 Enterprise.

---

# Các Tiêu Chuẩn Cốt Lõi

### 1. Sử dụng Signals thay thế cho RxJS BehaviorSubject trong State
- **Quy tắc**: Sử dụng `signal()`, `computed()`, `signal.update()` cho tất cả các trạng thái giao diện nội bộ hoặc trạng thái toàn cục (Toast, Loading, UserSession, Products).
- **Lợi ích**: Giúp Angular bỏ qua cơ chế Change Detection quét cây DOM quá mức, tối ưu hóa hiệu năng render.
- **Mẫu mã nguồn chuẩn**:
  ```typescript
  // Cũ (Tránh dùng):
  private productsSubject = new BehaviorSubject<ProductResponse[]>([]);

  // Mới (Bắt buộc dùng):
  products = signal<ProductResponse[]>([]);
  filteredProducts = computed(() => this.products().filter(...));
  ```

### 2. Ưu tiên Cú Pháp Angular Control Flow Mới (`@if`, `@for`)
- **Quy tắc**: Thay thế hoàn toàn `*ngIf`, `*ngFor` cũ bằng syntax `@if`, `@for`, `@switch` native của Angular 17/18.
- **Mẫu mã nguồn chuẩn**:
  ```html
  @if (loading()) {
    <div class="animate-pulse">...</div>
  } @else {
    @for (product of products(); track product.productId) {
      <app-status-badge [status]="product.auctionStatus" />
    }
  }
  ```

### 3. Tận Dụng Functional APIs (`inject()`, Functional Guards & Interceptors)
- **Quy tắc**: Không inject dependency qua constructor theo phong cách cũ. Sử dụng hàm `inject()` của Angular.
- **Mẫu mã nguồn chuẩn**:
  ```typescript
  export class CreateProductComponent {
    private fb = inject(FormBuilder);
    private sellerService = inject(SellerApiService);
    userSession = inject(UserSessionService);
  }
  ```

### 4. Đảm Bảo Khóa Track Trong `@for` Loop
- **Quy tắc**: Tất cả vòng lặp `@for` bắt buộc phải có thuộc tính `track` trỏ tới Primary Key duy nhất (ví dụ: `track product.productId`, `track cat.id`).

### 5. Luôn Dùng Utility `snakeToCamelKeys` Cho HTTP Responses
- **Quy tắc**: Mọi Observable trả về từ HTTP Client giao tiếp với Spring Boot Backend bắt buộc sử dụng `.pipe(map(res => snakeToCamelKeys(res)))`.
