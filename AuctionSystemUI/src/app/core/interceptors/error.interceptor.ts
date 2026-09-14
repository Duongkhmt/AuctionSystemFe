import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, switchMap, BehaviorSubject, filter, take } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../auth/auth.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

/**
 * ====================================================================================
 * 🛡️ ERROR INTERCEPTOR (Silent Refresh Token & Concurrent Request Queue)
 * ====================================================================================
 * Chặn các phản hồi lỗi HTTP từ Spring Boot Backend (401, 409, 429, 400, 403...).
 * Khi gặp lỗi 401 Unauthorized (Access Token 10 phút bị hết hạn):
 * 1. Tự động gửi ngầm request POST /v1/auth/refresh kèm Refresh Token (Rotation).
 * 2. Nếu có nhiều HTTP Request đồng thời bị 401 ➔ Các request sau sẽ CHỜ token mới qua BehaviorSubject (KHÔNG BỊ OUT TỰ ĐỘNG).
 * 3. Khi nạp Access Token mới thành công ➔ Tự động Retry tất cả request bị lỗi ban đầu ngầm bên dưới.
 * 4. Nếu Refresh Token thực sự hết hạn (sau 3 ngày không sử dụng) ➔ Mới Đăng xuất an toàn và điều hướng về /login.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // 1. Xử lý lỗi 401 Unauthorized (Access Token hết hạn)
      if (error.status === 401) {
        const isAuthEndpoint =
          req.url.includes('/v1/auth/login') ||
          req.url.includes('/v1/auth/register') ||
          req.url.includes('/v1/auth/refresh');

        const refreshToken = authService.getRefreshToken();

        // Nếu có Refresh Token và request bị lỗi không phải là Auth Endpoint -> Chạy Silent Refresh
        if (refreshToken && !isAuthEndpoint) {
          if (!isRefreshing) {
            isRefreshing = true;
            refreshTokenSubject.next(null);

            return authService.refreshToken().pipe(
              switchMap((authRes) => {
                isRefreshing = false;
                refreshTokenSubject.next(authRes.accessToken);
                // Đã có Access Token mới -> Gắn vào Bearer Header và tự động Retry lại request bị lỗi ban đầu
                const clonedReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${authRes.accessToken}`
                  }
                });
                return next(clonedReq);
              }),
              catchError((refreshErr) => {
                isRefreshing = false;
                refreshTokenSubject.next(null);
                // Nếu Refresh Token thực sự hết hạn hoặc bị hủy -> Đăng xuất và điều hướng
                authService.logout();

                const currentUrl = router.url.split('?')[0];
                if (currentUrl.startsWith('/seller') || currentUrl.startsWith('/my-bids') || currentUrl.startsWith('/admin')) {
                  toastService.showError('🔒 Phiên Đăng Nhập Hết Hạn', 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.');
                  router.navigate(['/login']);
                }
                return throwError(() => refreshErr);
              })
            );
          } else {
            // Hàng chờ: Khi đã có 1 request trước đó đang chạy Refresh Token -> Các request song song tiếp theo sẽ chờ token mới
            return refreshTokenSubject.pipe(
              filter((token) => token !== null),
              take(1),
              switchMap((newToken) => {
                const clonedReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newToken}`
                  }
                });
                return next(clonedReq);
              })
            );
          }
        }

        // Nếu thực sự không có Refresh Token hoặc chính endpoint refresh bị 401 -> Mới Logout
        authService.logout();
        const currentUrl = router.url.split('?')[0];
        if (currentUrl.startsWith('/seller') || currentUrl.startsWith('/my-bids') || currentUrl.startsWith('/admin')) {
          toastService.showError('🔒 Phiên Đăng Nhập Hết Hạn', 'Vui lòng đăng nhập lại để tiếp tục.');
          router.navigate(['/login']);
        }
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

      // 2. Trích xuất thông báo lỗi từ Spring Boot ApiResponse
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

      // 3. Không bắn Toast báo lỗi màn hình đỏ đối với các request kiểm tra ngầm hoặc 404 sản phẩm
      const isSilentCheck = (req.url.includes('/v1/wallets/me') && (error.status === 0 || error.status === 404))
        || (req.url.includes('/v1/products/') && error.status === 404);
      if (!isSilentCheck) {
        toastService.showError(toastTitle, errorMessage);
      }

      return throwError(() => error);
    })
  );
};
