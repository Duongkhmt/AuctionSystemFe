import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/config/api-endpoints.config';
import { ProductRejectRequest, ProductResponse } from '../../../shared/models/product.model';
import { snakeToCamelKeys } from '../../../core/utils/case-converter.util';

export interface CategoryRequest {
  name: string;
  parentId?: number | null;
  active?: boolean;
}

export interface AdminCategoryResponse {
  id: number;
  parentId: number | null;
  name: string;
  active: boolean;
  requiresVerification?: boolean;
  requiresDeposit?: boolean;
}

export type UserStatus = 'ACTIVE' | 'BANNED' | 'LOCKED' | 'SUSPENDED';
export type UserRole = 'ADMIN' | 'USER';

export interface AdminUserResponse {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  unpaidStrikeCount?: number;
  bannedUntil?: string | null;
  createdAt?: string;
}

export interface UserStatusUpdateRequest {
  status: UserStatus;
}

@Injectable({
  providedIn: 'root'
})
export class AdminApiService {
  private http = inject(HttpClient);

  // 1. Product Moderation APIs
  getPendingProducts(): Observable<ProductResponse[]> {
    return this.http.get<any[]>(API_ENDPOINTS.ADMIN_PENDING_PRODUCTS).pipe(
      map((res) => snakeToCamelKeys<ProductResponse[]>(res))
    );
  }

  approveProduct(id: number): Observable<ProductResponse> {
    return this.http.put<any>(API_ENDPOINTS.ADMIN_APPROVE_PRODUCT(id), {}).pipe(
      map((res) => snakeToCamelKeys<ProductResponse>(res))
    );
  }

  rejectProduct(id: number, rejectDTO: ProductRejectRequest): Observable<ProductResponse> {
    return this.http.put<any>(API_ENDPOINTS.ADMIN_REJECT_PRODUCT(id), rejectDTO).pipe(
      map((res) => snakeToCamelKeys<ProductResponse>(res))
    );
  }

  // 2. Category Management APIs
  getAllCategories(): Observable<AdminCategoryResponse[]> {
    return this.http.get<any[]>(API_ENDPOINTS.ADMIN_CATEGORIES).pipe(
      map((res) => snakeToCamelKeys<AdminCategoryResponse[]>(res))
    );
  }

  createCategory(request: CategoryRequest): Observable<AdminCategoryResponse> {
    return this.http.post<any>(API_ENDPOINTS.ADMIN_CATEGORIES, request).pipe(
      map((res) => snakeToCamelKeys<AdminCategoryResponse>(res))
    );
  }

  updateCategory(id: number, request: CategoryRequest): Observable<AdminCategoryResponse> {
    return this.http.put<any>(API_ENDPOINTS.ADMIN_CATEGORY_BY_ID(id), request).pipe(
      map((res) => snakeToCamelKeys<AdminCategoryResponse>(res))
    );
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.ADMIN_CATEGORY_BY_ID(id));
  }

  // 3. User Management APIs
  getAllUsers(): Observable<AdminUserResponse[]> {
    return this.http.get<any[]>(API_ENDPOINTS.ADMIN_USERS).pipe(
      map((res) => snakeToCamelKeys<AdminUserResponse[]>(res))
    );
  }

  updateUserStatus(id: number, request: UserStatusUpdateRequest): Observable<AdminUserResponse> {
    return this.http.put<any>(API_ENDPOINTS.ADMIN_USER_STATUS(id), request).pipe(
      map((res) => snakeToCamelKeys<AdminUserResponse>(res))
    );
  }
}
