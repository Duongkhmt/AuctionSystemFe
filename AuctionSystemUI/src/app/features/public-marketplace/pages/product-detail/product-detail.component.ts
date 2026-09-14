import { Component, OnInit, OnDestroy, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PublicMarketplaceService } from '../../services/public-marketplace.service';
import { BiddingService } from '../../../bidder-portal/services/bidding.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { LanguageService } from '../../../../core/services/language.service';
import { ProductResponse } from '../../../../shared/models/product.model';
import { BidHistoryResponse } from '../../../../shared/models/bid.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { CurrencyVndPipe } from '../../../../shared/pipes/currency-vnd.pipe';
import { AuctionTimerPipe } from '../../../../shared/pipes/auction-timer.pipe';
import { AutoTranslatePipe } from '../../../../shared/pipes/auto-translate.pipe';
import { AuthModalComponent } from '../../../../shared/components/auth-modal/auth-modal.component';

/**
 * ====================================================================================
 * 🏷️ PRODUCT DETAIL COMPONENT (Trang Xem Chi Tiết & Đấu Giá Realtime Công Khai Bảo Mật JWT)
 * ====================================================================================
 */
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    StatusBadgeComponent,
    CurrencyVndPipe,
    AuctionTimerPipe,
    AutoTranslatePipe,
    AuthModalComponent
  ],
  template: `
    <!-- Modal Yêu Cầu Đăng Nhập Nhanh Cho Khách Vãng Lai -->
    @if (showAuthModal()) {
      <app-auth-modal (closeModal)="showAuthModal.set(false)" (authSuccess)="onAuthSuccess()" />
    }

    @if (loading() && !product()) {
      <div class="h-96 rounded-3xl bg-slate-900/40 border border-slate-800 animate-pulse"></div>
    } @else if (!product()) {
      <div class="py-20 bg-slate-900/80 border border-slate-800 rounded-3xl text-center flex flex-col items-center justify-center p-8 space-y-4 shadow-2xl max-w-2xl mx-auto">
        <div class="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 text-3xl">
          🔍
        </div>
        <h3 class="text-xl font-extrabold text-white">Sản phẩm không tồn tại</h3>
        <p class="text-xs text-slate-400 max-w-md leading-relaxed">
          Sản phẩm bạn tìm kiếm không tồn tại, đã bị hủy hoặc mã thầu chưa được duyệt.
        </p>
        <a routerLink="/" class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all">
          ← Quay lại Sàn Đấu Giá
        </a>
      </div>
    } @else if (product()) {
      <div class="space-y-8 max-w-7xl mx-auto">
        <!-- Thanh Điều Hướng Trên Cùng -->
        <div class="flex items-center justify-between bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
          <a routerLink="/" class="text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
            <span>{{ langService.t('nav.backToMarketplace') }}</span>
          </a>
          <div class="flex items-center gap-3">
            <span class="text-xs text-slate-400 font-mono">{{ langService.t('product.category') }} #{{ product()!.categoryId }}</span>
            <app-status-badge [status]="product()!.auctionStatus" [endTime]="product()!.endTime" />
          </div>
        </div>

        <!-- Bố Cục Lưới 12 Cột -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <!-- Cột Trái (7 Cột) -->
          <div class="lg:col-span-7 space-y-6">
            <!-- Khung Ảnh Phóng To Chính -->
            <div class="aspect-video w-full rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden relative shadow-2xl group">
              @if (activeImage()) {
                <img [src]="activeImage()" [alt]="product()!.title" class="w-full h-full object-contain p-2" />
              } @else {
                <div class="w-full h-full flex flex-col items-center justify-center text-slate-700">
                  <span class="text-6xl mb-2">🖼</span>
                  <span class="text-xs">No image available</span>
                </div>
              }
            </div>

            <!-- Dải Ảnh Phụ Thumbnail -->
            @if (product()!.images && product()!.images.length > 1) {
              <div class="flex gap-3 overflow-x-auto pb-2">
                @for (img of product()!.images; track img.id) {
                  <button
                    (click)="activeImage.set(img.imageUrl)"
                    [class]="activeImage() === img.imageUrl ? 'border-indigo-500 ring-2 ring-indigo-500/30 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'"
                    class="w-24 h-18 rounded-2xl bg-slate-950 border overflow-hidden flex-shrink-0 transition-all duration-300"
                  >
                    <img [src]="img.imageUrl" class="w-full h-full object-cover" />
                  </button>
                }
              </div>
            }

            <!-- Thuộc Tính Động JSONB Specifications -->
            @if (attributeEntries().length > 0) {
              <div class="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl backdrop-blur-md">
                <h3 class="text-base font-extrabold text-white flex items-center gap-2">
                  <span class="text-indigo-400">⚙️</span> {{ langService.t('product.specs') }}
                </h3>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  @for (attr of attributeEntries(); track attr.key) {
                    <div class="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80">
                      <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">{{ attr.key | autoTranslate }}</p>
                      <p class="text-xs font-bold text-indigo-300 font-mono truncate">{{ attr.value | autoTranslate }}</p>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Khung Mô Tả Sản Phẩm -->
            <div class="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl backdrop-blur-md">
              <h3 class="text-base font-extrabold text-white flex items-center gap-2">
                <span class="text-indigo-400">📝</span> {{ langService.t('product.description') }}
              </h3>
              <p class="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                {{ product()!.description | autoTranslate }}
              </p>
            </div>
          </div>

          <!-- Cột Phải (5 Cột) -->
          <div class="lg:col-span-5 space-y-6">
            <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl backdrop-blur-xl">
              <div>
                <h1 class="text-xl font-extrabold text-white leading-tight mb-2">{{ product()!.title | autoTranslate }}</h1>
                <p class="text-xs text-slate-400 font-mono">{{ langService.t('product.productId') }} #{{ product()!.productId }} | {{ langService.t('product.auctionId') }} #{{ product()!.auctionId }}</p>
              </div>

              <!-- Đồng Hồ Đếm Ngược Realtime -->
              <div class="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center shadow-inner">
                <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{{ langService.t('product.timeRemaining') }}</p>
                <p class="text-2xl font-black text-indigo-400 font-mono">
                  ⏱ {{ product()!.endTime | auctionTimer }}
                </p>
              </div>

              <!-- Chỉ Số Giá Hiện Tại & Bước Giá Tối Thiểu -->
              <div [class]="product()!.auctionType === 'BUY_NOW' ? 'grid grid-cols-1 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 text-center' : 'grid grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80'">
                <div>
                  <p class="text-[10px] uppercase font-semibold text-slate-500">
                    {{ product()!.auctionType === 'BUY_NOW' ? langService.t('product.fixedBuyNowPrice') : langService.t('product.currentBidPrice') }}
                  </p>
                  <p class="text-xl font-black text-emerald-400 font-mono">
                    {{ (product()!.auctionType === 'BUY_NOW' && product()!.buyNowPrice ? product()!.buyNowPrice : effectiveCurrentPrice()) | currencyVnd }}
                  </p>
                </div>

                @if (product()!.auctionType !== 'BUY_NOW') {
                  <div>
                    <p class="text-[10px] uppercase font-semibold text-slate-500">{{ langService.t('product.minBidStepLabel') }}</p>
                    <p class="text-sm font-bold text-indigo-300 font-mono">
                      {{ effectiveBidStep() | currencyVnd }}
                    </p>
                  </div>
                }
              </div>

              <!-- Form Thao Tác Đặt Giá / Mua Ngay / Banner Người Thắng Cuộc -->
              @if (isEnded()) {
                <div class="p-5 bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-yellow-500/10 border border-amber-500/40 rounded-2xl text-center space-y-2 shadow-xl">
                  <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 text-2xl shadow-inner">
                    🏆
                  </div>
                  <h3 class="text-base font-extrabold text-amber-300">{{ langService.t('product.endedTitle') }}</h3>
                  @if (bidHistory().length > 0) {
                    <div class="text-xs text-slate-300 space-y-1 pt-2 border-t border-amber-500/20">
                      <p>
                        {{ langService.t('product.endedWinner') }} <strong class="text-emerald-400 font-mono text-sm">{{ bidHistory()[0].maskedBidderName }}</strong>
                      </p>
                      <p>
                        {{ langService.t('product.endedWinningPrice') }} <strong class="text-emerald-400 font-mono text-sm">{{ (product()!.currentPrice || bidHistory()[0].bidAmount) | currencyVnd }}</strong>
                      </p>
                    </div>
                  } @else {
                    <p class="text-xs text-slate-400 pt-1">{{ langService.t('product.endedNoBids') }}</p>
                  }
                </div>
              } @else if (isOwnerSeller()) {
                <div class="p-4 bg-indigo-950/60 border border-indigo-800/80 rounded-2xl text-center">
                  <p class="text-xs font-bold text-indigo-300 flex items-center justify-center gap-1.5">
                    {{ langService.t('product.ownerNotice') }}
                  </p>
                </div>
              } @else if (product()!.auctionStatus === 'RUNNING') {
                <div class="space-y-4 pt-2">
                  <!-- Guest Banner Prompt if not logged in -->
                  @if (!authService.isLoggedIn()) {
                    <div class="p-3 bg-indigo-950/60 border border-indigo-800/80 rounded-2xl text-center text-xs text-indigo-300 space-y-1">
                      <p class="font-bold">🔒 Đang xem ở chế độ Khách vãng lai</p>
                      <p class="text-[11px] text-slate-400">Đăng nhập để đặt giá cạnh tranh & mua ngay</p>
                    </div>
                  }

                  <div class="space-y-3">
                    <label class="block text-xs font-semibold text-slate-300">
                      {{ langService.t('product.inputBidLabel') }} {{ minNextBid() | currencyVnd }})
                    </label>
                    <input
                      type="number"
                      [(ngModel)]="bidAmount"
                      (input)="isUserEditingBid = true"
                      [min]="minNextBid()"
                      class="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-emerald-400 font-bold focus:outline-none focus:border-indigo-500"
                    />

                    <div class="space-y-1">
                      <label class="block text-[11px] font-semibold text-slate-400">
                        {{ langService.t('product.inputAutoBidLabel') }}
                      </label>
                      <input
                        type="number"
                        [(ngModel)]="maxAutoBidAmount"
                        [placeholder]="langService.t('product.autoBidPlaceholder')"
                        class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-indigo-300 font-mono focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <button
                      (click)="handleBidAction()"
                      [disabled]="biddingActionLoading()"
                      class="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                    >
                      <span>🚀 {{ langService.t('product.placeBidBtn') }}</span>
                    </button>
                  </div>

                  @if (product()!.auctionType === 'BUY_NOW' && product()!.buyNowPrice) {
                    <div class="pt-4 border-t border-slate-800 space-y-2">
                      <p class="text-xs text-slate-400 text-center">{{ langService.t('product.buyNowOrLabel') }}</p>
                      <button
                        (click)="handleBuyNowAction()"
                        [disabled]="biddingActionLoading()"
                        class="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                      >
                        <span>⚡ {{ langService.t('product.buyNowBtn') }} {{ product()!.buyNowPrice! | currencyVnd }}</span>
                      </button>
                    </div>
                  }
                </div>
              } @else {
                <div class="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center text-xs text-slate-400">
                  Status: <strong>{{ product()!.auctionStatus }}</strong>
                </div>
              }
            </div>

            <!-- Bảng Lịch Sử Đặt Giá Công Khai -->
            <div class="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-bold text-white flex items-center gap-2">
                  <span>📜</span> {{ langService.t('product.historyTitle') }}
                </h3>
                <button (click)="fetchBidHistory()" class="text-xs text-indigo-400 hover:underline">{{ langService.t('product.refresh') }}</button>
              </div>

              @if (bidHistory().length === 0) {
                <p class="text-xs text-slate-500 py-4 text-center">{{ langService.t('product.noHistory') }}</p>
              } @else {
                <div class="space-y-2 max-h-60 overflow-y-auto pr-1">
                  @for (bid of bidHistory(); track bid.bidId) {
                    <div class="flex items-center justify-between p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs">
                      <div>
                        <span class="font-semibold text-slate-200">{{ bid.maskedBidderName }}</span>
                        @if (bid.autoBid) {
                          <span class="ml-1.5 px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px]">Auto-Bid</span>
                        }
                      </div>
                      <span class="font-bold text-emerald-400 font-mono">{{ bid.bidAmount | currencyVnd }}</span>
                    </div>
                  }
                </div>
              }
            </div>
          </div>

        </div>
      </div>
    }
  `
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private marketplaceService = inject(PublicMarketplaceService);
  private biddingService = inject(BiddingService);
  authService = inject(AuthService);
  langService = inject(LanguageService);
  private toastService = inject(ToastService);

  product = signal<ProductResponse | null>(null);
  bidHistory = signal<BidHistoryResponse[]>([]);
  activeImage = signal<string>('');
  loading = signal<boolean>(true);
  biddingActionLoading = signal<boolean>(false);
  showAuthModal = signal<boolean>(false);

  bidAmount: number = 0;
  maxAutoBidAmount?: number;
  isUserEditingBid: boolean = false;
  nowSignal = signal<number>(Date.now());
  
  private pollTimer: any = null;
  private clockTicker: any = null;

  attributeEntries = computed(() => {
    const attrs = this.product()?.attributes;
    if (!attrs || typeof attrs !== 'object') return [];
    return Object.entries(attrs).map(([key, value]) => ({ key, value: String(value) }));
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadProductDetail(id, true);
      
      this.pollTimer = setInterval(() => {
        this.loadProductDetail(id, false);
      }, 1500);

      this.clockTicker = setInterval(() => {
        this.nowSignal.set(Date.now());
      }, 1000);
    }
  }

  ngOnDestroy(): void {
    if (this.pollTimer) clearInterval(this.pollTimer);
    if (this.clockTicker) clearInterval(this.clockTicker);
  }

  isOwnerSeller(): boolean {
    const currentUser = this.authService.currentUser();
    return !!this.product() && !!currentUser && this.product()!.sellerId === currentUser.id;
  }

  isEnded(): boolean {
    if (!this.product()) return false;
    if (this.product()!.auctionStatus === 'ENDED') return true;
    if (this.product()!.endTime) {
      return new Date(this.product()!.endTime).getTime() <= Date.now();
    }
    return false;
  }

  effectiveCurrentPrice(): number {
    if (!this.product()) return 0;
    const pPrice = this.product()!.currentPrice || this.product()!.startPrice || 0;
    const topBidPrice = this.bidHistory().length > 0 ? this.bidHistory()[0].bidAmount : 0;
    return Math.max(pPrice, topBidPrice);
  }

  calculateDynamicBidStep(price: number): number {
    if (price < 1000000) return 10000;
    if (price <= 10000000) return 100000;
    return 500000;
  }

  effectiveBidStep(): number {
    if (!this.product()) return 0;
    const current = this.effectiveCurrentPrice();
    const dynamicStep = this.calculateDynamicBidStep(current);
    return Math.max(this.product()!.bidStep || 0, dynamicStep);
  }

  minNextBid(): number {
    if (!this.product()) return 0;
    return this.effectiveCurrentPrice() + this.effectiveBidStep();
  }

  loadProductDetail(id: number, isInitial = false): void {
    if (isInitial) this.loading.set(true);
    this.marketplaceService.getProductById(id).subscribe({
      next: (res) => {
        this.product.set(res);
        if (isInitial && res.images && res.images.length > 0) {
          this.activeImage.set(res.images[0].imageUrl);
        }
        this.fetchBidHistory();
        if (isInitial) this.loading.set(false);
      },
      error: () => {
        if (isInitial) this.loading.set(false);
        if (this.pollTimer) {
          clearInterval(this.pollTimer);
          this.pollTimer = null;
        }
      }
    });
  }

  fetchBidHistory(): void {
    if (!this.product()) return;
    this.biddingService.getBidHistory(this.product()!.auctionId).subscribe({
      next: (res) => {
        this.bidHistory.set(res);
        const minBid = this.minNextBid();
        if (!this.isUserEditingBid && (!this.bidAmount || this.bidAmount < minBid)) {
          this.bidAmount = minBid;
        }
      }
    });
  }

  handleBidAction(): void {
    if (!this.authService.isLoggedIn()) {
      this.showAuthModal.set(true);
      return;
    }
    this.submitBid();
  }

  handleBuyNowAction(): void {
    if (!this.authService.isLoggedIn()) {
      this.showAuthModal.set(true);
      return;
    }
    this.submitBuyNow();
  }

  onAuthSuccess(): void {
    this.toastService.showSuccess('Đã xác thực', 'Bây giờ bạn có thể thực hiện thao tác thầu!');
  }

  submitBid(): void {
    if (!this.product()) return;
    if (this.isOwnerSeller()) {
      this.toastService.showWarn('Không hợp lệ', 'Bạn không được đặt giá sản phẩm của chính mình');
      return;
    }
    if (this.bidAmount < this.minNextBid()) {
      this.toastService.showWarn('Mức giá quá thấp', `Vui lòng nhập giá tối thiểu ${this.minNextBid().toLocaleString()} VNĐ`);
      return;
    }

    this.biddingActionLoading.set(true);
    const bidderId = this.authService.currentUser()!.id;

    this.biddingService.placeBid(this.product()!.auctionId, bidderId, {
      bidAmount: this.bidAmount,
      maxAutoBidAmount: this.maxAutoBidAmount
    }).subscribe({
      next: (res) => {
        this.biddingActionLoading.set(false);
        this.isUserEditingBid = false;
        this.toastService.showSuccess('Thành công', 'Đặt giá cạnh tranh thành công!');
        this.loadProductDetail(this.product()!.productId, false);
      },
      error: () => {
        this.biddingActionLoading.set(false);
      }
    });
  }

  submitBuyNow(): void {
    if (!this.product()) return;
    if (this.isOwnerSeller()) {
      this.toastService.showWarn('Không hợp lệ', 'Bạn không được mua sản phẩm của chính mình');
      return;
    }

    this.biddingActionLoading.set(true);
    const bidderId = this.authService.currentUser()!.id;

    this.biddingService.buyNow(this.product()!.auctionId, bidderId).subscribe({
      next: (res) => {
        this.biddingActionLoading.set(false);
        this.toastService.showSuccess('Chúc mừng!', 'Bạn đã Mua Ngay sản phẩm thành công!');
        this.loadProductDetail(this.product()!.productId, false);
      },
      error: () => {
        this.biddingActionLoading.set(false);
      }
    });
  }
}
