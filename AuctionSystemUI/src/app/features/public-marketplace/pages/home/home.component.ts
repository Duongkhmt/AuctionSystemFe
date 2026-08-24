import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PublicMarketplaceService } from '../../services/public-marketplace.service';
import { LanguageService } from '../../../../core/services/language.service';
import { ProductResponse } from '../../../../shared/models/product.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { CurrencyVndPipe } from '../../../../shared/pipes/currency-vnd.pipe';
import { AuctionTimerPipe } from '../../../../shared/pipes/auction-timer.pipe';
import { AutoTranslatePipe } from '../../../../shared/pipes/auto-translate.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    StatusBadgeComponent,
    CurrencyVndPipe,
    AuctionTimerPipe,
    AutoTranslatePipe
  ],
  template: `
    <div class="space-y-8">
      <!-- Hero Banner -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-slate-800/80 p-8 md:p-12 shadow-2xl">
        <div class="max-w-2xl space-y-4 relative z-10">
          <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Live Online Auction Platform
          </span>
          <h1 class="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {{ langService.t('home.heroTitle') }}
          </h1>
          <p class="text-sm md:text-base text-slate-300 leading-relaxed">
            {{ langService.t('home.heroSubtitle') }}
          </p>
        </div>
      </div>

      <!-- Filter & Search Toolbar -->
      <div class="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div class="relative w-full sm:w-80">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (input)="applyFilter()"
            [placeholder]="langService.t('home.searchPlaceholder')"
            class="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <span class="absolute left-3.5 top-3 text-slate-500 text-sm">🔍</span>
        </div>

        <div class="flex items-center gap-3 w-full sm:w-auto">
          <select
            [(ngModel)]="selectedType"
            (change)="applyFilter()"
            class="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">{{ langService.t('home.allCategories') }}</option>
            <option value="ENGLISH">ENGLISH</option>
            <option value="RESERVE">RESERVE</option>
            <option value="BUY_NOW">BUY_NOW</option>
          </select>
        </div>
      </div>

      <!-- Loading & Empty States -->
      @if (loading()) {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          @for (i of [1,2,3]; track i) {
            <div class="h-80 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse"></div>
          }
        </div>
      } @else if (filteredProducts().length === 0) {
        <div class="text-center py-16 bg-slate-900/30 rounded-3xl border border-slate-800/60 p-8">
          <div class="text-4xl mb-3">📦</div>
          <h3 class="text-lg font-bold text-slate-300">{{ langService.t('home.noProducts') }}</h3>
        </div>
      } @else {
        <!-- Product Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          @for (product of filteredProducts(); track product.productId) {
            <div class="group bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between">
              <div>
                <!-- Clickable Image Container -->
                <a [routerLink]="['/product', product.productId]" class="block relative h-48 bg-slate-950 overflow-hidden cursor-pointer">
                  @if (product.images && product.images.length > 0 && product.images[0].imageUrl) {
                    <img
                      [src]="product.images[0].imageUrl"
                      [alt]="product.title"
                      (error)="onImgError($event)"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  } @else {
                    <div class="w-full h-full flex items-center justify-center text-slate-700 text-3xl">🖼</div>
                  }
                  
                  <div class="absolute top-3 left-3">
                    <app-status-badge [status]="product.auctionStatus" />
                  </div>

                  <div class="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-mono text-indigo-300 border border-slate-800">
                    ⏱ {{ product.endTime | auctionTimer }}
                  </div>
                </a>

                <!-- Clickable Body Info -->
                <div class="p-5 space-y-3">
                  <a [routerLink]="['/product', product.productId]" class="block group-hover:text-indigo-400 transition-colors">
                    <h3 class="font-bold text-base text-white line-clamp-1">
                      {{ product.title | autoTranslate }}
                    </h3>
                  </a>

                  <p class="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {{ product.description | autoTranslate }}
                  </p>

                  <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <p class="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                        {{ product.auctionType === 'BUY_NOW' ? langService.t('product.fixedBuyNowPrice') : langService.t('home.currentPrice') }}
                      </p>
                      <p class="text-lg font-black text-emerald-400">
                        {{ (product.currentPrice || product.startPrice) | currencyVnd }}
                      </p>
                    </div>
                    <div class="text-right">
                      <p class="text-[10px] text-slate-500">{{ langService.t('home.minBidStep') }}</p>
                      <p class="text-xs font-semibold text-slate-300">
                        {{ product.bidStep | currencyVnd }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer CTA Button -->
              <div class="p-5 pt-0">
                <a
                  [routerLink]="['/product', product.productId]"
                  class="w-full py-2.5 px-4 bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>{{ langService.t('home.viewDetail') }}</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class HomeComponent implements OnInit, OnDestroy {
  private marketplaceService = inject(PublicMarketplaceService);
  langService = inject(LanguageService);

  allProducts = signal<ProductResponse[]>([]);
  filteredProducts = signal<ProductResponse[]>([]);
  loading = signal<boolean>(true);
  nowSignal = signal<number>(Date.now());
  private clockTicker: any = null;

  searchQuery = '';
  selectedType = 'ALL';

  ngOnInit(): void {
    this.fetchProducts();
    this.clockTicker = setInterval(() => {
      this.nowSignal.set(Date.now());
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.clockTicker) clearInterval(this.clockTicker);
  }

  fetchProducts(): void {
    this.loading.set(true);
    this.marketplaceService.getPublicProducts().subscribe({
      next: (res) => {
        this.allProducts.set(res);
        this.applyFilter();
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onImgError(event: any): void {
    event.target.src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800';
  }

  applyFilter(): void {
    let list = this.allProducts();
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q));
    }
    if (this.selectedType !== 'ALL') {
      list = list.filter((p) => p.auctionType === this.selectedType);
    }

    list = [...list].sort((a, b) => {
      const isActiveA = a.auctionStatus === 'RUNNING' || a.auctionStatus === 'SCHEDULED';
      const isActiveB = b.auctionStatus === 'RUNNING' || b.auctionStatus === 'SCHEDULED';

      if (isActiveA && !isActiveB) return -1;
      if (!isActiveA && isActiveB) return 1;

      if (isActiveA && isActiveB) {
        const endA = a.endTime ? new Date(a.endTime).getTime() : Infinity;
        const endB = b.endTime ? new Date(b.endTime).getTime() : Infinity;
        return endA - endB;
      }

      return b.productId - a.productId;
    });

    this.filteredProducts.set(list);
  }
}
