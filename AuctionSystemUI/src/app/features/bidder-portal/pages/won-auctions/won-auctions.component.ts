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
import { WalletService } from '../../../../core/services/wallet.service';

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
      
      <!-- Sub-Header View Switcher Bar (Tài Khoản Của Tôi) -->
      <div class="flex items-center gap-3 border-b border-emerald-950/80 pb-4">
        <a
          routerLink="/my-bids/won"
          class="px-5 py-2.5 rounded-xl text-xs font-black bg-[#c5a059] text-slate-950 shadow-lg shadow-[#c5a059]/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>🏆 {{ langService.translate('nav.wonProducts') }}</span>
        </a>

        <a
          routerLink="/my-bids/wallet"
          class="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900/60 text-slate-400 border border-emerald-900/40 hover:text-white hover:border-emerald-500 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>👛 Ví Ảo & Giao Dịch</span>
        </a>

        <a
          routerLink="/seller"
          class="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900/60 text-slate-400 border border-emerald-900/40 hover:text-white hover:border-[#c5a059] transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>📦 Đơn Hàng Đã Bán</span>
        </a>
      </div>

      <!-- Header Banner Tiêu Đề & Thẻ Thông Tin Ví / Gậy Phạt -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950 border border-emerald-900/40 shadow-xl backdrop-blur-md">
        <div>
          <span class="text-[11px] font-bold tracking-widest text-[#c5a059] uppercase">
            {{ langService.translate('account.userHeader') }} {{ (userSession.currentUser()?.name || 'VĂN DƯƠNG') | uppercase }}
          </span>
          <h1 class="text-2xl font-serif font-bold text-white tracking-tight mt-1">
            {{ langService.translate('account.wonLotsTitle') }}
          </h1>
          <p class="text-xs text-slate-400 mt-1">
            {{ langService.translate('account.wonLotsSub') }}
          </p>
        </div>

        <!-- Thẻ Thống Kê Nhanh Ví Ảo & Gậy Phạt Vi Phạm -->
        <div class="flex items-center gap-3">
          <a
            routerLink="/my-bids/wallet"
            class="px-4 py-2.5 rounded-xl bg-slate-950 border border-emerald-500/30 hover:border-emerald-400 transition-all flex items-center gap-2.5 shadow-md active:scale-95 group"
          >
            <div class="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-amber-400 text-sm">
              👛
            </div>
            <div>
              <p class="text-[10px] text-slate-400 uppercase font-semibold">Số Dư Ví Ảo</p>
              <p class="text-sm font-black text-emerald-400 font-mono">
                {{ (walletService.wallet()?.balance || 0) | currencyVnd }}
              </p>
            </div>
          </a>

          <div
            class="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5 shadow-md"
            title="Số gậy vi phạm quy chế đấu giá (tối đa 3 gậy trước khi khóa tài khoản)"
          >
            <div class="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-sm">
              ⚠️
            </div>
            <div>
              <p class="text-[10px] text-slate-400 uppercase font-semibold">Vi Phạt Cọc</p>
              <p class="text-sm font-black text-amber-400 font-mono">0/3 Gậy</p>
            </div>
          </div>
        </div>
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

                  <!-- Escrow Order Status Stepper -->
                  <div class="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-2">
                    <div class="flex items-center justify-between text-[10px] font-semibold">
                      <span class="text-amber-400">Tiến trình Escrow:</span>
                      <span class="font-mono text-slate-400">
                        {{ item.status === 'UNPAID' ? 'Bước 1/4' : item.status === 'PAID' ? 'Bước 2/4' : item.status === 'SHIPPING' ? 'Bước 3/4' : 'Hoàn tất' }}
                      </span>
                    </div>

                    <div class="flex items-center gap-1">
                      <div [class]="item.status === 'UNPAID' || item.status === 'PAID' || item.status === 'SHIPPING' || item.status === 'COMPLETED' ? 'bg-amber-400' : 'bg-slate-800'" class="h-1.5 flex-1 rounded-full"></div>
                      <div [class]="item.status === 'PAID' || item.status === 'SHIPPING' || item.status === 'COMPLETED' ? 'bg-amber-400' : 'bg-slate-800'" class="h-1.5 flex-1 rounded-full"></div>
                      <div [class]="item.status === 'SHIPPING' || item.status === 'COMPLETED' ? 'bg-amber-400' : 'bg-slate-800'" class="h-1.5 flex-1 rounded-full"></div>
                      <div [class]="item.status === 'COMPLETED' ? 'bg-emerald-400' : 'bg-slate-800'" class="h-1.5 flex-1 rounded-full"></div>
                    </div>

                    <div class="text-[11px] text-slate-300">
                      @if (item.status === 'UNPAID') {
                        <span class="text-rose-400">⚠️ Chưa thanh toán. Vui lòng thanh toán trước khi quá hạn!</span>
                      } @else if (item.status === 'PAID') {
                        <span class="text-amber-300">🔒 Tiền đã gửi Escrow. Chờ người bán gửi hàng.</span>
                      } @else if (item.status === 'SHIPPING') {
                        <span class="text-sky-300">🚚 Hàng đang vận chuyển. Nhớ bấm xác nhận khi nhận được!</span>
                      } @else if (item.status === 'COMPLETED') {
                        <span class="text-emerald-400">✅ Đã giải ngân Escrow cho người bán. Giao dịch thành công!</span>
                      }
                    </div>
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
                    ✅ {{ langService.translate('won.confirmReceivedBtn') }} (Giải ngân Escrow)
                  </button>
                } @else if (item.status === 'PAID') {
                  <div class="p-3 bg-[#050b08] rounded-xl border border-emerald-900/40 text-center text-xs text-[#c5a059] font-semibold flex items-center justify-center gap-2">
                    <span>⏳</span> Tiền giữ Escrow - Đang chờ người bán giao hàng...
                  </div>
                } @else if (item.status === 'COMPLETED') {
                  <div class="p-3 bg-[#050b08] rounded-xl border border-emerald-900/40 text-center text-xs text-emerald-400 font-semibold flex items-center justify-center gap-2">
                    <span>🎉</span> Đơn hàng hoàn tất!
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
  walletService = inject(WalletService);
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
    this.walletService.getWallet().subscribe({ next: () => {}, error: () => {} });
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
