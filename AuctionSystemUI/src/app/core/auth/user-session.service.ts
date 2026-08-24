import { Injectable, signal } from '@angular/core';
import { UserRole, UserSession } from '../../shared/models/enums.model';

/**
 * ====================================================================================
 * 🔑 TEST_USERS (Danh Sách Tài Khoản Mẫu Tương Thích Cơ Sở Dữ Liệu PostgreSQL)
 * ====================================================================================
 * Các tài khoản tương thích với DB PostgreSQL (`users` table):
 * - Admin System (ID 1 - ADMIN)
 * - Thanh Trúc (ID 2 - USER)
 * - T Dương (ID 3 - USER)
 * - Hoàng Minh (ID 4 - USER)
 * - Khánh Linh (ID 5 - USER)
 * - Quốc Anh (ID 6 - USER)
 */
export const TEST_USERS: Record<string, UserSession> = {
  ADMIN: { id: 1, name: 'Admin System', email: 'admin123@gmail.com', role: 'ADMIN' },
  SELLER: { id: 2, name: 'Thanh Trúc', email: 'ttruc00@gmail.com', role: 'USER' },
  BIDDER_DUONG: { id: 3, name: 'T Dương', email: 'TDuong04@gmail.com', role: 'USER' },
  BIDDER_HOANG_MINH: { id: 4, name: 'Hoàng Minh', email: 'hoangminh.auction@gmail.com', role: 'USER' },
  BIDDER_KHANH_LINH: { id: 5, name: 'Khánh Linh', email: 'khanhlinh.bidder@gmail.com', role: 'USER' },
  BIDDER_QUOC_ANH: { id: 6, name: 'Quốc Anh', email: 'quocanh.trader@gmail.com', role: 'USER' }
};

@Injectable({
  providedIn: 'root'
})
export class UserSessionService {
  private readonly SESSION_KEY = 'active_user_session';
  
  currentUser = signal<UserSession>(this.loadInitialSession());

  private normalizeRole(role: string): UserRole {
    if (role === 'ADMIN' || role === 'ROLE_ADMIN') return 'ADMIN';
    return 'USER';
  }

  private loadInitialSession(): UserSession {
    const saved = localStorage.getItem(this.SESSION_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) {
          parsed.role = this.normalizeRole(parsed.role);
          return parsed;
        }
      } catch (e) {
        // Ignore invalid JSON
      }
    }
    return TEST_USERS['BIDDER_HOANG_MINH'];
  }

  setSession(session: UserSession): void {
    const normalized = { ...session, role: this.normalizeRole(session.role) };
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(normalized));
    this.currentUser.set(normalized);
  }

  switchToRole(role: UserRole): void {
    switch (role) {
      case 'ADMIN':
        this.setSession(TEST_USERS['ADMIN']);
        break;
      case 'USER':
      default:
        this.setSession(TEST_USERS['BIDDER_HOANG_MINH']);
        break;
    }
  }

  switchToUser(user: UserSession): void {
    this.setSession(user);
  }

  getCurrentUser(): UserSession {
    return this.currentUser();
  }

  hasRole(role: UserRole): boolean {
    const currentRole = this.currentUser().role;
    return this.normalizeRole(currentRole) === this.normalizeRole(role);
  }
}
