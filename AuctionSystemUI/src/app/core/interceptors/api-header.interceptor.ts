import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { LanguageService } from '../services/language.service';

/**
 * ====================================================================================
 * 🛡️ API HEADER INTERCEPTOR (Đính Kèm Bearer JWT Token & Accept-Language Header)
 * ====================================================================================
 * Chặn mọi HTTP Request đi từ ứng dụng Angular sang Spring Boot Backend.
 * 1. Tự động đính kèm `Authorization: Bearer <jwt_access_token>` NẾU VÀ CHỈ NẾU người dùng đã đăng nhập hợp lệ.
 * 2. Tự động đính kèm `Accept-Language: vi` (hoặc `en`) theo ngôn ngữ người dùng chọn.
 */
export const apiHeaderInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const languageService = inject(LanguageService);

  const token = authService.getAccessToken();
  const currentLang = languageService.currentLang();

  const headersToAdd: Record<string, string> = {
    'Accept-Language': currentLang
  };

  // Gắn Authorization Header khi có access token hợp lệ trong localStorage
  if (token && token !== 'undefined' && token !== 'null') {
    headersToAdd['Authorization'] = `Bearer ${token}`;
  }

  const cloned = req.clone({
    setHeaders: headersToAdd
  });

  return next(cloned);
};
