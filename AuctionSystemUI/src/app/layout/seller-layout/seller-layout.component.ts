import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserSessionService } from '../../core/auth/user-session.service';
import { ToastContainerComponent } from '../../shared/components/toast-container/toast-container.component';

@Component({
  selector: 'app-seller-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ToastContainerComponent],
  template: `
    <div class="min-h-screen flex bg-slate-950 text-slate-100 font-sans antialiased">
      <app-toast-container />

      <!-- Sidebar -->
      <aside class="w-64 border-r border-slate-800 bg-slate-900/80 p-5 flex flex-col justify-between">
        <div>
          <a routerLink="/" class="flex items-center gap-2 text-lg font-black text-white mb-8">
            <span class="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-sm">🏪</span>
            <span>Seller Studio</span>
          </a>

          <nav class="space-y-1.5 text-sm font-medium">
            <a routerLink="/seller" routerLinkActive="bg-indigo-600/20 text-indigo-400 border-l-2 border-indigo-500" [routerLinkActiveOptions]="{exact: true}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">
              📋 Danh sách sản phẩm
            </a>
            <a routerLink="/seller/orders" routerLinkActive="bg-indigo-600/20 text-indigo-400 border-l-2 border-indigo-500" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">
              📦 Đơn hàng đã bán
            </a>
            <a routerLink="/seller/create" routerLinkActive="bg-indigo-600/20 text-indigo-400 border-l-2 border-indigo-500" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">
              ➕ Tạo bài đăng mới
            </a>
          </nav>
        </div>

        <!-- Seller Profile Info -->
        <div class="pt-4 border-t border-slate-800 flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-indigo-600/20 text-indigo-400 font-bold flex items-center justify-center text-xs">
            S2
          </div>
          <div>
            <p class="text-xs font-semibold text-white">{{ userSession.currentUser()?.name || 'Khách' }}</p>
            <p class="text-[10px] text-slate-400">Seller ID: {{ userSession.currentUser()?.id || 0 }}</p>
          </div>
        </div>
      </aside>

      <!-- Content Area -->
      <div class="flex-1 flex flex-col">
        <header class="border-b border-slate-800 bg-slate-900/40 px-8 py-4 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-slate-300">Kênh Quản Lý Dành Cho Người Bán</h2>
          <a routerLink="/" class="text-xs text-indigo-400 hover:underline">← Về Sàn Đấu Giá Public</a>
        </header>

        <main class="flex-1 p-8">
          <router-outlet />
        </main>
      </div>
    </div>
  `
})
export class SellerLayoutComponent {
  userSession = inject(UserSessionService);
}
