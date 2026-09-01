import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../auth/auth.service';

/**
 * ====================================================================================
 * ⚠️ ERROR INTERCEPTOR (Functional Interceptor Xử Lý Lỗi HTTP Phản Hồi Toàn Cục)
 * ====================================================================================
 * Bắt tất cả các phản hồi lỗi HTTP từ Spring Boot Backend (401, 409, 429, 400, 403...).
 * Tự động xóa Token hỏng khi gặp lỗi 401 Unauthorized mà KHÔNG BAO GIỜ hiện Toast đỏ khi quay lại trang chủ.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // 1. Xử lý lỗi 401 Unauthorized (Token JWT không hợp lệ hoặc đã hết hạn)
      if (error.status === 401) {
        // Tự động xóa sạch phiên và token hỏng khỏi LocalStorage ngay lập tức
        authService.logout();

        const currentUrl = router.url.split('?')[0];
        // CHỈ hiển thị Toast nếu người dùng đang truy cập trang riêng tư bắt buộc đăng nhập (/seller, /my-bids, /admin)
        if (currentUrl.startsWith('/seller') || currentUrl.startsWith('/my-bids') || currentUrl.startsWith('/admin')) {
          toastService.showError('🔒 Phiên Đăng Nhập Hết Hạn', 'Vui lòng đăng nhập lại để tiếp tục.');
          router.navigate(['/login']);
        }

        // Tuyệt đối không bật Toast đỏ đối với trang chủ hay trang khách vãng lai
        return throwError(() => error);
      }

      let errorMessage = 'Lỗi kết nối máy chủ';
      let toastTitle = 'Cảnh Báo / Lỗi Hệ Thống';

      if (error.status === 409) {
        toastTitle = '⚡ Tranh Chấp Khóa (Redis Lock)';
      } else if (error.status === 429) {
        toastTitle = '⏳ Giới Hạn Tốc Độ (Rate Limit)';
      } else if (error.status === 400) {
        toastTitle = '⚠️ Thông Báo Yêu Cầu';
      } else if (error.status === 403) {
        toastTitle = '🚫 Không Có Quyền Truy Cập';
      }

      // 2. Trích xuất thông báo chuẩn từ ApiResponse của Backend
      if (error.error) {
        if (typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (typeof error.error === 'object') {
          if (error.error.message && typeof error.error.message === 'string') {
            errorMessage = error.error.message;
          } else {
            const values = Object.values(error.error).filter((v) => typeof v === 'string') as string[];
            if (values.length > 0) {
              errorMessage = values.join(', ');
            }
          }
        }
      }

      toastService.showError(toastTitle, errorMessage);
      return throwError(() => error);
    })
  );
};
