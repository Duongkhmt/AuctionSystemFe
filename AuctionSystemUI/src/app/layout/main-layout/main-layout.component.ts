import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserSessionService, TEST_USERS } from '../../core/auth/user-session.service';
import { LanguageService, LanguageCode } from '../../core/services/language.service';
import { ToastContainerComponent } from '../../shared/components/toast-container/toast-container.component';

/**
 * ====================================================================================
 * 🖼️ MAIN LAYOUT COMPONENT (Khung Giao Diện Chính & Thanh Navigation Trực Quan)
 * ====================================================================================
 * Khung bao ngoài dùng chung cho Sàn công khai & Người mua.
 * Tích hợp Bộ chọn tài khoản Test Account & Bộ chuyển đổi ngôn ngữ i18n (`🇻🇳 VN` / `🇬🇧 EN`)
 * tự động gửi Header `Accept-Language` sang Spring Boot Backend.
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ToastContainerComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans antialiased">
      <app-toast-container />

      <!-- Top Header Navigation Bar -->
      <header class="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-6 py-3.5">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          
          <!-- Logo & Brand Link -->
          <div class="flex items-center gap-8">
            <a routerLink="/" class="flex items-center gap-2 text-xl font-black tracking-tight text-white group">
              <span class="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                ⚖
              </span>
              <span class="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">AuctionHub</span>
            </a>

            <!-- Menu Navigation Links -->
            <nav class="hidden md:flex items-center gap-1 text-sm font-medium">
              <a routerLink="/" routerLinkActive="bg-slate-800 text-indigo-400" [routerLinkActiveOptions]="{exact: true}" class="px-3.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors">
                {{ langService.translate('nav.marketplace') }}
              </a>
              <a routerLink="/my-bids" routerLinkActive="bg-slate-800 text-indigo-400" class="px-3.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors">
                {{ langService.translate('nav.wonAuctions') }}
              </a>
              <a routerLink="/seller" routerLinkActive="bg-slate-800 text-indigo-400" class="px-3.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors">
                {{ langService.translate('nav.sellerStudio') }}
              </a>
              <a routerLink="/admin" routerLinkActive="bg-slate-800 text-indigo-400" class="px-3.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors">
                {{ langService.translate('nav.adminApproval') }}
              </a>
            </nav>
          </div>

          <!-- Right Action Bar: Language Switcher, User Selector & Profile Badge -->
          <div class="flex items-center gap-3">
            
            <!-- 🌐 Language Switcher Button Toggle (VN / EN) -->
            <div class="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
              <button
                (click)="langService.setLanguage('vi')"
                [class]="langService.currentLang() === 'vi' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'"
                class="px-2.5 py-1 rounded-lg transition-all flex items-center gap-1"
                title="Chuyển sang Tiếng Việt"
              >
                <span>🇻🇳</span> <span class="hidden sm:inline">VN</span>
              </button>
              <button
                (click)="langService.setLanguage('en')"
                [class]="langService.currentLang() === 'en' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'"
                class="px-2.5 py-1 rounded-lg transition-all flex items-center gap-1"
                title="Switch to English"
              >
                <span>🇬🇧</span> <span class="hidden sm:inline">EN</span>
              </button>
            </div>

            <!-- Tester User Select Dropdown -->
            <div class="flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs">
              <span class="text-slate-400 font-mono hidden sm:inline">User:</span>
              <select
                [value]="userSession.currentUser().id"
                (change)="onUserSelectChange($event)"
                class="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white font-semibold text-xs focus:outline-none focus:border-indigo-500"
              >
                <optgroup label="Thành Viên (Role: USER)">
                  <option [value]="2">Thanh Trúc (ID: 2 - Seller)</option>
                  <option [value]="4">Hoàng Minh (ID: 4 - Buyer)</option>
                  <option [value]="5">Khánh Linh (ID: 5 - Buyer)</option>
                  <option [value]="6">Quốc Anh (ID: 6 - Buyer)</option>
                  <option [value]="3">T Dương (ID: 3 - Buyer)</option>
                </optgroup>
                <optgroup label="Quản Trị Viên (Role: ADMIN)">
                  <option [value]="1">Admin System (ID: 1 - Admin)</option>
                </optgroup>
              </select>
            </div>

            <!-- Current User Session Badge -->
            <div class="flex items-center gap-2.5 pl-2 border-l border-slate-800">
              <div class="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-indigo-400">
                {{ userSession.currentUser().name.charAt(0) }}
              </div>
              <div class="hidden lg:block text-left text-xs">
                <p class="font-semibold text-slate-200">{{ userSession.currentUser().name }}</p>
                <p class="text-slate-400 font-mono text-[10px]">ID: #{{ userSession.currentUser().id }} ({{ userSession.currentUser().role }})</p>
              </div>
            </div>

          </div>

        </div>
      </header>

      <!-- Main Content Container -->
      <main class="flex-1 max-w-7xl w-full mx-auto p-6">
        <router-outlet />
      </main>

      <!-- Footer -->
      <footer class="border-t border-slate-800/80 bg-slate-900/50 py-8 text-center text-xs text-slate-500">
        <p>© 2026 Enterprise Auction Platform. Integrated Spring Boot i18n & REST APIs.</p>
      </footer>
    </div>
  `
})
export class MainLayoutComponent {
  userSession = inject(UserSessionService);
  langService = inject(LanguageService);
  private router = inject(Router);

  onUserSelectChange(event: Event): void {
    const selectedId = Number((event.target as HTMLSelectElement).value);
    const foundUser = Object.values(TEST_USERS).find((u) => u.id === selectedId);
    if (foundUser) {
      this.userSession.switchToUser(foundUser);
      if (foundUser.role === 'ADMIN') {
        this.router.navigate(['/admin']);
      }
    }
  }
}
