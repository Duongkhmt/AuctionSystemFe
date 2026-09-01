import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { roleGuard } from './core/guards/role.guard';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES)
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/public-marketplace/public-marketplace.routes').then((m) => m.PUBLIC_MARKETPLACE_ROUTES)
      },
      {
        path: 'my-bids',
        canActivate: [authGuard, roleGuard(['USER'])],
        loadChildren: () => import('./features/bidder-portal/bidder-portal.routes').then((m) => m.BIDDER_PORTAL_ROUTES)
      },
      {
        path: 'seller',
        canActivate: [authGuard, roleGuard(['USER', 'ADMIN'])],
        loadChildren: () => import('./features/seller-studio/seller.routes').then((m) => m.SELLER_ROUTES)
      }
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard, roleGuard(['ADMIN'])],
    loadChildren: () => import('./features/admin-moderation/admin.routes').then((m) => m.ADMIN_ROUTES)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
