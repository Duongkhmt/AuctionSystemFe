import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserSessionService } from '../../core/auth/user-session.service';
import { ToastContainerComponent } from '../../shared/components/toast-container/toast-container.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ToastContainerComponent],
  template: `
    <div class="min-h-screen flex bg-slate-950 text-slate-100 font-sans antialiased">
      <app-toast-container />

      <!-- Sidebar -->
      <aside class="w-64 border-r border-slate-800 bg-slate-900/80 p-5 flex flex-col justify-between">
        <div>
          <a routerLink="/" class="flex items-center gap-2 text-lg font-black text-white mb-8">
            <span class="w-7 h-7 rounded-lg bg-rose-600 flex items-center justify-center text-white text-sm">🛡</span>
            <span>Admin Moderation</span>
          </a>

          <nav class="space-y-1.5 text-sm font-medium">
            <a routerLink="/admin" routerLinkActive="bg-rose-600/20 text-rose-400 border-l-2 border-rose-500" [routerLinkActiveOptions]="{exact: true}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">
              🔍 Duyệt bài chờ (Pending)
            </a>
          </nav>
        </div>

        <!-- Admin Profile Info -->
        <div class="pt-4 border-t border-slate-800 flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-rose-600/20 text-rose-400 font-bold flex items-center justify-center text-xs">
            AD
          </div>
          <div>
            <p class="text-xs font-semibold text-white">{{ userSession.currentUser().name }}</p>
            <p class="text-[10px] text-slate-400">Admin ID: {{ userSession.currentUser().id }}</p>
          </div>
        </div>
      </aside>

      <!-- Content Area -->
      <div class="flex-1 flex flex-col">
        <header class="border-b border-slate-800 bg-slate-900/40 px-8 py-4 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-slate-300">Trung Tâm Kiểm Duyệt Nội Dung Ban Quản Trị</h2>
          <a routerLink="/" class="text-xs text-rose-400 hover:underline">← Về Sàn Đấu Giá Public</a>
        </header>

        <main class="flex-1 p-8">
          <router-outlet />
        </main>
      </div>
    </div>
  `
})
export class AdminLayoutComponent {
  userSession = inject(UserSessionService);
}
