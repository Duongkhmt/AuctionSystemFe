import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { SellerLayoutComponent } from './layout/seller-layout/seller-layout.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
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
        loadChildren: () => import('./features/bidder-portal/bidder-portal.routes').then((m) => m.BIDDER_PORTAL_ROUTES)
      }
    ]
  },
  {
    path: 'seller',
    component: SellerLayoutComponent,
    canActivate: [roleGuard(['USER', 'ADMIN'])],
    loadChildren: () => import('./features/seller-studio/seller.routes').then((m) => m.SELLER_ROUTES)
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [roleGuard(['ADMIN'])],
    loadChildren: () => import('./features/admin-moderation/admin.routes').then((m) => m.ADMIN_ROUTES)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
