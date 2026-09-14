import { Routes } from '@angular/router';
import { PendingApprovalComponent } from './pages/pending-approval/pending-approval.component';
import { CategoryManagementComponent } from './pages/category-management/category-management.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { FinancialDashboardComponent } from './pages/financial-dashboard/financial-dashboard.component';

export const ADMIN_ROUTES: Routes = [
  { path: '', component: PendingApprovalComponent },
  { path: 'finance', component: FinancialDashboardComponent },
  { path: 'categories', component: CategoryManagementComponent },
  { path: 'users', component: UserManagementComponent }
];
