import { Injectable, inject } from '@angular/core';
import { UserSessionService } from './user-session.service';
import { UserRole } from '../../shared/models/enums.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private userSession = inject(UserSessionService);

  hasRole(role: UserRole): boolean {
    return this.userSession.hasRole(role);
  }

  canCreateProduct(): boolean {
    return this.hasRole('USER') || this.hasRole('ADMIN');
  }

  canModerateProduct(): boolean {
    return this.hasRole('ADMIN');
  }

  canPlaceBid(): boolean {
    return this.hasRole('USER') || this.hasRole('ADMIN');
  }
}
