import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TokenService } from './token.service';
import { UserSessionService } from './user-session.service';
import { UserRole, UserSession } from '../../shared/models/enums.model';

export interface LoginRequest {
  email: string;
  role: UserRole;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenService = inject(TokenService);
  private userSessionService = inject(UserSessionService);

  login(request: LoginRequest): Observable<UserSession> {
    const mockToken = `mock-jwt-token-${Date.now()}`;
    this.tokenService.saveToken(mockToken);

    this.userSessionService.switchToRole(request.role);
    return of(this.userSessionService.getCurrentUser());
  }

  logout(): void {
    this.tokenService.removeToken();
    this.userSessionService.switchToRole('USER');
  }

  isLoggedIn(): boolean {
    return this.tokenService.hasToken();
  }

  getCurrentUser(): UserSession {
    return this.userSessionService.getCurrentUser();
  }
}
