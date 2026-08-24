import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    return this.http.get<Category[]>(API_ENDPOINTS.CATEGORIES);
  }
}
