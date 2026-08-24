# Core Sub-module: Core Infrastructure Services

# Mục đích
Chứa các Dịch vụ hạ tầng toàn cục dùng chung phục vụ hiển thị phản hồi người dùng (Toast Notifications), quản lý trạng thái tải trang (Loading Spinner) và nạp danh mục sản phẩm từ DB.

---

# Vì sao phải tồn tại
- Trợ giúp giao diện hiển thị các trạng thái bất đồng bộ (Asynchronous Loading) mượt mà mà không làm giật lắc trang.
- Đưa thông báo Toast thả nổi từ góc màn hình một cách nhất quán (Success, Error, Info, Warning) mà không cần phụ thuộc thư viện bên ngoài quá nặng.

---

# Trách nhiệm (Responsibility)

- **Được phép**:
  - Đăng ký Singleton bằng `@Injectable({ providedIn: 'root' })`.
  - Quản lý trạng thái bằng Angular `signal()` và toán tử `update()`.

- **Không được phép**:
  - Trực tiếp render HTML DOM thủ công (Phải để Component tương ứng render dựa theo Signal state).

---

# Cấu trúc hiện tại

Các file trong `src/app/core/services/`:

```text
src/app/core/services/
├── category.service.ts  # Dịch vụ gọi API nạp danh mục DB
├── loading.service.ts   # Quản lý số lượng HTTP request và bật/tắt Spinner
└── toast.service.ts     # Quản lý danh sách các thông báo Toast thả nổi
```

---

# Phân tích từng file

### 1. `loading.service.ts`
- **Mục đích**: Theo dõi số lượng HTTP Request đang chạy đồng thời (`activeRequests`) và phát Signal `isLoading` ra toàn ứng dụng.
- **Code implementation**:
  ```typescript
  @Injectable({ providedIn: 'root' })
  export class LoadingService {
    isLoading = signal<boolean>(false);
    private activeRequests = 0;

    show(): void {
      this.activeRequests++;
      this.isLoading.set(true);
    }

    hide(): void {
      this.activeRequests = Math.max(0, this.activeRequests - 1);
      if (this.activeRequests === 0) {
        this.isLoading.set(false);
      }
    }
  }
  ```
- **Kỹ thuật chống ẩn nhầm (Race condition)**: Biến đếm `activeRequests` đảm bảo khi có 3 request chạy đồng thời, nếu 1 request xong trước thì Spinner vẫn hiển thị cho đến khi cả 3 request hoàn tất.
- **File gọi tới**: `loading.interceptor.ts`.

---

### 2. `toast.service.ts`
- **Mục đích**: Quản lý mảng danh sách các thông báo Toast nổi (`toasts = signal<ToastMessage[]>([])`) và tự động đếm ngược xóa khỏi màn hình sau 4 giây.
- **Code implementation**:
  ```typescript
  @Injectable({ providedIn: 'root' })
  export class ToastService {
    toasts = signal<ToastMessage[]>([]);
    private counter = 0;

    showSuccess(summary: string, detail: string = ''): void { this.addToast('success', summary, detail); }
    showError(summary: string, detail: string = ''): void { this.addToast('error', summary, detail); }
    showInfo(summary: string, detail: string = ''): void { this.addToast('info', summary, detail); }
    showWarn(summary: string, detail: string = ''): void { this.addToast('warn', summary, detail); }

    remove(id: number): void {
      this.toasts.update((current) => current.filter((t) => t.id !== id));
    }

    private addToast(severity: ToastMessage['severity'], summary: string, detail: string): void {
      const id = ++this.counter;
      const toast: ToastMessage = { id, severity, summary, detail };
      this.toasts.update((current) => [...current, toast]);

      setTimeout(() => { this.remove(id); }, 4000);
    }
  }
  ```
- **File gọi tới**: `error.interceptor.ts`, `CreateProductComponent`, `PendingApprovalComponent`, `ProductDetailComponent`, `ToastContainerComponent`.

---

### 3. `category.service.ts`
- **Mục đích**: Nạp trực tiếp danh sách danh mục từ API Spring Boot (`/v1/categories`).
- **Code implementation**:
  ```typescript
  export interface Category {
    id: number;
    parentId: number | null;
    name: string;
    active: boolean;
    requiresVerification: boolean;
    requiresDeposit: boolean;
  }

  @Injectable({ providedIn: 'root' })
  export class CategoryService {
    private http = inject(HttpClient);

    getCategories(): Observable<Category[]> {
      return this.http.get<Category[]>(API_ENDPOINTS.CATEGORIES);
    }
  }
  ```
- **File gọi tới**: `CreateProductComponent`, `HomeComponent`.

---

# Best Practice & Bài học thiết kế

1. **Active Request Counter Pattern**: Sử dụng biến đếm số lượng HTTP Request đang hoạt động trong `LoadingService` xử lý triệt để hiện tượng Spinner bị nhấp nháy hoặc tắt sớm khi chạy song song nhiều AJAX calls.
2. **Immutable Signal Updates**: Dùng `this.toasts.update(current => [...current, toast])` giúp Angular Signal chủ động báo về UI render lại mảng mới cực kỳ an toàn.
