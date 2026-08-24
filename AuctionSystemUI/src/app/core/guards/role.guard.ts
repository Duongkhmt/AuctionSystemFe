import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionService } from '../auth/permission.service';
import { UserRole } from '../../shared/models/enums.model';

/**
 * ====================================================================================
 * 🛡️ ROLE GUARD (Functional Guard Kiểm Tra Phân Quyền Vai Trò Người Dùng)
 * ====================================================================================
 * Chặn truy cập vào các đường dẫn bảo vệ (như `/admin`, `/seller`) nếu tài khoản
 * không sở hữu đúng vai trò quyền hạn yêu cầu (`allowedRoles`).
 * Nếu cố tình gõ link trái phép -> Tự động chuyển hướng về trang chủ công khai `/`.
 * 
 * @param allowedRoles Mảng danh sách các vai trò được phép truy cập (Ví dụ: `['ROLE_ADMIN']`).
 */
export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return (route, state) => {
    const permissionService = inject(PermissionService);
    const router = inject(Router);

    // Kiểm tra tài khoản hiện tại có khớp với 1 trong các vai trò được phép hay không
    const hasPermission = allowedRoles.some((role) => permissionService.hasRole(role));

    // Nếu hợp lệ -> Cho phép đi tiếp
    if (hasPermission) {
      return true;
    }

    // Nếu trái phép -> Tự động đá về Trang chủ Public
    router.navigate(['/']);
    return false;
  };
};
