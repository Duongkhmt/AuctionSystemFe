import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SellerApiService } from '../../services/seller-api.service';
import { UserSessionService } from '../../../../core/auth/user-session.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { LanguageService } from '../../../../core/services/language.service';
import { ProductResponse } from '../../../../shared/models/product.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { ProductDetailModalComponent } from '../../../../shared/components/product-detail-modal/product-detail-modal.component';
import { CurrencyVndPipe } from '../../../../shared/pipes/currency-vnd.pipe';

@Component({
  selector: 'app-seller-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, StatusBadgeComponent, ProductDetailModalComponent, CurrencyVndPipe],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto px-4 py-4">
      
      <!-- Sub-Header View Switcher Bar -->
      <div class="flex items-center gap-3">
        <a
          routerLink="/my-bids"
          class="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900/60 text-slate-400 border border-emerald-900/40 hover:text-white hover:border-[#c5a059] transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>{{ langService.translate('nav.wonProducts') }}</span>
        </a>

        <a
          routerLink="/seller"
          class="px-5 py-2.5 rounded-xl text-xs font-black bg-[#c5a059] text-slate-950 shadow-lg shadow-[#c5a059]/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>{{ langService.translate('nav.myListedProducts') }}</span>
        </a>
      </div>

      <!-- Header Banner Tiêu Đề -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-emerald-900/30">
        <div>
          <span class="text-[11px] font-bold tracking-widest text-[#c5a059] uppercase">
            {{ langService.translate('seller.headerSub') }}
          </span>
          <h1 class="text-3xl font-serif font-bold text-white tracking-tight mt-1">
            {{ langService.translate('seller.manageListings') }}
          </h1>
          <p class="text-xs text-slate-400 mt-1">
            {{ langService.translate('seller.workspacePrefix') }} <strong class="text-[#c5a059]">{{ userSession.currentUser()?.name || 'Văn Dương' }}</strong> ({{ langService.translate('seller.sellerId') }} {{ userSession.currentUser()?.id || 4 }})
          </p>
        </div>

        <a
          routerLink="/seller/create"
          class="px-5 py-2.5 bg-[#c5a059] hover:bg-[#d4af66] text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-[#c5a059]/20 transition-all flex items-center gap-2"
        >
          <span>{{ langService.translate('seller.newListingBtn') }}</span>
        </a>
      </div>

      <!-- Main Layout: 2 Cột -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-2">
        
        <!-- Cột Trái: Sidebar Menu -->
        <div class="lg:col-span-1 bg-[#050b08]/80 border border-emerald-900/30 rounded-2xl p-5 h-fit space-y-4">
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest block border-b border-emerald-900/30 pb-2">
            {{ langService.translate('seller.sidebarHeader') }}
          </span>

          <nav class="space-y-1.5 text-xs font-semibold">
            <a
              routerLink="/seller"
              [routerLinkActiveOptions]="{exact: true}"
              routerLinkActive="bg-[#0d1a14] border-l-2 border-[#c5a059] text-[#c5a059]"
              class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-slate-300 hover:bg-[#0d1a14] hover:text-[#c5a059] transition-all"
            >
              <span>{{ langService.translate('seller.menuListings') }}</span>
            </a>

            <a
              routerLink="/seller/orders"
              routerLinkActive="bg-[#0d1a14] border-l-2 border-[#c5a059] text-[#c5a059]"
              class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-slate-400 hover:bg-[#0d1a14] hover:text-[#c5a059] transition-all"
            >
              <span>{{ langService.translate('seller.menuOrders') }}</span>
            </a>

            <a
              routerLink="/seller/create"
              routerLinkActive="bg-[#0d1a14] border-l-2 border-[#c5a059] text-[#c5a059]"
              class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-slate-400 hover:bg-[#0d1a14] hover:text-[#c5a059] transition-all mt-4 border-t border-emerald-900/20 pt-3"
            >
              <span>{{ langService.translate('seller.menuCreate') }}</span>
            </a>
          </nav>
        </div>

        <!-- Cột Phải: Nội Dung Lưới Sản Phẩm -->
        <div class="lg:col-span-3">
          @if (loading()) {
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              @for (i of [1,2]; track i) {
                <div class="h-80 rounded-2xl bg-slate-900/40 border border-emerald-900/30 animate-pulse"></div>
              }
            </div>
          } @else if (products().length === 0) {
            <!-- Khung Rỗng -->
            <div class="py-24 bg-[#050b08]/80 border border-emerald-900/30 rounded-2xl text-center flex flex-col items-center justify-center p-8 space-y-4 shadow-2xl">
              
              <div class="w-16 h-16 rotate-45 border-2 border-[#c5a059]/60 bg-[#c5a059]/10 flex items-center justify-center mb-2 shadow-inner">
                <span class="-rotate-45 text-[#c5a059] font-serif font-black text-2xl">+</span>
              </div>

              <h3 class="text-lg font-serif font-bold text-white tracking-wide">
                {{ langService.translate('seller.emptyListedTitle') }}
              </h3>

              <p class="text-xs text-slate-400 max-w-md leading-relaxed">
                {{ langService.translate('seller.emptyListedSub') }}
              </p>

              <a
                routerLink="/seller/create"
                class="mt-3 px-6 py-3 bg-[#c5a059] hover:bg-[#d4af66] text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-[#c5a059]/20 transition-all"
              >
                {{ langService.translate('seller.newListingBtn') }}
              </a>
            </div>
          } @else {
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              @for (item of sortedProducts(); track item.productId) {
                <div class="group bg-[#07120d] border border-emerald-900/40 hover:border-[#c5a059]/60 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between">
                  
                  <div>
                    <div (click)="previewProduct.set(item)" class="block relative h-52 bg-slate-950 overflow-hidden cursor-pointer">
                      @if (item.images && item.images.length > 0 && item.images[0].imageUrl) {
                        <img
                          [src]="item.images[0].imageUrl"
                          [alt]="item.title"
                          (error)="onImgError($event)"
                          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      } @else {
                        <div class="w-full h-full flex items-center justify-center text-slate-700 text-4xl">🖼</div>
                      }

                      <div class="absolute top-3 left-3 flex items-center gap-2">
                        <app-status-badge [status]="item.auctionStatus || item.status" [endTime]="item.endTime" />
                      </div>

                      <div class="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-[#c5a059] border border-emerald-900/50">
                        {{ item.auctionType }}
                      </div>
                    </div>

                    <div class="p-5 space-y-3">
                      <div class="flex items-center justify-between text-[11px] text-slate-500">
                        <span>ID: #{{ item.productId }}</span>
                        <span>AUC: #{{ item.auctionId }}</span>
                      </div>

                      <div (click)="previewProduct.set(item)" class="cursor-pointer">
                        <h3 class="font-serif font-bold text-base text-white group-hover:text-[#c5a059] transition-colors line-clamp-1">
                          {{ item.title }}
                        </h3>
                      </div>

                      <p class="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {{ item.description }}
                      </p>

                      <div class="pt-3 border-t border-emerald-900/30 flex items-center justify-between">
                        <div>
                          <p class="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">{{ langService.translate('home.currentPrice') }}</p>
                          <p class="text-lg font-black text-[#c5a059] font-mono">
                            {{ (item.currentPrice || item.startPrice) | currencyVnd }}
                          </p>
                        </div>
                        <div class="text-right">
                          <p class="text-[10px] text-slate-500">{{ langService.translate('home.minBidStep') }}</p>
                          <p class="text-xs font-semibold text-slate-300 font-mono">
                            {{ item.bidStep | currencyVnd }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="p-4 pt-0 border-t border-emerald-900/20 mt-2 flex items-center justify-between gap-2">
                    <a
                      [routerLink]="['/seller/edit', item.productId]"
                      class="py-2 px-3 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold transition-all text-center"
                    >
                      {{ langService.translate('seller.editBtn') }}
                    </a>

                    @if (item.auctionStatus === 'PENDING_APPROVAL' || item.auctionStatus === 'SCHEDULED' || item.auctionStatus === 'RUNNING') {
                      <button
                        (click)="cancelAuction(item.productId)"
                        class="py-2 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold transition-all text-center"
                      >
                        {{ langService.translate('seller.cancelBtn') }}
                      </button>
                    }

                    @if (isRelistable(item)) {
                      <button
                        (click)="relistAuction(item.auctionId)"
                        class="flex-1 py-2 px-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-semibold transition-all text-center"
                      >
                        {{ langService.translate('seller.relistBtn') }}
                      </button>
                    }

                    <button
                      (click)="deleteProduct(item.productId)"
                      class="py-2 px-3 bg-rose-500/10 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 rounded-xl text-xs font-semibold transition-all text-center"
                    >
                      {{ langService.translate('seller.deleteBtn') }}
                    </button>
                  </div>

                </div>
              }
            </div>
          }
        </div>
      </div>

      <app-product-detail-modal
        [product]="previewProduct()"
        [showSellerActions]="true"
        (close)="previewProduct.set(null)"
        (edit)="onModalEdit($event)"
      />
    </div>
  `
})
export class SellerProductListComponent implements OnInit {
  private sellerService = inject(SellerApiService);
  authService = inject(AuthService);
  userSession = inject(UserSessionService);
  langService = inject(LanguageService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  products = signal<ProductResponse[]>([]);
  loading = signal<boolean>(true);
  previewProduct = signal<ProductResponse | null>(null);

  sortedProducts = computed(() => {
    return [...this.products()].sort((a, b) => {
      const getRank = (item: ProductResponse) => {
        if (item.status === 'PENDING' || item.auctionStatus === 'PENDING_APPROVAL') return 1;
        if (item.status === 'REJECTED') return 2;
        if (item.auctionStatus === 'RUNNING') return 3;
        if (item.auctionStatus === 'SCHEDULED') return 4;
        return 5;
      };
      const rankDiff = getRank(a) - getRank(b);
      if (rankDiff !== 0) return rankDiff;
      return b.productId - a.productId;
    });
  });

  ngOnInit(): void {
    this.loadSellerProducts();
  }

  loadSellerProducts(): void {
    this.loading.set(true);
    this.sellerService.getSellerProducts().subscribe({
      next: (res) => {
        this.products.set(res);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  isRelistable(item: ProductResponse): boolean {
    return item.auctionStatus === 'EXPIRED';
  }

  onImgError(event: any): void {
    event.target.src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800';
  }

  onModalEdit(productId: number): void {
    this.previewProduct.set(null);
    this.router.navigate(['/seller/edit', productId]);
  }

  cancelAuction(productId: number): void {
    this.sellerService.cancelAuction(productId).subscribe({
      next: () => {
        this.toastService.showSuccess('Thành Công', 'Đã hủy phiên bài đăng!');
        this.loadSellerProducts();
      }
    });
  }

  relistAuction(auctionId: number): void {
    this.sellerService.relistAuction(auctionId).subscribe({
      next: () => {
        this.toastService.showSuccess('Thành Công', 'Đã khôi phục đăng lại phiên trong 30 ngày!');
        this.loadSellerProducts();
      }
    });
  }

  deleteProduct(productId: number): void {
    if (!confirm('Bạn có chắc chắn muốn xóa vĩnh viễn bài đăng này?')) return;
    this.sellerService.deleteProduct(productId).subscribe({
      next: () => {
        this.toastService.showSuccess('Đã Xóa', 'Sản phẩm đã bị xóa khỏi hệ thống');
        this.loadSellerProducts();
      }
    });
  }
}
