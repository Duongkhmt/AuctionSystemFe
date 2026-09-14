import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserSessionService } from '../../core/auth/user-session.service';
import { ToastContainerComponent } from '../../shared/components/toast-container/toast-container.component';
import { LanguageService } from '../../core/services/language.service';

/**
 * ====================================================================================
 * 🛡️ ADMIN LAYOUT COMPONENT (Thiết Kế Luxury Admin Panel Chuẩn Mockup Screenshots)
 * ====================================================================================
 */
@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ToastContainerComponent],
  template: `
    <div class="min-h-screen flex bg-[#09110d] text-slate-100 font-sans antialiased">
      <app-toast-container />

      <!-- Sidebar Trái Ban Quản Trị -->
      <aside class="w-64 border-r border-emerald-950/80 bg-[#050b08] p-5 flex flex-col justify-between">
        <div>
          <!-- Logo Brand -->
          <a routerLink="/" class="flex items-center gap-3 text-lg font-serif tracking-tight text-white mb-8 group">
            <span class="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#c5a059] text-base group-hover:scale-105 transition-transform">
              ⚖
            </span>
            <div>
              <span class="font-bold text-[#c5a059] text-base block tracking-wider leading-none">AuctionHub</span>
              <span class="text-[9px] font-bold text-slate-500 tracking-widest uppercase block mt-1">BAN QUẢN TRỊ</span>
            </div>
          </a>

          <!-- Navigation Links -->
          <nav class="space-y-2 text-xs font-semibold">
            <a
              routerLink="/admin"
              routerLinkActive="bg-[#07120d] text-[#c5a059] border-l-2 border-[#c5a059]"
              [routerLinkActiveOptions]="{exact: true}"
              class="flex items-center justify-between px-3.5 py-3 rounded-xl text-slate-300 hover:bg-[#07120d] hover:text-[#c5a059] transition-all"
            >
              <span>Quản lý bài đăng</span>
              <span class="px-2 py-0.5 rounded-md bg-[#c5a059] text-slate-950 font-bold text-[10px]">
                3
              </span>
            </a>

            <a
              routerLink="/admin/categories"
              routerLinkActive="bg-[#07120d] text-[#c5a059] border-l-2 border-[#c5a059]"
              class="flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-slate-400 hover:bg-[#07120d] hover:text-slate-200 transition-all"
            >
              <span>Quản lý danh mục</span>
            </a>

            <a
              routerLink="/admin/users"
              routerLinkActive="bg-[#07120d] text-[#c5a059] border-l-2 border-[#c5a059]"
              class="flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-slate-400 hover:bg-[#07120d] hover:text-slate-200 transition-all"
            >
              <span>Người dùng</span>
            </a>

            <a
              routerLink="/wallet"
              routerLinkActive="bg-[#07120d] text-[#c5a059] border-l-2 border-[#c5a059]"
              class="flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-slate-400 hover:bg-[#07120d] hover:text-[#c5a059] transition-all border-t border-emerald-950/80 pt-3 mt-2"
            >
              <span>👛 Quản lý Ví Ảo</span>
            </a>
          </nav>
        </div>

        <!-- Thẻ Admin Profile ở góc dưới Sidebar (Hình Thoi Kim Cương Gold) -->
        <div class="pt-4 border-t border-emerald-950/80 flex items-center gap-3">
          <div class="w-8 h-8 rotate-45 border border-[#c5a059]/60 bg-[#c5a059]/10 flex items-center justify-center">
            <span class="-rotate-45 text-[#c5a059] font-serif font-black text-xs">A</span>
          </div>
          <div>
            <p class="text-xs font-bold text-slate-200">{{ userSession.currentUser()?.name || 'Admin System' }}</p>
            <p class="text-[10px] text-slate-500 font-mono">Admin ID: {{ userSession.currentUser()?.id || 1 }}</p>
          </div>
        </div>
      </aside>

      <!-- Content Area Bên Phải -->
      <div class="flex-1 flex flex-col">
        <!-- Top Bar Header -->
        <header class="border-b border-emerald-950/80 bg-[#09110d]/95 backdrop-blur-md px-8 py-4 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <!-- Nút quay lại sàn đấu giá nhỏ xinh nằm ở góc trái -->
            <a
              routerLink="/"
              class="text-xs text-slate-400 hover:text-[#c5a059] transition-colors flex items-center gap-1 font-medium cursor-pointer"
            >
              <span>← Về sàn đấu giá</span>
            </a>

            <span class="text-emerald-900/60 font-mono">|</span>

            <div class="flex items-center gap-2 text-xs text-slate-400">
              <span>Ban Quản Trị</span>
              <span>/</span>
              <span class="text-[#c5a059] font-bold">Admin Portal</span>
            </div>
          </div>
        </header>

        <!-- Main Workspace -->
        <main class="flex-1 p-8">
          <router-outlet />
        </main>
      </div>
    </div>
  `
})
export class AdminLayoutComponent {
  userSession = inject(UserSessionService);
  langService = inject(LanguageService);
}
