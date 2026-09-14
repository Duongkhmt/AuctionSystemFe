import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { OrderService } from '../../../../core/services/order.service';
import { UserSessionService } from '../../../../core/auth/user-session.service';
import { ToastService } from '../../../../core/services/toast.service';
import { LanguageService } from '../../../../core/services/language.service';
import { SellerOrderResponse, OrderStatus } from '../../../../shared/models/order.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { ShipModalComponent } from '../../components/ship-modal/ship-modal.component';
import { CurrencyVndPipe } from '../../../../shared/pipes/currency-vnd.pipe';

@Component({
  selector: 'app-seller-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, StatusBadgeComponent, ShipModalComponent, CurrencyVndPipe],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto px-4 py-4">
      
      <!-- Sub-Header View Switcher Bar -->
      <div class="flex items-center gap-3">
        <a
          routerLink="/my-bids"
          class="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900/60 text-slate-400 border border-emerald-900/40 hover:text-white hover:border-[#c5a059] transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Xem: {{ langService.translate('nav.wonAuctions') }}</span>
        </a>

        <a
          routerLink="/seller"
          class="px-5 py-2.5 rounded-xl text-xs font-black bg-[#c5a059] text-slate-950 shadow-lg shadow-[#c5a059]/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Xem: {{ langService.translate('nav.sellerStudio') }}</span>
        </a>
      </div>

      <!-- Header Banner Tiêu Đề -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-emerald-900/30">
        <div>
          <span class="text-[11px] font-bold tracking-widest text-[#c5a059] uppercase">
            — SẢN PHẨM ĐÃ ĐĂNG
          </span>
          <h1 class="text-3xl font-serif font-bold text-white tracking-tight mt-1">
            Quản lý đơn hàng đã bán
          </h1>
          <p class="text-xs text-slate-400 mt-1">
            Kênh theo dõi đơn hàng trúng thầu của <strong class="text-[#c5a059]">{{ userSession.currentUser()?.name || 'Văn Dương' }}</strong> (Seller ID: {{ userSession.currentUser()?.id || 4 }})
          </p>
        </div>

        <a
          routerLink="/seller/create"
          class="px-5 py-2.5 bg-[#c5a059] hover:bg-[#d4af66] text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-[#c5a059]/20 transition-all flex items-center gap-2"
        >
          <span>+ Đăng bài mới</span>
        </a>
      </div>

      <!-- Main Layout: 2 Cột (Cột Trái: Sub Menu | Cột Phải: Danh Sách Đơn Hàng) -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-2">
        
        <!-- Cột Trái: Sidebar Menu -->
        <div class="lg:col-span-1 bg-[#050b08]/80 border border-emerald-900/30 rounded-2xl p-5 h-fit space-y-4">
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest block border-b border-emerald-900/30 pb-2">
            — SẢN PHẨM ĐÃ ĐĂNG
          </span>

          <nav class="space-y-1.5 text-xs font-semibold">
            <a
              routerLink="/seller"
              [routerLinkActiveOptions]="{exact: true}"
              routerLinkActive="bg-[#0d1a14] border-l-2 border-[#c5a059] text-[#c5a059]"
              class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-slate-400 hover:bg-[#0d1a14] hover:text-[#c5a059] transition-all"
            >
              <span>Danh sách sản phẩm</span>
            </a>

            <a
              routerLink="/seller/orders"
              routerLinkActive="bg-[#0d1a14] border-l-2 border-[#c5a059] text-[#c5a059]"
              class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-slate-300 hover:bg-[#0d1a14] hover:text-[#c5a059] transition-all"
            >
              <span>Đơn hàng đã bán</span>
            </a>

            <a
              routerLink="/seller/create"
              routerLinkActive="bg-[#0d1a14] border-l-2 border-[#c5a059] text-[#c5a059]"
              class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-slate-400 hover:bg-[#0d1a14] hover:text-[#c5a059] transition-all mt-4 border-t border-emerald-900/20 pt-3"
            >
              <span>+ Tạo bài đăng mới</span>
            </a>
          </nav>
        </div>

        <!-- Cột Phải: Quản Lý Đơn Hàng -->
        <div class="lg:col-span-3 space-y-6">
          
          <!-- Thanh Thống Kê Nhanh -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="p-4 bg-[#050b08] border border-emerald-900/30 rounded-xl flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059] text-xl flex items-center justify-center">
                💰
              </div>
              <div>
                <p class="text-[10px] text-slate-400 uppercase font-semibold">Doanh thu trúng thầu</p>
                <p class="text-base font-black text-[#c5a059] font-mono mt-0.5">
                  {{ totalRevenue() | currencyVnd }}
                </p>
              </div>
            </div>

            <div class="p-4 bg-[#050b08] border border-emerald-900/30 rounded-xl flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xl flex items-center justify-center">
                📦
              </div>
              <div>
                <p class="text-[10px] text-slate-400 uppercase font-semibold">Chờ xuất hàng (PAID)</p>
                <p class="text-base font-black text-amber-400 font-mono mt-0.5">
                  {{ countByStatus('PAID') }} đơn
                </p>
              </div>
            </div>

            <div class="p-4 bg-[#050b08] border border-emerald-900/30 rounded-xl flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xl flex items-center justify-center">
                🎉
              </div>
              <div>
                <p class="text-[10px] text-slate-400 uppercase font-semibold">Hoàn tất thành công</p>
                <p class="text-base font-black text-emerald-400 font-mono mt-0.5">
                  {{ countByStatus('COMPLETED') }} đơn
                </p>
              </div>
            </div>
          </div>

          <!-- Thanh Tab Lọc Trạng Thái Đơn Hàng -->
          <div class="flex items-center gap-6 overflow-x-auto border-b border-emerald-900/40 text-xs pb-1">
            <button
              (click)="activeTab.set('ALL')"
              [class]="activeTab() === 'ALL' ? 'border-b-2 border-[#c5a059] text-[#c5a059] font-bold py-2' : 'text-slate-400 hover:text-slate-200 py-2'"
              class="transition-all whitespace-nowrap flex items-center gap-1.5"
            >
              <span>Tất cả</span>
              <span class="px-1.5 py-0.5 rounded bg-slate-900 text-[10px]">{{ orders().length }}</span>
            </button>

            <button
              (click)="activeTab.set('UNPAID')"
              [class]="activeTab() === 'UNPAID' ? 'border-b-2 border-[#c5a059] text-[#c5a059] font-bold py-2' : 'text-slate-400 hover:text-slate-200 py-2'"
              class="transition-all whitespace-nowrap flex items-center gap-1.5"
            >
              <span>Chờ thanh toán</span>
              <span class="px-1.5 py-0.5 rounded bg-slate-900 text-[10px]">{{ countByStatus('UNPAID') }}</span>
            </button>

            <button
              (click)="activeTab.set('PAID')"
              [class]="activeTab() === 'PAID' ? 'border-b-2 border-[#c5a059] text-[#c5a059] font-bold py-2' : 'text-slate-400 hover:text-slate-200 py-2'"
              class="transition-all whitespace-nowrap flex items-center gap-1.5"
            >
              <span>Cần xuất hàng</span>
              <span class="px-1.5 py-0.5 rounded bg-slate-900 text-[10px]">{{ countByStatus('PAID') }}</span>
            </button>

            <button
              (click)="activeTab.set('SHIPPING')"
              [class]="activeTab() === 'SHIPPING' ? 'border-b-2 border-[#c5a059] text-[#c5a059] font-bold py-2' : 'text-slate-400 hover:text-slate-200 py-2'"
              class="transition-all whitespace-nowrap flex items-center gap-1.5"
            >
              <span>Đang giao hàng</span>
              <span class="px-1.5 py-0.5 rounded bg-slate-900 text-[10px]">{{ countByStatus('SHIPPING') }}</span>
            </button>

            <button
              (click)="activeTab.set('COMPLETED')"
              [class]="activeTab() === 'COMPLETED' ? 'border-b-2 border-[#c5a059] text-[#c5a059] font-bold py-2' : 'text-slate-400 hover:text-slate-200 py-2'"
              class="transition-all whitespace-nowrap flex items-center gap-1.5"
            >
              <span>Hoàn tất</span>
              <span class="px-1.5 py-0.5 rounded bg-slate-900 text-[10px]">{{ countByStatus('COMPLETED') }}</span>
            </button>
          </div>

          <!-- Trạng Thái Tải Dữ Liệu -->
          @if (loading()) {
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              @for (i of [1,2]; track i) {
                <div class="h-80 rounded-2xl bg-slate-900/40 border border-emerald-900/30 animate-pulse"></div>
              }
            </div>
          } @else if (filteredOrders().length === 0) {
            <div class="py-20 bg-[#050b08]/80 border border-emerald-900/30 rounded-2xl text-center flex flex-col items-center justify-center p-8 space-y-3 shadow-2xl">
              <div class="w-14 h-14 rotate-45 border-2 border-[#c5a059]/60 bg-[#c5a059]/10 flex items-center justify-center mb-2">
                <span class="-rotate-45 text-[#c5a059] font-serif font-black text-xl">📦</span>
              </div>
              <h3 class="text-base font-serif font-bold text-white">Không có đơn hàng nào</h3>
              <p class="text-xs text-slate-400">Hiện tại chưa có đơn hàng trúng thầu nào trong trạng thái này.</p>
            </div>
          } @else {
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <span>Tạo lúc: {{ item.createdAt | date:'dd/MM/yyyy HH:mm':'+0700' }}</span>
                      </div>

                      <h3 class="font-serif font-bold text-base text-white line-clamp-1">
                        {{ item.productTitle }}
                      </h3>

                      <div class="p-3 bg-[#050b08] rounded-xl border border-emerald-900/40 flex items-center justify-between">
                        <div>
                          <p class="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Giá chốt thầu</p>
                          <p class="text-lg font-black text-[#c5a059] font-mono">
                            {{ item.winningPrice | currencyVnd }}
                          </p>
                        </div>
                        <span class="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                          THẮNG THẦU
                        </span>
                      </div>

                      <div class="p-3 bg-emerald-950/20 border border-emerald-800/30 rounded-xl space-y-1.5 text-xs text-slate-300">
                        <p class="text-[10px] text-[#c5a059] font-bold flex items-center justify-between">
                          <span>👤 Người Thắng Cuộc:</span>
                          <strong class="text-white font-semibold">{{ item.buyerName || 'Khách hàng' }}</strong>
                        </p>
                        <p class="text-[11px]">📞 <strong>SĐT:</strong> {{ item.buyerPhone || 'Chưa điền' }}</p>
                        <p class="text-[11px] line-clamp-2">📍 <strong>Địa chỉ:</strong> {{ item.shippingAddress || 'Chưa điền địa chỉ' }}</p>
                      </div>

                      @if (item.courierName && item.trackingNumber) {
                        <div class="p-3 bg-blue-950/30 border border-blue-800/30 rounded-xl space-y-1 text-xs text-blue-200">
                          <p class="text-[10px] text-blue-300 font-bold flex items-center gap-1">🚚 Mã vận đơn:</p>
                          <p><strong>{{ item.courierName }}:</strong> <span class="font-mono text-[#c5a059] font-semibold">{{ item.trackingNumber }}</span></p>
                        </div>
                      }
                    </div>
                  </div>

                  <div class="p-5 pt-0">
                    @if (item.status === 'PAID') {
                      <button
                        (click)="selectedOrderForShip.set(item)"
                        class="w-full py-3 px-4 bg-[#c5a059] hover:bg-[#d4af66] text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-[#c5a059]/20 transition-all flex items-center justify-center gap-2"
                      >
                        🚚 Xuất Hàng & Nhập Mã Vận Đơn
                      </button>
                    } @else if (item.status === 'UNPAID') {
                      <div class="p-3 bg-[#050b08] rounded-xl border border-emerald-900/40 text-center text-xs text-amber-400/80 font-semibold flex items-center justify-center gap-2">
                        <span>⏳</span> Chờ người mua thanh toán tiền giữ Escrow...
                      </div>
                    } @else if (item.status === 'SHIPPING') {
                      <div class="p-3 bg-[#050b08] rounded-xl border border-emerald-900/40 text-center text-xs text-indigo-300 font-semibold flex flex-col items-center justify-center gap-1">
                        <span>🚚 Đang giao hàng</span>
                        <span class="text-[10px] text-slate-400 font-normal">Tiền Escrow sẽ giải ngân ngay khi người mua bấm "Xác nhận nhận hàng"</span>
                      </div>
                    } @else if (item.status === 'COMPLETED') {
                      <div class="p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/30 text-center text-xs text-emerald-400 font-semibold flex flex-col items-center justify-center gap-1">
                        <span>🎉 Đơn hàng đã hoàn tất!</span>
                        <span class="text-[10px] text-emerald-300/90 font-normal">Tiền Escrow đã tự động giải ngân về Ví Ảo Seller của bạn.</span>
                      </div>
                    }
                  </div>

                </div>
              }
            </div>
          }
        </div>
      </div>

      <!-- Component Modal Popup Nhập Mã Vận Đơn -->
      <app-ship-modal
        [order]="selectedOrderForShip()"
        (close)="selectedOrderForShip.set(null)"
        (shipSuccess)="onShipSuccess()"
      />
    </div>
  `
})
export class SellerOrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  userSession = inject(UserSessionService);
  langService = inject(LanguageService);
  private toastService = inject(ToastService);

  orders = signal<SellerOrderResponse[]>([]);
  loading = signal<boolean>(true);
  activeTab = signal<string>('ALL');
  selectedOrderForShip = signal<SellerOrderResponse | null>(null);

  filteredOrders = computed(() => {
    const tab = this.activeTab();
    if (tab === 'ALL') return this.orders();
    return this.orders().filter((o) => o.status === tab);
  });

  totalRevenue = computed(() => {
    return this.orders().reduce((sum, o) => sum + (o.winningPrice || 0), 0);
  });

  ngOnInit(): void {
    this.fetchSellerOrders();
  }

  fetchSellerOrders(): void {
    this.loading.set(true);
    this.orderService.getSellerOrders().subscribe({
      next: (res) => {
        this.orders.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        const apiMsg = err.error?.message || err.error?.detail || err.message || 'Không thể nạp đơn hàng đã bán';
        this.toastService.showError('Lỗi nạp dữ liệu', apiMsg);
      }
    });
  }

  countByStatus(status: OrderStatus): number {
    return this.orders().filter((o) => o.status === status).length;
  }

  onShipSuccess(): void {
    this.toastService.showSuccess('Xuất hàng thành công!', 'Đơn hàng đã chuyển sang trạng thái Đang Giao (SHIPPING)');
    this.fetchSellerOrders();
  }
}
