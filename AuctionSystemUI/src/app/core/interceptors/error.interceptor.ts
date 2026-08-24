import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

/**
 * ====================================================================================
 * ⚠️ ERROR INTERCEPTOR (Functional Interceptor Xử Lý Lỗi HTTP Phản Hồi Toàn Cục)
 * ====================================================================================
 * Bắt tất cả các phản hồi lỗi HTTP trả về từ Backend (HTTP Status 400, 403, 404, 500...).
 * Giải mã chuỗi thông báo lỗi tiếng Việt thân thiện từ JSON Backend và hiển thị Toast màu đỏ
 * ở góc màn hình mà không bắt từng Component phải tự try-catch viết lại thông báo lỗi.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Lỗi kết nối máy chủ';
      let toastTitle = 'Cảnh Báo / Lỗi Hệ Thống';

      // Phân loại nhãn Toast trực quan dựa theo Mã Phản Hồi Redis / Redisson Lock
      if (error.status === 409) {
        toastTitle = '⚡ Tranh Chấp Khóa (Redis Lock)';
      } else if (error.status === 429) {
        toastTitle = '⏳ Giới Hạn Tốc Độ (Rate Limit)';
      } else if (error.status === 400) {
        toastTitle = '⚠️ Yêu Cầu Không Hợp Lệ';
      } else if (error.status === 403) {
        toastTitle = '🚫 Không Có Quyền Truy Cập';
      }

      // Giải mã cấu trúc JSON lỗi trả về từ Spring Boot Custom Exception ApiResponse
      if (error.error) {
        if (typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.error.message) {
          errorMessage = error.error.message;
        } else if (typeof error.error === 'object') {
          const values = Object.values(error.error).filter((v) => typeof v === 'string');
          if (values.length > 0) {
            errorMessage = values.join(', ');
          }
        }
      }

      // Đẩy Toast thông báo lỗi lên màn hình cho người dùng biết
      toastService.showError(toastTitle, errorMessage);
      return throwError(() => error);
    })
  );
};
