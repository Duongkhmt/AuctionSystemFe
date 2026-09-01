import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../../core/services/order.service';
import { UserSessionService } from '../../../../core/auth/user-session.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { LanguageService } from '../../../../core/services/language.service';
import { WonAuctionResponse, OrderStatus } from '../../../../shared/models/order.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { CheckoutModalComponent } from '../../components/checkout-modal/checkout-modal.component';
import { CurrencyVndPipe } from '../../../../shared/pipes/currency-vnd.pipe';

/**
 * ====================================================================================
 * 🏆 WON AUCTIONS COMPONENT (Trang Sản Phẩm Đã Thắng - Giao Diện Gold Luxury)
 * ====================================================================================
 */
@Component({
  selector: 'app-won-auctions',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent, CheckoutModalComponent, CurrencyVndPipe],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto px-4 py-4">
      
      <!-- Sub-Header View Switcher Bar -->
      <div class="flex items-center gap-3">
        <a
          routerLink="/my-bids"
          class="px-5 py-2.5 rounded-xl text-xs font-black bg-[#c5a059] text-slate-950 shadow-lg shadow-[#c5a059]/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>{{ langService.translate('nav.wonProducts') }}</span>
        </a>

        <a
          routerLink="/seller"
          class="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900/60 text-slate-400 border border-emerald-900/40 hover:text-white hover:border-[#c5a059] transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>{{ langService.translate('nav.myListedProducts') }}</span>
        </a>
      </div>

      <!-- Header Banner Tiêu Đề -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-emerald-900/30">
        <div>
          <span class="text-[11px] font-bold tracking-widest text-[#c5a059] uppercase">
            {{ langService.translate('account.userHeader') }} {{ (userSession.currentUser()?.name || 'VĂN DƯƠNG') | uppercase }}
          </span>
          <h1 class="text-3xl font-serif font-bold text-white tracking-tight mt-1">
            {{ langService.translate('account.wonLotsTitle') }}
          </h1>
          <p class="text-xs text-slate-400 mt-1">
            {{ langService.translate('account.wonLotsSub') }}
          </p>
        </div>

        <a
          routerLink="/"
          class="text-xs text-slate-300 hover:text-[#c5a059] transition-colors flex items-center gap-1 font-medium"
        >
          <span>{{ langService.translate('account.continueBidding') }}</span>
        </a>
      </div>

      <!-- Bộ Lọc Thanh Tab Trạng Thái -->
      <div class="flex items-center gap-6 overflow-x-auto border-b border-emerald-900/40 text-xs pb-1">
        <button
          (click)="activeTab.set('ALL')"
          [class]="activeTab() === 'ALL' ? 'border-b-2 border-[#c5a059] text-[#c5a059] font-bold py-2' : 'text-slate-400 hover:text-slate-200 py-2'"
          class="transition-all whitespace-nowrap flex items-center gap-1.5"
        >
          <span>{{ langService.translate('account.tabAll') }}</span>
          <span class="px-1.5 py-0.5 rounded bg-slate-900 text-[10px]">{{ orders().length }}</span>
        </button>

        <button
          (click)="activeTab.set('UNPAID')"
          [class]="activeTab() === 'UNPAID' ? 'border-b-2 border-[#c5a059] text-[#c5a059] font-bold py-2' : 'text-slate-400 hover:text-slate-200 py-2'"
          class="transition-all whitespace-nowrap flex items-center gap-1.5"
        >
          <span>{{ langService.translate('account.tabUnpaid') }}</span>
          <span class="px-1.5 py-0.5 rounded bg-slate-900 text-[10px]">{{ countByStatus('UNPAID') }}</span>
        </button>

        <button
          (click)="activeTab.set('PAID')"
          [class]="activeTab() === 'PAID' ? 'border-b-2 border-[#c5a059] text-[#c5a059] font-bold py-2' : 'text-slate-400 hover:text-slate-200 py-2'"
          class="transition-all whitespace-nowrap flex items-center gap-1.5"
        >
          <span>{{ langService.translate('account.tabPaid') }}</span>
          <span class="px-1.5 py-0.5 rounded bg-slate-900 text-[10px]">{{ countByStatus('PAID') }}</span>
        </button>

        <button
          (click)="activeTab.set('SHIPPING')"
          [class]="activeTab() === 'SHIPPING' ? 'border-b-2 border-[#c5a059] text-[#c5a059] font-bold py-2' : 'text-slate-400 hover:text-slate-200 py-2'"
          class="transition-all whitespace-nowrap flex items-center gap-1.5"
        >
          <span>{{ langService.translate('account.tabShipping') }}</span>
          <span class="px-1.5 py-0.5 rounded bg-slate-900 text-[10px]">{{ countByStatus('SHIPPING') }}</span>
        </button>

        <button
          (click)="activeTab.set('COMPLETED')"
          [class]="activeTab() === 'COMPLETED' ? 'border-b-2 border-[#c5a059] text-[#c5a059] font-bold py-2' : 'text-slate-400 hover:text-slate-200 py-2'"
          class="transition-all whitespace-nowrap flex items-center gap-1.5"
        >
          <span>{{ langService.translate('account.tabCompleted') }}</span>
          <span class="px-1.5 py-0.5 rounded bg-slate-900 text-[10px]">{{ countByStatus('COMPLETED') }}</span>
        </button>
      </div>

      <!-- Trạng Thái Đang Tải Dữ Liệu -->
      @if (loading()) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          @for (i of [1,2,3]; track i) {
            <div class="h-80 rounded-2xl bg-slate-900/40 border border-emerald-900/30 animate-pulse"></div>
          }
        </div>
      } @else if (filteredOrders().length === 0) {
        <!-- Khung Hiển Thị Rỗng Chuẩn Mockup -->
        <div class="py-24 bg-[#050b08]/80 border border-emerald-900/30 rounded-2xl text-center flex flex-col items-center justify-center p-8 space-y-4 shadow-2xl">
          
          <div class="w-16 h-16 rotate-45 border-2 border-[#c5a059]/60 bg-[#c5a059]/10 flex items-center justify-center mb-2 shadow-inner">
            <span class="-rotate-45 text-[#c5a059] font-serif font-black text-xl">0</span>
          </div>

          <h3 class="text-lg font-serif font-bold text-white tracking-wide">
            {{ langService.translate('account.emptyWonTitle') }}
          </h3>

          <p class="text-xs text-slate-400 max-w-md leading-relaxed">
            {{ langService.translate('account.emptyWonSub') }}
          </p>

          <a
            routerLink="/"
            class="mt-3 px-6 py-3 bg-[#c5a059] hover:bg-[#d4af66] text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-[#c5a059]/20 transition-all"
          >
            {{ langService.translate('account.viewActiveLots') }}
          </a>
        </div>
      } @else {
        <!-- Grid Danh Sách Đơn Hàng Trúng Thầu -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          @for (item of filteredOrders(); track item.orderId) {
            <div class="group bg-[#07120d] border border-emerald-900/40 hover:border-[#c5a059]/60 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between">
              
              <div>
                <div class="relative h-48 bg-slate-950 overflow-hidden">
                  @if (item.productImage) {
                    <img [src]="item.productImage" [alt]="item.productTitle" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  } @else {
                    <div class="w-full h-full flex items-center justify-center text-slate-700 text-4xl">🖼</div>
                  }

                  <div class="absolute top-3 left-3">
                    <app-status-badge [status]="item.status" />
                  </div>

                  <div class="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-[#c5a059] border border-emerald-900/50">
                    #ORD-{{ item.orderId }}
                  </div>
                </div>

                <div class="p-5 space-y-3">
                  <div class="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Mã SP: #{{ item.productId }}</span>
                    <span>Mã Thầu: #{{ item.auctionId }}</span>
                  </div>

                  <h3 class="font-serif font-bold text-base text-white line-clamp-1">
                    {{ item.productTitle }}
                  </h3>

                  <div class="p-3 bg-[#050b08] rounded-xl border border-emerald-900/40 flex items-center justify-between">
                    <div>
                      <p class="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">{{ langService.translate('won.winningPrice') }}</p>
                      <p class="text-lg font-black text-[#c5a059] font-mono">
                        {{ item.winningPrice | currencyVnd }}
                      </p>
                    </div>
                    <span class="text-xs font-bold text-emerald-400">🏆 WINNER</span>
                  </div>

                  @if (item.shippingAddress) {
                    <div class="p-3 bg-emerald-950/20 border border-emerald-800/30 rounded-xl space-y-1 text-xs text-slate-300">
                      <p class="text-[10px] text-[#c5a059] font-bold flex items-center gap-1">📍 {{ langService.translate('checkout.shippingAddress') }}:</p>
                      <p class="line-clamp-2 text-slate-300">{{ item.shippingAddress }} (SĐT: {{ item.phoneNumber }})</p>
                    </div>
                  }

                  @if (item.courierName && item.trackingNumber) {
                    <div class="p-3 bg-blue-950/30 border border-blue-800/30 rounded-xl space-y-1 text-xs text-blue-200">
                      <p class="text-[10px] text-blue-300 font-bold flex items-center gap-1">🚚 {{ langService.translate('won.shippingInfo') }}</p>
                      <p><strong>{{ item.courierName }}:</strong> <span class="font-mono text-[#c5a059] font-semibold">{{ item.trackingNumber }}</span></p>
                    </div>
                  }
                </div>
              </div>

              <div class="p-5 pt-0">
                @if (item.status === 'UNPAID') {
                  <button
                    (click)="selectedOrderForCheckout.set(item)"
                    class="w-full py-3 px-4 bg-[#c5a059] hover:bg-[#d4af66] text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-[#c5a059]/20 transition-all flex items-center justify-center gap-2"
                  >
                    {{ langService.translate('won.checkoutBtn') }}
                  </button>
                } @else if (item.status === 'SHIPPING') {
                  <button
                    (click)="confirmReceived(item.orderId)"
                    [disabled]="actionLoading()"
                    class="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    {{ langService.translate('won.confirmReceivedBtn') }}
                  </button>
                } @else if (item.status === 'PAID') {
                  <div class="p-3 bg-[#050b08] rounded-xl border border-emerald-900/40 text-center text-xs text-[#c5a059] font-semibold flex items-center justify-center gap-2">
                    <span>⏳</span> In transit / Pending shipment...
                  </div>
                } @else if (item.status === 'COMPLETED') {
                  <div class="p-3 bg-[#050b08] rounded-xl border border-emerald-900/40 text-center text-xs text-slate-400 font-semibold flex items-center justify-center gap-2">
                    <span>🎉</span> Order completed!
                  </div>
                }
              </div>

            </div>
          }
        </div>
      }

      <app-checkout-modal
        [order]="selectedOrderForCheckout()"
        (close)="selectedOrderForCheckout.set(null)"
        (checkoutSuccess)="onCheckoutSuccess()"
      />
    </div>
  `
})
export class WonAuctionsComponent implements OnInit {
  private orderService = inject(OrderService);
  authService = inject(AuthService);
  userSession = inject(UserSessionService);
  langService = inject(LanguageService);
  private toastService = inject(ToastService);

  orders = signal<WonAuctionResponse[]>([]);
  loading = signal<boolean>(true);
  actionLoading = signal<boolean>(false);
  activeTab = signal<string>('ALL');
  selectedOrderForCheckout = signal<WonAuctionResponse | null>(null);

  filteredOrders = computed(() => {
    const tab = this.activeTab();
    if (tab === 'ALL') return this.orders();
    return this.orders().filter((o) => o.status === tab);
  });

  ngOnInit(): void {
    this.fetchWonAuctions();
  }

  fetchWonAuctions(): void {
    this.loading.set(true);
    this.orderService.getWonAuctions().subscribe({
      next: (res) => {
        this.orders.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        const apiMsg = err.error?.message || err.error?.detail || err.message || 'Không thể nạp đơn hàng trúng thầu';
        this.toastService.showError('Lỗi nạp dữ liệu', apiMsg);
      }
    });
  }

  countByStatus(status: OrderStatus): number {
    return this.orders().filter((o) => o.status === status).length;
  }

  onCheckoutSuccess(): void {
    this.toastService.showSuccess('Thanh toán thành công', 'Đơn hàng đã cập nhật trạng thái Đã Thanh Toán');
    this.fetchWonAuctions();
  }

  confirmReceived(orderId: number): void {
    if (!confirm('Bạn xác nhận đã nhận được hàng đúng mô tả và hoàn tất đơn hàng?')) return;
    this.actionLoading.set(true);

    this.orderService.confirmReceived(orderId).subscribe({
      next: () => {
        this.actionLoading.set(false);
        this.toastService.showSuccess('Đã Hoàn Tất!', 'Cảm ơn bạn đã xác nhận nhận hàng!');
        this.fetchWonAuctions();
      },
      error: (err) => {
        this.actionLoading.set(false);
        console.error('Error confirming received:', err);
        const apiMsg = err.error?.message || err.error?.detail || err.message || 'Xác nhận nhận hàng thất bại!';
        this.toastService.showError('Thao tác thất bại', apiMsg);
      }
    });
  }
}
