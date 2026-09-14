import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { WalletService } from '../../core/services/wallet.service';
import { LanguageService } from '../../core/services/language.service';
import { ToastContainerComponent } from '../../shared/components/toast-container/toast-container.component';

/**
 * ====================================================================================
 * 🖼️ MAIN LAYOUT COMPONENT (Thiết Kế Luxury Dark Gold / Emerald Song Ngữ VN ↔ EN)
 * ====================================================================================
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ToastContainerComponent, CurrencyPipe],
  template: `
    <div class="min-h-screen flex flex-col bg-[#09110d] text-slate-100 font-sans antialiased">
      <app-toast-container />

      <!-- Top Header Navigation Bar -->
      <header class="sticky top-0 z-40 bg-[#09110d]/95 backdrop-blur-md border-b border-emerald-950/80 px-6 py-4">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          
          <!-- Logo & Brand Link -->
          <div class="flex items-center gap-8">
            <a routerLink="/" [queryParams]="{ categoryId: 'ALL' }" class="flex items-center gap-2 text-xl font-serif tracking-tight text-white group">
              <span class="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#c5a059] text-base group-hover:scale-105 transition-transform">
                ⚖
              </span>
              <span class="font-bold text-[#c5a059] tracking-wider">AuctionHub</span>
            </a>

            <!-- Menu Navigation Links -->
            <nav class="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-slate-300">
              <a
                routerLink="/"
                [queryParams]="{ categoryId: 'ALL' }"
                routerLinkActive="text-[#c5a059] font-bold"
                [routerLinkActiveOptions]="{exact: true}"
                class="px-3.5 py-2 rounded-xl hover:text-white hover:bg-slate-900/60 transition-colors cursor-pointer"
              >
                {{ langService.translate('nav.marketplace') }}
              </a>

              <a
                routerLink="/"
                [queryParams]="{ categoryId: 7 }"
                routerLinkActive="text-[#c5a059] font-bold"
                class="px-3.5 py-2 rounded-xl hover:text-white hover:bg-slate-900/60 transition-colors cursor-pointer"
              >
                {{ langService.translate('nav.realEstate') }}
              </a>

              <a
                routerLink="/"
                [queryParams]="{ categoryId: 2 }"
                routerLinkActive="text-[#c5a059] font-bold"
                class="px-3.5 py-2 rounded-xl hover:text-white hover:bg-slate-900/60 transition-colors cursor-pointer"
              >
                {{ langService.translate('nav.watchesJewelry') }}
              </a>

              <a
                routerLink="/"
                [queryParams]="{ categoryId: 1 }"
                routerLinkActive="text-[#c5a059] font-bold"
                class="px-3.5 py-2 rounded-xl hover:text-white hover:bg-slate-900/60 transition-colors cursor-pointer"
              >
                {{ langService.translate('nav.antiques') }}
              </a>

              @if (authService.isLoggedIn()) {
                @if (!authService.hasRole('ADMIN')) {
                  <a routerLink="/my-bids" routerLinkActive="text-[#c5a059] font-bold underline underline-offset-8" class="px-3.5 py-2 rounded-xl hover:text-white hover:bg-slate-900/60 transition-colors">
                    {{ langService.translate('nav.myAccount') }}
                  </a>
                }

                @if (authService.hasRole('ADMIN')) {
                  <a routerLink="/admin" routerLinkActive="text-[#c5a059] font-bold underline underline-offset-8" class="px-3.5 py-2 rounded-lg hover:text-white hover:bg-slate-900/60 transition-colors">
                    {{ langService.translate('nav.adminApproval') }}
                  </a>
                }
              }
            </nav>
          </div>

          <!-- Right Action Bar: Language Switcher (VN/EN) & User Profile -->
          <div class="flex items-center gap-4">
            
            <!-- 🌐 Language Switcher Toggle (VN / EN) -->
            <div class="flex items-center bg-[#050b08] border border-emerald-900/50 rounded-xl p-1 text-[11px]">
              <button
                (click)="langService.setLanguage('vi')"
                [class]="langService.currentLang() === 'vi' ? 'bg-[#c5a059] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'"
                class="px-2.5 py-1 rounded-lg transition-all flex items-center gap-1"
              >
                <span>VN</span>
              </button>
              <button
                (click)="langService.setLanguage('en')"
                [class]="langService.currentLang() === 'en' ? 'bg-[#c5a059] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'"
                class="px-2.5 py-1 rounded-lg transition-all flex items-center gap-1"
              >
                <span>EN</span>
              </button>
            </div>

            <!-- User Action Buttons -->
            @if (authService.isLoggedIn()) {
              <div class="flex items-center gap-3 pl-3 border-l border-emerald-900/50">
                <div class="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xs font-bold text-[#c5a059]">
                  {{ authService.currentUser()?.name?.charAt(0) || 'U' }}
                </div>
                <div class="hidden lg:block text-left text-xs">
                  <p class="font-semibold text-slate-200">{{ authService.currentUser()?.name }}</p>
                  <p class="text-slate-500 font-mono text-[10px]">{{ authService.currentUser()?.role }}</p>
                </div>
                <button
                  (click)="onLogout()"
                  class="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-900/60 text-slate-300 hover:text-white font-semibold text-xs transition-colors"
                >
                  🚪 {{ langService.translate('nav.logout') }}
                </button>
              </div>
            } @else {
              <div class="flex items-center gap-3">
                <a
                  routerLink="/login"
                  class="px-4 py-2 rounded-xl text-slate-300 hover:text-white text-xs font-bold transition-all"
                >
                  {{ langService.translate('nav.login') }}
                </a>
                <a
                  routerLink="/register"
                  class="px-5 py-2 rounded-xl bg-[#c5a059] hover:bg-[#b38e47] text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/10 transition-all"
                >
                  {{ langService.translate('nav.register') }}
                </a>
              </div>
            }

          </div>

        </div>
      </header>

      <!-- Main Content Container -->
      <main class="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
        <router-outlet />
      </main>

      <!-- Footer -->
      <footer class="border-t border-emerald-950/60 bg-[#060c09] py-8 text-center text-xs text-slate-500">
        <p>© 2026 AuctionHub Enterprise Platform. Realtime Engine & Certified Luxury Auctions.</p>
      </footer>
    </div>
  `
})
export class MainLayoutComponent implements OnInit {
  authService = inject(AuthService);
  walletService = inject(WalletService);
  langService = inject(LanguageService);
  private router = inject(Router);

  ngOnInit(): void {
    if (this.authService.isLoggedIn() && !this.authService.hasRole('ADMIN')) {
      this.walletService.getWallet().subscribe({
        next: () => {},
        error: () => {}
      });
    }
  }

  onLogout(): void {
    this.authService.logout(true);
    this.router.navigate(['/']);
  }
}

