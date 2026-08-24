import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../../core/services/order.service';
import { UserSessionService } from '../../../../core/auth/user-session.service';
import { ToastService } from '../../../../core/services/toast.service';
import { WonAuctionResponse, OrderStatus } from '../../../../shared/models/order.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { CheckoutModalComponent } from '../../components/checkout-modal/checkout-modal.component';
import { CurrencyVndPipe } from '../../../../shared/pipes/currency-vnd.pipe';

/**
 * ====================================================================================
 * 🏆 WON AUCTIONS COMPONENT (Trang Sản Phẩm Đã Thắng Đấu Giá Phía Người Mua)
 * ====================================================================================
 * Quản lý giao diện Cổng cá nhân Người mua (Bidder Portal) cho các sản phẩm đã trúng thầu.
 * Cho phép xem danh sách đơn hàng, lọc theo trạng thái (Chờ thanh toán, Đã thanh toán, Đang giao),
 * kích hoạt Modal Checkout trả tiền và bấm nút Xác Nhận Đã Nhận Hàng.
 */
@Component({
  selector: 'app-won-auctions',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent, CheckoutModalComponent, CurrencyVndPipe],
  template: `
    <div class="space-y-8">
      <!-- Header Tiêu Đề Màn Hình -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-slate-800 backdrop-blur-md">
        <div>
          <h1 class="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span>🏆</span> Sản Phẩm Đã Thắng Đấu Giá
          </h1>
          <p class="text-xs text-slate-400 mt-1">
            Cổng quản lý các sản phẩm bạn đã đấu giá trúng thầu: <strong class="text-indigo-400">{{ userSession.currentUser().name }}</strong> (ID: #{{ userSession.currentUser().id }})
          </p>
        </div>

        <!-- Nút quay lại sàn đấu giá public -->
        <a
          routerLink="/"
          class="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-all flex items-center gap-2"
        >
          <span>← Tiếp Tục Đấu Giá</span>
        </a>
      </div>

      <!-- Bộ Lọc Thanh Tab Trạng Thái (Lọc theo TẤT CẢ, UNPAID, PAID, SHIPPING, COMPLETED) -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        <!-- Tab Tất cả -->
        <button
          (click)="activeTab.set('ALL')"
          [class.bg-indigo-600]="activeTab() === 'ALL'"
          [class.text-white]="activeTab() === 'ALL'"
          [class.bg-slate-900]="activeTab() !== 'ALL'"
          [class.text-slate-400]="activeTab() !== 'ALL'"
          class="px-4 py-2 rounded-xl text-xs font-bold transition-all border border-slate-800 hover:border-slate-700 whitespace-nowrap"
        >
          Tất Cả ({{ orders().length }})
        </button>

        <!-- Tab Đơn Chờ Thanh Toán -->
        <button
          (click)="activeTab.set('UNPAID')"
          [class.bg-amber-600]="activeTab() === 'UNPAID'"
          [class.text-white]="activeTab() === 'UNPAID'"
          [class.bg-slate-900]="activeTab() !== 'UNPAID'"
          [class.text-slate-400]="activeTab() !== 'UNPAID'"
          class="px-4 py-2 rounded-xl text-xs font-bold transition-all border border-slate-800 hover:border-slate-700 whitespace-nowrap flex items-center gap-1.5"
        >
          <span>⏳ Chờ Thanh Toán</span>
          <span class="px-1.5 py-0.5 rounded-md bg-slate-950/60 text-[10px]">{{ countByStatus('UNPAID') }}</span>
        </button>

        <!-- Tab Đơn Đã Thanh Toán -->
        <button
          (click)="activeTab.set('PAID')"
          [class.bg-emerald-600]="activeTab() === 'PAID'"
          [class.text-white]="activeTab() === 'PAID'"
          [class.bg-slate-900]="activeTab() !== 'PAID'"
          [class.text-slate-400]="activeTab() !== 'PAID'"
          class="px-4 py-2 rounded-xl text-xs font-bold transition-all border border-slate-800 hover:border-slate-700 whitespace-nowrap flex items-center gap-1.5"
        >
          <span>✅ Đã Thanh Toán</span>
          <span class="px-1.5 py-0.5 rounded-md bg-slate-950/60 text-[10px]">{{ countByStatus('PAID') }}</span>
        </button>

        <!-- Tab Đơn Đang Giao Hàng -->
        <button
          (click)="activeTab.set('SHIPPING')"
          [class.bg-indigo-600]="activeTab() === 'SHIPPING'"
          [class.text-white]="activeTab() === 'SHIPPING'"
          [class.bg-slate-900]="activeTab() !== 'SHIPPING'"
          [class.text-slate-400]="activeTab() !== 'SHIPPING'"
          class="px-4 py-2 rounded-xl text-xs font-bold transition-all border border-slate-800 hover:border-slate-700 whitespace-nowrap flex items-center gap-1.5"
        >
          <span>🚚 Đang Giao Hàng</span>
          <span class="px-1.5 py-0.5 rounded-md bg-slate-950/60 text-[10px]">{{ countByStatus('SHIPPING') }}</span>
        </button>

        <!-- Tab Đơn Đã Hoàn Tất -->
        <button
          (click)="activeTab.set('COMPLETED')"
          [class.bg-emerald-800]="activeTab() === 'COMPLETED'"
          [class.text-white]="activeTab() === 'COMPLETED'"
          [class.bg-slate-900]="activeTab() !== 'COMPLETED'"
          [class.text-slate-400]="activeTab() !== 'COMPLETED'"
          class="px-4 py-2 rounded-xl text-xs font-bold transition-all border border-slate-800 hover:border-slate-700 whitespace-nowrap flex items-center gap-1.5"
        >
          <span>🎉 Hoàn Tất</span>
          <span class="px-1.5 py-0.5 rounded-md bg-slate-950/60 text-[10px]">{{ countByStatus('COMPLETED') }}</span>
        </button>
      </div>

      <!-- Trạng Thái Đang Tải Dữ Liệu (Skeleton Loading) -->
      @if (loading()) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (i of [1,2,3]; track i) {
            <div class="h-80 rounded-3xl bg-slate-900/40 border border-slate-800 animate-pulse"></div>
          }
        </div>
      } @else if (filteredOrders().length === 0) {
        <!-- Khung hiển thị rỗng khi chưa thắng đơn nào -->
        <div class="text-center py-20 bg-slate-900/30 rounded-3xl border border-slate-800 p-8 space-y-3">
          <div class="text-5xl">🏆</div>
          <h3 class="text-base font-bold text-slate-300">Không tìm thấy đơn hàng trúng thầu</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">
            Bạn chưa thắng phiên đấu giá nào trong mục này. Hãy tham gia sàn đấu giá công khai để săn ngay những món đồ giá trị!
          </p>
          <a routerLink="/" class="inline-block py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all mt-2">
            Khám Phá Sàn Đấu Giá
          </a>
        </div>
      } @else {
        <!-- Grid Danh Sách Đơn Hàng Trúng Thầu (3 Cột) -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (item of filteredOrders(); track item.orderId) {
            <div class="group bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-3xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between">
              
              <div>
                <!-- Ảnh Sản Phẩm & Floating Status Badge -->
                <div class="relative h-48 bg-slate-950 overflow-hidden">
                  @if (item.productImage) {
                    <img [src]="item.productImage" [alt]="item.productTitle" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  } @else {
                    <div class="w-full h-full flex items-center justify-center text-slate-700 text-4xl">🖼</div>
                  }

                  <!-- Badge Trạng thái đơn hàng (UNPAID / PAID / SHIPPING / COMPLETED) -->
                  <div class="absolute top-3 left-3">
                    <app-status-badge [status]="item.status" />
                  </div>

                  <!-- Nhãn Mã Đơn Hàng floating -->
                  <div class="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-indigo-300 border border-slate-800">
                    #ORD-{{ item.orderId }}
                  </div>
                </div>

                <!-- Thân Thẻ Đơn Hàng -->
                <div class="p-5 space-y-3">
                  <div class="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Mã SP: #{{ item.productId }}</span>
                    <span>Mã Thầu: #{{ item.auctionId }}</span>
                  </div>

                  <!-- Tiêu đề sản phẩm -->
                  <h3 class="font-bold text-base text-white line-clamp-1">
                    {{ item.productTitle }}
                  </h3>

                  <!-- Khung Giá Trúng Thầu -->
                  <div class="p-3 bg-slate-950/70 rounded-2xl border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <p class="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Giá trúng thầu</p>
                      <p class="text-lg font-black text-emerald-400 font-mono">
                        {{ item.winningPrice | currencyVnd }}
                      </p>
                    </div>
                    <span class="text-xs font-bold text-amber-400">🏆 WINNER</span>
                  </div>

                  <!-- Địa chỉ giao hàng chi tiết (Hiển thị nếu đã điền Checkout) -->
                  @if (item.shippingAddress) {
                    <div class="p-3 bg-indigo-950/30 border border-indigo-800/40 rounded-xl space-y-1 text-xs text-slate-300">
                      <p class="text-[10px] text-indigo-300 font-bold flex items-center gap-1">📍 Địa chỉ nhận hàng:</p>
                      <p class="line-clamp-2 text-slate-300">{{ item.shippingAddress }} (SĐT: {{ item.phoneNumber }})</p>
                    </div>
                  }

                  <!-- Thông tin Mã vận chuyển & Bưu cục gửi (Hiển thị nếu Seller đã Ship) -->
                  @if (item.courierName && item.trackingNumber) {
                    <div class="p-3 bg-blue-950/40 border border-blue-800/40 rounded-xl space-y-1 text-xs text-blue-200">
                      <p class="text-[10px] text-blue-300 font-bold flex items-center gap-1">🚚 Thông tin bưu cục:</p>
                      <p><strong>{{ item.courierName }}:</strong> <span class="font-mono text-emerald-400 font-semibold">{{ item.trackingNumber }}</span></p>
                    </div>
                  }
                </div>
              </div>

              <!-- Thanh Thao Tác Dưới Chân Đơn Hàng (Action Footer) -->
              <div class="p-5 pt-0">
                <!-- 1. Đơn UNPAID -> Hiện nút Checkout Thanh Toán Ngay -->
                @if (item.status === 'UNPAID') {
                  <button
                    (click)="selectedOrderForCheckout.set(item)"
                    class="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    💳 Thanh Toán Ngay (Checkout)
                  </button>
                } 
                <!-- 2. Đơn SHIPPING -> Hiện nút Xác Nhận Đã Nhận Hàng -->
                @else if (item.status === 'SHIPPING') {
                  <button
                    (click)="confirmReceived(item.orderId)"
                    [disabled]="actionLoading()"
                    class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    📦 Bấm Xác Nhận "Đã Nhận Hàng"
                  </button>
                } 
                <!-- 3. Đơn PAID -> Cảnh báo chờ Seller giao hàng -->
                @else if (item.status === 'PAID') {
                  <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center text-xs text-emerald-400 font-semibold flex items-center justify-center gap-2">
                    <span>⏳</span> Đang chờ Seller đóng gói & giao hàng...
                  </div>
                } 
                <!-- 4. Đơn COMPLETED -> Thông báo đã xong -->
                @else if (item.status === 'COMPLETED') {
                  <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center text-xs text-slate-400 font-semibold flex items-center justify-center gap-2">
                    <span>🎉</span> Đơn hàng đã hoàn tất thành công!
                  </div>
                }
              </div>

            </div>
          }
        </div>
      }

      <!-- Component Modal Popup Checkout Thanh Toán -->
      <app-checkout-modal
        [order]="selectedOrderForCheckout()"
        (close)="selectedOrderForCheckout.set(null)"
        (checkoutSuccess)="onCheckoutSuccess()"
      />
    </div>
  `
})
export class WonAuctionsComponent implements OnInit {
  // Inject Service gọi API Đơn hàng, Quản lý tài khoản đăng nhập và Popup Toast
  private orderService = inject(OrderService);
  userSession = inject(UserSessionService);
  private toastService = inject(ToastService);

  // Mảng Signal lưu danh sách toàn bộ Đơn hàng trúng thầu
  orders = signal<WonAuctionResponse[]>([]);
  // Signal trạng thái đang tải dữ liệu ban đầu
  loading = signal<boolean>(true);
  // Signal trạng thái đang bấm nút xác nhận nhận hàng
  actionLoading = signal<boolean>(false);
  // Signal lưu tên Tab lọc hiện tại ('ALL' | 'UNPAID' | 'PAID' | 'SHIPPING' | 'COMPLETED')
  activeTab = signal<string>('ALL');
  // Signal lưu Đơn hàng đang chọn để mở Modal Checkout
  selectedOrderForCheckout = signal<WonAuctionResponse | null>(null);

  /**
   * Computed Signal filteredOrders: Tự động tính toán và lọc danh sách đơn hàng
   * theo tên Tab (`activeTab`) đang được chọn trên giao diện mà không cần gọi lại API.
   */
  filteredOrders = computed(() => {
    const tab = this.activeTab();
    if (tab === 'ALL') return this.orders();
    return this.orders().filter((o) => o.status === tab);
  });

  /**
   * Lifecycle Hook ngOnInit: Khởi chạy ngay khi người dùng truy cập vào đường dẫn /my-bids.
   */
  ngOnInit(): void {
    this.fetchWonAuctions();
  }

  /**
   * Hàm fetchWonAuctions: Lấy ID người dùng hiện tại và gửi HTTP Request
   * sang Backend (`GET /v1/bidders/{bidderId}/won-auctions`) để nạp danh sách đơn hàng.
   */
  fetchWonAuctions(): void {
    const bidderId = this.userSession.currentUser().id;
    this.loading.set(true);
    this.orderService.getWonAuctions(bidderId).subscribe({
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

  /**
   * Hàm countByStatus: Đếm số lượng đơn hàng theo từng trạng thái cụ thể để hiển thị số badge trên các Tab.
   */
  countByStatus(status: OrderStatus): number {
    return this.orders().filter((o) => o.status === status).length;
  }

  /**
   * Callback khi người mua thanh toán Checkout thành công trên Modal -> Tải lại danh sách đơn hàng.
   */
  onCheckoutSuccess(): void {
    this.toastService.showSuccess('Thanh toán thành công', 'Đơn hàng đã cập nhật trạng thái Đã Thanh Toán');
    this.fetchWonAuctions();
  }

  /**
   * Hàm confirmReceived: Gọi API Backend (`PUT /v1/bidders/{bidderId}/orders/{orderId}/confirm-received`)
   * khi người mua bấm nút xác nhận đã nhận hàng thành công để chuyển đơn sang COMPLETED.
   */
  confirmReceived(orderId: number): void {
    if (!confirm('Bạn xác nhận đã nhận được hàng đúng mô tả và hoàn tất đơn hàng?')) return;
    const bidderId = this.userSession.currentUser().id;
    this.actionLoading.set(true);

    this.orderService.confirmReceived(bidderId, orderId).subscribe({
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
