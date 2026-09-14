import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map, throwError } from 'rxjs';
import { API_ENDPOINTS } from '../config/api-endpoints.config';
import { UserSession, UserRole } from '../../shared/models/enums.model';
import { snakeToCamelKeys, camelToSnakeKeys } from '../utils/case-converter.util';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  username: string;
  role: string;
  id?: number;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  private readonly ACCESS_TOKEN_KEY = 'jwt_access_token';
  private readonly REFRESH_TOKEN_KEY = 'jwt_refresh_token';
  private readonly USER_KEY = 'active_user_session';

  currentUser = signal<UserSession | null>(this.loadStoredUser());
  isLoggedIn = computed(() => !!this.currentUser());

  private loadStoredUser(): UserSession | null {
    const saved = localStorage.getItem(this.USER_KEY);
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }

  private normalizeRole(role: string): UserRole {
    if (role === 'ADMIN' || role === 'ROLE_ADMIN') return 'ADMIN';
    return 'USER';
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<any>(API_ENDPOINTS.AUTH_LOGIN, credentials).pipe(
      tap((res) => {
        const camelRes = snakeToCamelKeys<AuthResponse>(res);
        this.saveAuthSession(camelRes, credentials.email);
      })
    );
  }

  register(data: { email: string; password: string; username: string }): Observable<AuthResponse> {
    return this.http.post<any>(API_ENDPOINTS.AUTH_REGISTER, data).pipe(
      tap((res) => {
        const camelRes = snakeToCamelKeys<AuthResponse>(res);
        this.saveAuthSession(camelRes, data.email);
      })
    );
  }

  refreshToken(): Observable<AuthResponse> {
    const token = this.getRefreshToken();
    if (!token) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<any>(API_ENDPOINTS.AUTH_REFRESH, camelToSnakeKeys({ refreshToken: token })).pipe(
      map((res) => snakeToCamelKeys<AuthResponse>(res)),
      tap((camelRes) => {
        if (camelRes.accessToken) {
          localStorage.setItem(this.ACCESS_TOKEN_KEY, camelRes.accessToken);
        }
        if (camelRes.refreshToken) {
          localStorage.setItem(this.REFRESH_TOKEN_KEY, camelRes.refreshToken);
        }

        const existingUser = this.currentUser() || this.loadStoredUser();
        const updatedUser: UserSession = {
          id: existingUser?.id || (camelRes.username?.toLowerCase().includes('admin') ? 1 : 4),
          name: camelRes.username || existingUser?.name || 'User',
          email: existingUser?.email || '',
          role: this.normalizeRole(camelRes.role || existingUser?.role || 'USER'),
          accessToken: camelRes.accessToken,
          refreshToken: camelRes.refreshToken
        };

        localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
        this.currentUser.set(updatedUser);
      })
    );
  }

  logout(notifyServer: boolean = false): void {
    if (notifyServer) {
      const token = this.getAccessToken();
      if (token) {
        this.http.post(API_ENDPOINTS.AUTH_LOGOUT, {}).subscribe({
          error: () => {}
        });
      }
    }
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
  }

  private saveAuthSession(res: AuthResponse, email: string): void {
    if (res.accessToken) localStorage.setItem(this.ACCESS_TOKEN_KEY, res.accessToken);
    if (res.refreshToken) localStorage.setItem(this.REFRESH_TOKEN_KEY, res.refreshToken);

    let userId = res.id || 4; 
    if (res.username && (res.username.toLowerCase().includes('admin') || res.role === 'ADMIN')) userId = 1;
    else if (res.username && res.username.toLowerCase().includes('truc')) userId = 2;

    const userSession: UserSession = {
      id: userId,
      name: res.username || email.split('@')[0],
      email: email,
      role: this.normalizeRole(res.role || 'USER'),
      accessToken: res.accessToken,
      refreshToken: res.refreshToken
    };

    localStorage.setItem(this.USER_KEY, JSON.stringify(userSession));
    this.currentUser.set(userSession);
  }

  getCurrentUser(): UserSession | null {
    return this.currentUser();
  }

  hasRole(role: UserRole): boolean {
    const user = this.currentUser();
    return !!user && user.role === role;
  }
}
