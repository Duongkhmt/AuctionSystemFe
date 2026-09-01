import { Injectable, inject, computed } from '@angular/core';
import { UserRole, UserSession } from '../../shared/models/enums.model';
import { AuthService } from './auth.service';

/**
 * ====================================================================================
 * 👤 USER SESSION SERVICE (Dịch Vụ Quản Lý Phiên Người Dùng Chuẩn Security)
 * ====================================================================================
 * Khách vãng lai (Guest chưa đăng nhập) ➔ `currentUser()` trả về `null`.
 * Tuyệt đối KHÔNG giả lập User ảo id: 0 gây lỗi gọi API riêng tư trái phép.
 */
@Injectable({
  providedIn: 'root'
})
export class UserSessionService {
  private authService = inject(AuthService);

  currentUser = computed<UserSession | null>(() => {
    return this.authService.currentUser();
  });

  getCurrentUser(): UserSession | null {
    return this.currentUser();
  }

  hasRole(role: UserRole): boolean {
    return this.authService.hasRole(role);
  }
}
