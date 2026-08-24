import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../auth/token.service';
import { LanguageService } from '../services/language.service';

/**
 * ====================================================================================
 * 🛡️ API HEADER INTERCEPTOR (Đính Kèm Bearer Token & Accept-Language Header)
 * ====================================================================================
 * Chặn mọi HTTP Request đi từ ứng dụng Angular sang Spring Boot Backend.
 * 1. Tự động đính kèm `Authorization: Bearer <token>` nếu có.
 * 2. Tự động đính kèm `Accept-Language: vi` (hoặc `en`) theo ngôn ngữ người dùng chọn,
 *    giúp Spring Boot `AcceptHeaderLocaleResolver` và `MessageSource` tự động trả về
 *    thông báo lỗi/thành công bằng đúng ngôn ngữ tương ứng!
 */
export const apiHeaderInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const languageService = inject(LanguageService);

  const token = tokenService.getToken();
  const currentLang = languageService.currentLang();

  // Khai báo bộ headers bổ sung
  const headersToAdd: Record<string, string> = {
    'Accept-Language': currentLang
  };

  if (token) {
    headersToAdd['Authorization'] = `Bearer ${token}`;
  }

  // Nhân bản Request và đính kèm Headers
  const cloned = req.clone({
    setHeaders: headersToAdd
  });

  return next(cloned);
};
