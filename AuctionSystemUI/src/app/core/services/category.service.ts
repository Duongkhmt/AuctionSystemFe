import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_ENDPOINTS } from '../config/api-endpoints.config';

export interface Category {
  id: number;
  parentId: number | null;
  name: string;
  active: boolean;
  requiresVerification: boolean;
  requiresDeposit: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);

  getCategories(): Observable<Category[]> {
    return this.http.get<any[]>(API_ENDPOINTS.CATEGORIES).pipe(
      map((res) =>
        (res || []).map((item) => ({
          id: item.id,
          parentId: item.parent_id !== undefined ? item.parent_id : item.parentId ?? null,
          name: item.name,
          active: item.active !== undefined ? item.active : (item.is_active ?? true),
          requiresVerification: item.requires_verification !== undefined ? item.requires_verification : (item.requiresVerification ?? false),
          requiresDeposit: item.requires_deposit !== undefined ? item.requires_deposit : (item.requiresDeposit ?? false)
        }))
      )
    );
  }
}
