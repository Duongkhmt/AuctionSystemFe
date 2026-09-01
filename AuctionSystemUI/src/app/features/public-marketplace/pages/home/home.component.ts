import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PublicMarketplaceService } from '../../services/public-marketplace.service';
import { CategoryService, Category } from '../../../../core/services/category.service';
import { LanguageService } from '../../../../core/services/language.service';
import { ProductResponse } from '../../../../shared/models/product.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { CurrencyVndPipe } from '../../../../shared/pipes/currency-vnd.pipe';
import { AuctionTimerPipe } from '../../../../shared/pipes/auction-timer.pipe';
import { AutoTranslatePipe } from '../../../../shared/pipes/auto-translate.pipe';

/**
 * ====================================================================================
 * 🏛️ HOME COMPONENT (Trang Chủ Sàn Đấu Giá Song Ngữ Chuẩn VN ↔ EN)
 * ====================================================================================
 * Tương thích 100% với giao diện Mockup Luxe Gold & Đa ngôn ngữ linh hoạt:
 * - Banner Tiêu Đề động thay đổi linh hoạt theo Danh Mục & Ngôn ngữ (VN/EN)
 * - Tên Danh mục trong Dropdown tự động dịch theo Pipe `autoTranslate`
 * - Nút Tìm Kiếm & Các nhãn Thẻ Lô thầu dịch tự động khi bấm nút 🇬🇧 EN
 */
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
    <div class="space-y-10">
      
      <!-- HERO BANNER SECTION (Động theo từng Danh Mục & Ngôn Ngữ đang chọn) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-r from-[#09150f] via-[#0b1711] to-[#070f0b] border border-emerald-950/80 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        
        <!-- Ambient Gold Glow Accent -->
        <div class="absolute top-0 left-1/3 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <!-- Cột Trái: Tiêu Đề & Mô Tả Linh Hoạt Song Ngữ -->
        <div class="lg:col-span-8 space-y-6 relative z-10">
          <div class="flex items-center gap-2">
            <span class="w-6 h-[1px] bg-[#c5a059]"></span>
            <span class="text-xs font-bold uppercase tracking-widest text-[#c5a059]">
              {{ heroContent().subtitle }}
            </span>
          </div>

          <h1 class="text-3xl md:text-5xl font-serif text-white tracking-tight leading-tight">
            {{ heroContent().titlePrefix }} <br />
            <em class="italic font-serif text-[#c5a059] font-normal">{{ heroContent().titleHighlight }}</em>
          </h1>

          <p class="text-sm md:text-base text-slate-300 max-w-xl leading-relaxed">
            {{ heroContent().description }}
          </p>
        </div>

        <!-- Cột Phải: 3 Chỉ Số Thống Kê Nổi Bật Song Ngữ -->
        <div class="lg:col-span-4 border-l border-emerald-900/40 pl-0 lg:pl-8 space-y-6">
          <div class="flex items-baseline justify-between border-b border-emerald-950/80 pb-4">
            <span class="text-3xl font-serif font-bold text-[#c5a059]">{{ heroContent().stat1 }}</span>
            <span class="text-xs text-slate-400 font-medium">{{ heroContent().stat1Label }}</span>
          </div>

          <div class="flex items-baseline justify-between border-b border-emerald-950/80 pb-4">
            <span class="text-3xl font-serif font-bold text-[#c5a059]">{{ heroContent().stat2 }}</span>
            <span class="text-xs text-slate-400 font-medium">{{ heroContent().stat2Label }}</span>
          </div>

          <div class="flex items-baseline justify-between">
            <span class="text-3xl font-serif font-bold text-[#c5a059]">{{ heroContent().stat3 }}</span>
            <span class="text-xs text-slate-400 font-medium">{{ heroContent().stat3Label }}</span>
          </div>
        </div>

      </div>

      <!-- SEARCH & CATEGORY TOOLBAR (Thanh Tìm Kiếm Khớp Mockup & Song Ngữ) -->
      <div class="bg-[#0b1610] p-3 md:p-4 rounded-2xl border border-emerald-950/80 shadow-xl flex flex-col md:flex-row gap-3 items-center">
        <!-- Input Ô Tìm Kiếm -->
        <div class="relative flex-1 w-full">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (keyup.enter)="applyFilter()"
            [placeholder]="langService.translate('home.searchPlaceholder')"
            class="w-full pl-10 pr-4 py-3 bg-[#050b08] border border-emerald-900/40 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#c5a059] transition-colors"
          />
          <span class="absolute left-3.5 top-3.5 text-slate-500 text-sm">🔍</span>
        </div>

        <!-- Dropdown Bộ Lọc Tất Cả Danh Mục từ DB PostgreSQL dịch tự động -->
        <div class="w-full md:w-64">
          <select
            [ngModel]="selectedCategoryId()"
            (ngModelChange)="onCategorySelectChange($event)"
            class="w-full px-4 py-3 bg-[#050b08] border border-emerald-900/40 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-[#c5a059]"
          >
            <option value="ALL">{{ langService.translate('home.allCategories') }}</option>
            @for (cat of categories(); track cat.id) {
              <option [value]="cat.id">
                {{ (cat.parentId ? '↳ ' : '📁 ') + (cat.name | autoTranslate) }}
              </option>
            }
          </select>
        </div>

        <!-- Nút Tìm Kiếm Vàng Gold Luxe -->
        <button
          (click)="applyFilter()"
          class="w-full md:w-auto px-8 py-3 bg-[#c5a059] hover:bg-[#b38e47] text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
        >
          {{ langService.translate('home.searchBtn') }}
        </button>
      </div>

      <!-- LOADING & EMPTY STATES -->
      @if (loading()) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (i of [1,2,3,4]; track i) {
            <div class="h-96 rounded-2xl bg-[#09150f]/60 border border-emerald-950 animate-pulse"></div>
          }
        </div>
      } @else if (filteredProducts().length === 0) {
        <div class="text-center py-20 bg-[#09150f]/40 rounded-3xl border border-emerald-950/60 p-8 space-y-3">
          <div class="text-4xl">📦</div>
          <h3 class="text-base font-bold text-slate-300">{{ langService.translate('home.noProducts') }}</h3>
          <button (click)="resetCategoryFilter()" class="px-4 py-2 bg-[#c5a059] text-slate-950 font-bold text-xs rounded-xl shadow-md">
            {{ langService.translate('home.viewAllBtn') }}
          </button>
        </div>
      } @else {
        <!-- PRODUCT GRID (Lưới Lô Đấu Giá LOT 001, LOT 002... Song Ngữ) -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (product of filteredProducts(); track product.productId; let idx = $index) {
            <div class="group bg-[#0a150f] border border-emerald-950 hover:border-[#c5a059]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 flex flex-col justify-between">
              
              <div>
                <!-- Header Lot Number & Image -->
                <a [routerLink]="['/product', product.productId]" class="block relative h-52 bg-[#040906] overflow-hidden cursor-pointer">
                  <!-- Lot Number Label -->
                  <div class="absolute top-3 left-3 z-10 bg-[#09110d]/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-[#c5a059] border border-amber-500/20">
                    LOT {{ getLotNumber(product.productId, idx) }}
                  </div>

                  <!-- Image -->
                  @if (product.images && product.images.length > 0 && product.images[0].imageUrl) {
                    <img
                      [src]="product.images[0].imageUrl"
                      [alt]="product.title"
                      (error)="onImgError($event)"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  } @else {
                    <div class="w-full h-full flex flex-col items-center justify-center text-slate-700">
                      <span class="text-3xl mb-1">🖼</span>
                      <span class="text-[10px] text-slate-600">Ảnh sản phẩm</span>
                    </div>
                  }
                  
                  <div class="absolute top-3 right-3 z-10">
                    <app-status-badge [status]="product.auctionStatus" />
                  </div>

                  <div class="absolute bottom-3 right-3 z-10 bg-[#050b08]/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-mono text-emerald-300 border border-emerald-900/60">
                    ⏱ {{ product.endTime | auctionTimer }}
                  </div>
                </a>

                <!-- Card Body -->
                <div class="p-5 space-y-3">
                  <a [routerLink]="['/product', product.productId]" class="block group-hover:text-[#c5a059] transition-colors">
                    <h3 class="font-bold text-sm text-white line-clamp-1">
                      {{ product.title | autoTranslate }}
                    </h3>
                  </a>

                  <p class="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {{ product.description | autoTranslate }}
                  </p>

                  <div class="pt-3 border-t border-emerald-950 flex items-center justify-between">
                    <div>
                      <p class="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                        {{ product.auctionType === 'BUY_NOW' ? langService.translate('product.fixedBuyNowPrice') : langService.translate('home.currentPrice') }}
                      </p>
                      <p class="text-base font-black text-emerald-400 font-mono">
                        {{ (product.currentPrice || product.startPrice) | currencyVnd }}
                      </p>
                    </div>
                    <div class="text-right">
                      <p class="text-[10px] text-slate-500">{{ langService.translate('home.minBidStep') }}</p>
                      <p class="text-xs font-semibold text-slate-300 font-mono">
                        {{ product.bidStep | currencyVnd }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Card Action Button -->
              <div class="p-5 pt-0">
                <a
                  [routerLink]="['/product', product.productId]"
                  class="w-full py-2.5 px-4 bg-[#112017] hover:bg-[#c5a059] text-slate-200 hover:text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>{{ langService.translate('home.viewDetail') }}</span>
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
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  langService = inject(LanguageService);

  allProducts = signal<ProductResponse[]>([]);
  filteredProducts = signal<ProductResponse[]>([]);
  categories = signal<Category[]>([]);
  selectedCategoryId = signal<string>('ALL');
  loading = signal<boolean>(true);
  nowSignal = signal<number>(Date.now());
  
  private clockTicker: any = null;
  searchQuery = '';

  heroContent = computed(() => {
    const catId = this.selectedCategoryId();
    
    if (catId === '7' || catId === '71' || catId === '72') {
      return {
        subtitle: this.langService.translate('hero.reSubtitle'),
        titlePrefix: this.langService.translate('hero.reTitlePrefix'),
        titleHighlight: this.langService.translate('hero.reTitleHighlight'),
        description: this.langService.translate('hero.reDescription'),
        stat1: this.langService.translate('hero.reStat1'),
        stat1Label: this.langService.translate('hero.reStat1Label'),
        stat2: this.langService.translate('hero.reStat2'),
        stat2Label: this.langService.translate('hero.reStat2Label'),
        stat3: '0.02s',
        stat3Label: this.langService.translate('hero.defaultStat3Label')
      };
    }
    if (catId === '2' || catId === '21' || catId === '22') {
      return {
        subtitle: this.langService.translate('hero.watchSubtitle'),
        titlePrefix: this.langService.translate('hero.watchTitlePrefix'),
        titleHighlight: this.langService.translate('hero.watchTitleHighlight'),
        description: this.langService.translate('hero.watchDescription'),
        stat1: this.langService.translate('hero.watchStat1'),
        stat1Label: this.langService.translate('hero.watchStat1Label'),
        stat2: this.langService.translate('hero.watchStat2'),
        stat2Label: this.langService.translate('hero.watchStat2Label'),
        stat3: '0.02s',
        stat3Label: this.langService.translate('hero.defaultStat3Label')
      };
    }
    if (catId === '1' || catId === '11' || catId === '12' || catId === '13') {
      return {
        subtitle: this.langService.translate('hero.antiqueSubtitle'),
        titlePrefix: this.langService.translate('hero.antiqueTitlePrefix'),
        titleHighlight: this.langService.translate('hero.antiqueTitleHighlight'),
        description: this.langService.translate('hero.antiqueDescription'),
        stat1: this.langService.translate('hero.antiqueStat1'),
        stat1Label: this.langService.translate('hero.antiqueStat1Label'),
        stat2: this.langService.translate('hero.antiqueStat2'),
        stat2Label: this.langService.translate('hero.antiqueStat2Label'),
        stat3: '0.02s',
        stat3Label: this.langService.translate('hero.defaultStat3Label')
      };
    }
    return {
      subtitle: this.langService.translate('hero.defaultSubtitle'),
      titlePrefix: this.langService.translate('hero.defaultTitlePrefix'),
      titleHighlight: this.langService.translate('hero.defaultTitleHighlight'),
      description: this.langService.translate('hero.defaultDescription'),
      stat1: this.langService.translate('hero.defaultStat1'),
      stat1Label: this.langService.translate('hero.defaultStat1Label'),
      stat2: this.langService.translate('hero.defaultStat2'),
      stat2Label: this.langService.translate('hero.defaultStat2Label'),
      stat3: '0.02s',
      stat3Label: this.langService.translate('hero.defaultStat3Label')
    };
  });

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchProducts();

    this.route.queryParams.subscribe((params) => {
      const catParam = params['categoryId'];
      if (catParam) {
        this.selectedCategoryId.set(String(catParam));
      } else {
        this.selectedCategoryId.set('ALL');
      }
      this.applyFilter();
    });

    this.clockTicker = setInterval(() => {
      this.nowSignal.set(Date.now());
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.clockTicker) clearInterval(this.clockTicker);
  }

  fetchCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (list) => this.categories.set(list),
      error: (err) => console.error('Lỗi nạp danh mục:', err)
    });
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

  onCategorySelectChange(val: string): void {
    this.selectedCategoryId.set(val);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { categoryId: val === 'ALL' ? null : val },
      queryParamsHandling: 'merge'
    });
  }

  resetCategoryFilter(): void {
    this.searchQuery = '';
    this.selectedCategoryId.set('ALL');
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { categoryId: null }
    });
  }

  getLotNumber(productId: number, index: number): string {
    const lotNum = productId || index + 1;
    return String(lotNum).padStart(3, '0');
  }

  onImgError(event: any): void {
    event.target.src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800';
  }

  applyFilter(): void {
    let list = this.allProducts();

    const catIdStr = this.selectedCategoryId();
    if (catIdStr !== 'ALL') {
      const targetId = Number(catIdStr);
      const childCatIds = this.categories()
        .filter((c) => c.parentId === targetId)
        .map((c) => c.id);
      
      const allowedCatIds = [targetId, ...childCatIds];
      list = list.filter((p) => allowedCatIds.includes(p.categoryId));
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
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
