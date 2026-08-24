# Core Sub-module: Functional HTTP Interceptors

# Mục đích
Can thiệp và xử lý tập trung mọi HTTP Request đi ra và HTTP Response đi vào ứng dụng Angular.

---

# Vì sao phải tồn tại
Nếu không có Interceptors:
- Mỗi Service API sẽ phải tự viết mã gắn Authorization Header `Bearer <token>`.
- Khi server trả về lỗi (401, 403, 500), mỗi màn hình phải tự `catchError` và hiển thị thông báo lỗi riêng gây không nhất quán.
- Không thể tự động bật/tắt thanh Loading Spinner trên toàn hệ thống mỗi khi gửi AJAX request.

---

# Trách nhiệm (Responsibility)

- **Được phép**:
  - Clone request và bổ sung Headers (Ví dụ: Bearer Token).
  - Lắng nghe sự kiện bắt đầu và kết thúc của HTTP Request để trigger `LoadingService`.
  - Bắt HTTP Error Response và chuyển sang `ToastService` để cảnh báo cho người dùng.

- **Không được phép**:
  - Thay đổi dữ liệu Response Body trái với cấu trúc mà Backend định nghĩa.
  - Tạo vòng lặp vô tận (Infinite loop) khi gọi HTTP request bên trong Interceptor.

---

# Cấu trúc hiện tại

Các file trong `src/app/core/interceptors/`:

```text
src/app/core/interceptors/
├── api-header.interceptor.ts  # Tự động thêm Authorization Bearer Header
├── error.interceptor.ts       # Bắt lỗi HTTP & phát thông báo Toast Error
└── loading.interceptor.ts     # Bật/tắt thanh Loading toàn cục qua LoadingService
```

---

# Luồng hoạt động & Thứ tự thực thi (Execution Pipeline)

Chuỗi Interceptor được đăng ký tại `app.config.ts`:

```text
HttpClient.get / post
        │
        ▼
[ 1. apiHeaderInterceptor ] ──► Gắn Header Authorization: Bearer <token>
        │
        ▼
[ 2. errorInterceptor ]     ──► Bắt đầu chuẩn bị catchError listener
        │
        ▼
[ 3. loadingInterceptor ]   ──► Gọi LoadingService.show()
        │
        ▼
[ Send to Backend Server ]
        │
        ▼
[ Backend Response ]
        │
        ├───────────────────────────────┐
        ▼ (Nếu lỗi)                     ▼ (Nếu thành công)
[ errorInterceptor.catchError ]   [ loadingInterceptor.finalize ]
 ➔ ToastService.showError          ➔ LoadingService.hide()
```

---

# Phân tích từng file

### 1. `api-header.interceptor.ts`
- **Mục đích**: Tự động lấy JWT Token từ `TokenService` và gắn vào Header `Authorization: Bearer <token>` nếu có token.
- **Code implementation**:
  ```typescript
  export const apiHeaderInterceptor: HttpInterceptorFn = (req, next) => {
    const tokenService = inject(TokenService);
    const token = tokenService.getToken();

    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next(cloned);
    }
    return next(req);
  };
  ```
- **File gọi tới**: Đăng ký trong `app.config.ts`.

---

### 2. `errorInterceptor.ts`
- **Mục đích**: Bắt mọi ngoại lệ `HttpErrorResponse` từ server (500 Internal Error, 400 Bad Request, 404 Not Found...) và hiển thị thông tin lỗi lên màn hình qua `ToastService`.
- **Code implementation**:
  ```typescript
  export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const toastService = inject(ToastService);

    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Lỗi kết nối máy chủ';
        if (error.error) {
          if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error.message) {
            errorMessage = error.error.message;
          }
        }
        toastService.showError('Lỗi Hệ Thống', errorMessage);
        return throwError(() => error);
      })
    );
  };
  ```
- **File gọi tới**: Đăng ký trong `app.config.ts`.

---

### 3. `loading.interceptor.ts`
- **Mục đích**: Bật trạng thái `LoadingService.show()` khi request vừa xuất phát và đảm bảo `LoadingService.hide()` luôn được gọi trong toán tử `finalize()` khi request kết thúc (dù thành công hay thất bại).
- **Code implementation**:
  ```typescript
  export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
    const loadingService = inject(LoadingService);
    loadingService.show();

    return next(req).pipe(
      finalize(() => {
        loadingService.hide();
      })
    );
  };
  ```
- **File gọi tới**: Đăng ký trong `app.config.ts`.

---

# Best Practice & Bài học thiết kế

1. **Angular 18 Functional Interceptors**:
   - Sử dụng `HttpInterceptorFn` thay thế cho class `implements HttpInterceptor` truyền thống giúp mã nguồn nhẹ hơn 50% và không cần đăng ký vào Provider kiểu `{ provide: HTTP_INTERCEPTORS, useClass: ... }`.
2. **Thứ tự đăng ký trong `app.config.ts`**:
   - Rất quan trọng! `apiHeaderInterceptor` phải đứng trước `errorInterceptor` để đảm bảo thông tin Header được gắn xong xuôi trước khi qua các pipeline theo dõi đằng sau.
