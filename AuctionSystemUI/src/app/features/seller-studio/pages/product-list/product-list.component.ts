import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SellerApiService } from '../../services/seller-api.service';
import { UserSessionService } from '../../../../core/auth/user-session.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ProductResponse } from '../../../../shared/models/product.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { ProductDetailModalComponent } from '../../../../shared/components/product-detail-modal/product-detail-modal.component';
import { CurrencyVndPipe } from '../../../../shared/pipes/currency-vnd.pipe';

@Component({
  selector: 'app-seller-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent, ProductDetailModalComponent, CurrencyVndPipe],
  template: `
    <div class="space-y-8">
      <!-- Top Title Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-slate-800 backdrop-blur-md">
        <div>
          <h1 class="text-2xl font-black text-white tracking-tight">Quản Lý Sản Phẩm Đã Đăng</h1>
          <p class="text-xs text-slate-400 mt-1">
            Kênh quản lý dành riêng cho Seller: <strong class="text-indigo-400">{{ userSession.currentUser().name }}</strong> (ID: #{{ userSession.currentUser().id }})
          </p>
        </div>

        <a
          routerLink="/seller/create"
          class="py-3 px-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
        >
          <span>➕ Đăng Bài Mới</span>
        </a>
      </div>

      <!-- Loading State -->
      @if (loading()) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (i of [1,2,3]; track i) {
            <div class="h-96 rounded-3xl bg-slate-900/40 border border-slate-800 animate-pulse"></div>
          }
        </div>
      } @else if (products().length === 0) {
        <div class="text-center py-16 bg-slate-900/30 rounded-3xl border border-slate-800 p-8">
          <div class="text-4xl mb-3">🏪</div>
          <h3 class="text-base font-bold text-slate-300">Bạn chưa đăng sản phẩm nào</h3>
          <p class="text-xs text-slate-500 mt-1">Bấm nút "Đăng Bài Mới" để bắt đầu xuất bản bài thầu.</p>
        </div>
      } @else {
        <!-- Grid Layout: 3 Cards Per Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (item of sortedProducts(); track item.productId) {
            <div class="group bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-3xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between">
              
              <div>
                <!-- Square/Aspect Ratio Image Header (Click to Preview Modal) -->
                <div (click)="previewProduct.set(item)" class="block relative h-56 bg-slate-950 overflow-hidden cursor-pointer">
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

                  <!-- Floating Overlay on Hover -->
                  <div class="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold text-white gap-1.5">
                    <span>👁️ Bấm xem chi tiết</span>
                  </div>

                  <!-- Floating Badge & Auction Type -->
                  <div class="absolute top-3 left-3 flex items-center gap-2">
                    <app-status-badge [status]="item.auctionStatus || item.status" [endTime]="item.endTime" />
                  </div>

                  <div class="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-indigo-300 border border-slate-800">
                    {{ item.auctionType }}
                  </div>
                </div>

                <!-- Card Body -->
                <div class="p-5 space-y-3">
                  <div class="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Mã SP: #{{ item.productId }}</span>
                    <span>Mã Thầu: #{{ item.auctionId }}</span>
                  </div>

                  <div (click)="previewProduct.set(item)" class="cursor-pointer">
                    <h3 class="font-bold text-base text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {{ item.title }}
                    </h3>
                  </div>

                  <p class="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {{ item.description }}
                  </p>

                  @if (item.rejectionReason) {
                    <div class="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300">
                      <strong>Lý do từ chối:</strong> {{ item.rejectionReason }}
                    </div>
                  }

                  <!-- Price & Step Info -->
                  <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <p class="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Giá hiện tại</p>
                      <p class="text-lg font-black text-emerald-400 font-mono">
                        {{ (item.currentPrice || item.startPrice) | currencyVnd }}
                      </p>
                    </div>
                    <div class="text-right">
                      <p class="text-[10px] text-slate-500">Bước giá</p>
                      <p class="text-xs font-semibold text-slate-300 font-mono">
                        {{ item.bidStep | currencyVnd }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Card Action Footer -->
              <div class="p-5 pt-0 border-t border-slate-800/50 mt-2 flex items-center justify-between gap-2">
                <!-- Nút Sửa -->
                <a
                  [routerLink]="['/seller/edit', item.productId]"
                  class="py-2 px-3 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold transition-all text-center"
                >
                  ✏️ Sửa
                </a>

                <!-- Nút Hủy Phiên -->
                @if (item.auctionStatus === 'PENDING_APPROVAL' || item.auctionStatus === 'SCHEDULED' || item.auctionStatus === 'RUNNING') {
                  <button
                    (click)="cancelAuction(item.productId)"
                    class="py-2 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold transition-all text-center"
                  >
                    Hủy Phiên
                  </button>
                }

                <!-- Nút Đăng Lại: Chỉ dành cho bài EXPIRED (Hết hạn 30 ngày) -->
                @if (isRelistable(item)) {
                  <button
                    (click)="relistAuction(item.auctionId)"
                    class="flex-1 py-2 px-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-semibold transition-all text-center"
                  >
                    🔄 Đăng Lại (30d)
                  </button>
                }

                <!-- Nút Xóa Bài -->
                <button
                  (click)="deleteProduct(item.productId)"
                  class="py-2 px-3 bg-rose-500/10 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 rounded-xl text-xs font-semibold transition-all text-center"
                >
                  Xóa Bài
                </button>
              </div>

            </div>
          }
        </div>
      }

      <!-- Shared Product Detail Modal -->
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
  userSession = inject(UserSessionService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  products = signal<ProductResponse[]>([]);
  loading = signal<boolean>(true);
  previewProduct = signal<ProductResponse | null>(null);

  // Sắp xếp ưu tiên: PENDING -> REJECTED -> RUNNING -> SCHEDULED -> ENDED / EXPIRED / CANCELLED
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
    const sellerId = this.userSession.currentUser().id;
    this.loading.set(true);
    this.sellerService.getSellerProducts(sellerId).subscribe({
      next: (res) => {
        this.products.set(res);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  isRelistable(item: ProductResponse): boolean {
    // Nút Đăng lại CHỈ dành cho sản phẩm ở trạng thái EXPIRED (Hết hạn 30 ngày)
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
    const sellerId = this.userSession.currentUser().id;
    this.sellerService.cancelAuction(sellerId, productId).subscribe({
      next: () => {
        this.toastService.showSuccess('Thành Công', 'Đã hủy phiên bài đăng!');
        this.loadSellerProducts();
      }
    });
  }

  relistAuction(auctionId: number): void {
    const sellerId = this.userSession.currentUser().id;
    this.sellerService.relistAuction(sellerId, auctionId).subscribe({
      next: () => {
        this.toastService.showSuccess('Thành Công', 'Đã khôi phục đăng lại phiên trong 30 ngày!');
        this.loadSellerProducts();
      }
    });
  }

  deleteProduct(productId: number): void {
    if (!confirm('Bạn có chắc chắn muốn xóa vĩnh viễn bài đăng này?')) return;
    const sellerId = this.userSession.currentUser().id;
    this.sellerService.deleteProduct(sellerId, productId).subscribe({
      next: () => {
        this.toastService.showSuccess('Đã Xóa', 'Sản phẩm đã bị xóa khỏi hệ thống');
        this.loadSellerProducts();
      }
    });
  }
}
