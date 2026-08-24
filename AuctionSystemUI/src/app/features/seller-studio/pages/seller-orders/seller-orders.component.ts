import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../../core/services/order.service';
import { UserSessionService } from '../../../../core/auth/user-session.service';
import { ToastService } from '../../../../core/services/toast.service';
import { SellerOrderResponse, OrderStatus } from '../../../../shared/models/order.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { ShipModalComponent } from '../../components/ship-modal/ship-modal.component';
import { CurrencyVndPipe } from '../../../../shared/pipes/currency-vnd.pipe';

/**
 * ====================================================================================
 * 📦 SELLER ORDERS COMPONENT (Trang Quản Lý Đơn Hàng Đã Bán Phía Người Bán)
 * ====================================================================================
 * Quản lý giao diện Kênh Người Bán (Seller Studio) cho các sản phẩm đã đấu giá thành công.
 * Hiển thị chỉ số doanh thu, trạng thái trả tiền của khách mua, địa chỉ nhận hàng,
 * và kích hoạt Modal nhập Mã vận chuyển (Tracking Code) để xuất bưu cục giao hàng.
 */
@Component({
  selector: 'app-seller-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent, ShipModalComponent, CurrencyVndPipe],
  template: `
    <div class="space-y-8">
      <!-- Header Tiêu Đề -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-slate-800 backdrop-blur-md">
        <div>
          <h1 class="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span>📦</span> Quản Lý Đơn Hàng Đã Bán
          </h1>
          <p class="text-xs text-slate-400 mt-1">
            Kênh theo dõi đơn hàng trúng thầu dành riêng cho Seller: <strong class="text-indigo-400">{{ userSession.currentUser().name }}</strong> (ID: #{{ userSession.currentUser().id }})
          </p>
        </div>

        <!-- Nút quay lại trang danh sách sản phẩm của Seller -->
        <a
          routerLink="/seller"
          class="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-all flex items-center gap-2"
        >
          <span>📋 Quản Lý Sản Phẩm</span>
        </a>
      </div>

      <!-- Thanh Thống Kê Nhanh (Quick Metrics Bar): Tổng Doanh Thu, Số Đơn Cần Xuất, Đang Giao, Đơn Hoàn Tất -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- 1. Ô Thống kê Tổng doanh thu chốt thầu -->
        <div class="p-5 bg-slate-900/60 border border-slate-800 rounded-3xl flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-2xl flex items-center justify-center">
            💰
          </div>
          <div>
            <p class="text-xs text-slate-400">Tổng doanh thu trúng thầu</p>
            <p class="text-xl font-black text-emerald-400 font-mono mt-0.5">
              {{ totalRevenue() | currencyVnd }}
            </p>
          </div>
        </div>

        <!-- 2. Ô Thống kê Số đơn đã trả tiền (PAID) cần Seller đóng gói xuất bưu cục -->
        <div class="p-5 bg-slate-900/60 border border-slate-800 rounded-3xl flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-2xl flex items-center justify-center">
            📦
          </div>
          <div>
            <p class="text-xs text-slate-400">Đơn chờ xuất hàng (PAID)</p>
            <p class="text-xl font-black text-amber-400 font-mono mt-0.5">
              {{ countByStatus('PAID') }} đơn
            </p>
          </div>
        </div>

        <!-- 3. Ô Thống kê Số đơn đang bưu cục giao hàng (SHIPPING) -->
        <div class="p-5 bg-slate-900/60 border border-slate-800 rounded-3xl flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-2xl flex items-center justify-center">
            🚚
          </div>
          <div>
            <p class="text-xs text-slate-400">Đơn đang giao (SHIPPING)</p>
            <p class="text-xl font-black text-blue-400 font-mono mt-0.5">
              {{ countByStatus('SHIPPING') }} đơn
            </p>
          </div>
        </div>

        <!-- 4. Ô Thống kê Số đơn hoàn tất thành công (COMPLETED) -->
        <div class="p-5 bg-slate-900/60 border border-slate-800 rounded-3xl flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-2xl flex items-center justify-center">
            🎉
          </div>
          <div>
            <p class="text-xs text-slate-400">Đơn hoàn tất thành công</p>
            <p class="text-xl font-black text-indigo-400 font-mono mt-0.5">
              {{ countByStatus('COMPLETED') }} đơn
            </p>
          </div>
        </div>
      </div>

      <!-- Thanh Tab Lọc Trạng Thái Đơn Hàng -->
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

        <!-- Tab Đơn Chờ Khách Thanh Toán -->
        <button
          (click)="activeTab.set('UNPAID')"
          [class.bg-amber-600]="activeTab() === 'UNPAID'"
          [class.text-white]="activeTab() === 'UNPAID'"
          [class.bg-slate-900]="activeTab() !== 'UNPAID'"
          [class.text-slate-400]="activeTab() !== 'UNPAID'"
          class="px-4 py-2 rounded-xl text-xs font-bold transition-all border border-slate-800 hover:border-slate-700 whitespace-nowrap flex items-center gap-1.5"
        >
          <span>⏳ Chờ Khách Thanh Toán</span>
          <span class="px-1.5 py-0.5 rounded-md bg-slate-950/60 text-[10px]">{{ countByStatus('UNPAID') }}</span>
        </button>

        <!-- Tab Đơn Khách Đã Thanh Toán (Cần Xuất Hàng) -->
        <button
          (click)="activeTab.set('PAID')"
          [class.bg-emerald-600]="activeTab() === 'PAID'"
          [class.text-white]="activeTab() === 'PAID'"
          [class.bg-slate-900]="activeTab() !== 'PAID'"
          [class.text-slate-400]="activeTab() !== 'PAID'"
          class="px-4 py-2 rounded-xl text-xs font-bold transition-all border border-slate-800 hover:border-slate-700 whitespace-nowrap flex items-center gap-1.5"
        >
          <span>⚡ Cần Xuất Hàng</span>
          <span class="px-1.5 py-0.5 rounded-md bg-slate-950/60 text-[10px]">{{ countByStatus('PAID') }}</span>
        </button>

        <!-- Tab Đơn Đang Giao Bưu Cục -->
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

      <!-- Trạng Thái Tải Dữ Liệu Skeleton Loading -->
      @if (loading()) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (i of [1,2,3]; track i) {
            <div class="h-80 rounded-3xl bg-slate-900/40 border border-slate-800 animate-pulse"></div>
          }
        </div>
      } @else if (filteredOrders().length === 0) {
        <!-- Khung hiển thị rỗng khi chưa bán được đơn nào -->
        <div class="text-center py-20 bg-slate-900/30 rounded-3xl border border-slate-800 p-8 space-y-3">
          <div class="text-5xl">📦</div>
          <h3 class="text-base font-bold text-slate-300">Không có đơn hàng đấu giá nào</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">
            Hiện tại shop của bạn chưa có đơn hàng trúng thầu nào trong trạng thái này.
          </p>
        </div>
      } @else {
        <!-- Grid Danh Sách Đơn Hàng Đã Bán (3 Cột) -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (item of filteredOrders(); track item.orderId) {
            <div class="group bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-3xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between">
              
              <div>
                <!-- Khung Ảnh Sản Phẩm & Status Badge -->
                <div class="relative h-48 bg-slate-950 overflow-hidden">
                  @if (item.productImage) {
                    <img [src]="item.productImage" [alt]="item.productTitle" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  } @else {
                    <div class="w-full h-full flex items-center justify-center text-slate-700 text-4xl">🖼</div>
                  }

                  <!-- Status Badge đại diện trạng thái đơn -->
                  <div class="absolute top-3 left-3">
                    <app-status-badge [status]="item.status" />
                  </div>

                  <!-- Nhãn Mã Đơn Hàng floating -->
                  <div class="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-indigo-300 border border-slate-800">
                    #ORD-{{ item.orderId }}
                  </div>
                </div>

                <!-- Thân Thẻ Chi Tiết Đơn Hàng -->
                <div class="p-5 space-y-3">
                  <div class="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Mã SP: #{{ item.productId }}</span>
                    <span>Tạo lúc: {{ item.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
                  </div>

                  <!-- Tiêu đề sản phẩm bán -->
                  <h3 class="font-bold text-base text-white line-clamp-1">
                    {{ item.productTitle }}
                  </h3>

                  <!-- Khung Giá Chốt Thầu -->
                  <div class="p-3 bg-slate-950/70 rounded-2xl border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <p class="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Giá chốt thầu</p>
                      <p class="text-lg font-black text-emerald-400 font-mono">
                        {{ item.winningPrice | currencyVnd }}
                      </p>
                    </div>
                    <span class="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-lg border border-indigo-500/20">
                      THẮNG THẦU
                    </span>
                  </div>

                  <!-- Thông Tin Người Thắng Cuộc (Tên, SĐT, Địa chỉ nhận hàng nếu đã trả tiền) -->
                  <div class="p-3 bg-indigo-950/30 border border-indigo-800/40 rounded-xl space-y-1.5 text-xs text-slate-300">
                    <p class="text-[10px] text-indigo-300 font-bold flex items-center justify-between">
                      <span>👤 Người Thắng Cuộc:</span>
                      <strong class="text-white font-semibold">{{ item.buyerName || 'Khách hàng' }}</strong>
                    </p>
                    <p class="text-[11px]">📞 <strong>SĐT:</strong> {{ item.buyerPhone || 'Chưa điền' }}</p>
                    <p class="text-[11px] line-clamp-2">📍 <strong>Địa chỉ giao:</strong> {{ item.shippingAddress || 'Chưa điền địa chỉ' }}</p>
                  </div>

                  <!-- Hiển thị thông tin bưu cục nếu Seller đã nhập mã ship -->
                  @if (item.courierName && item.trackingNumber) {
                    <div class="p-3 bg-blue-950/40 border border-blue-800/40 rounded-xl space-y-1 text-xs text-blue-200">
                      <p class="text-[10px] text-blue-300 font-bold flex items-center gap-1">🚚 Thông tin bưu cục gửi:</p>
                      <p><strong>{{ item.courierName }}:</strong> <span class="font-mono text-emerald-400 font-semibold">{{ item.trackingNumber }}</span></p>
                    </div>
                  }
                </div>
              </div>

              <!-- Thanh Thao Tác Dưới Chân Đơn Hàng (Action Footer) -->
              <div class="p-5 pt-0">
                <!-- 1. Đơn PAID (Đã trả tiền) -> Hiện nút Xuất Hàng & Nhập Mã Vận Đơn -->
                @if (item.status === 'PAID') {
                  <button
                    (click)="selectedOrderForShip.set(item)"
                    class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    🚚 Xuất Hàng & Nhập Mã Vận Đơn
                  </button>
                } 
                <!-- 2. Đơn UNPAID -> Cảnh báo chờ người mua thanh toán tiền trước -->
                @else if (item.status === 'UNPAID') {
                  <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center text-xs text-amber-400/80 font-semibold flex items-center justify-center gap-2">
                    <span>⏳</span> Chờ người mua thanh toán tiền trước...
                  </div>
                } 
                <!-- 3. Đơn SHIPPING -> Thông báo bưu cục đang giao -->
                @else if (item.status === 'SHIPPING') {
                  <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center text-xs text-indigo-400 font-semibold flex items-center justify-center gap-2">
                    <span>🚚</span> Đơn hàng đang được bưu cục giao tới người mua...
                  </div>
                } 
                <!-- 4. Đơn COMPLETED -> Thông báo đã hoàn tất & giải ngân tiền -->
                @else if (item.status === 'COMPLETED') {
                  <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center text-xs text-emerald-400 font-semibold flex items-center justify-center gap-2">
                    <span>🎉</span> Đã hoàn tất & giải ngân tiền về ví Seller!
                  </div>
                }
              </div>

            </div>
          }
        </div>
      }

      <!-- Component Modal Popup Nhập Mã Vận Đơn Giao Hàng -->
      <app-ship-modal
        [order]="selectedOrderForShip()"
        (close)="selectedOrderForShip.set(null)"
        (shipSuccess)="onShipSuccess()"
      />
    </div>
  `
})
export class SellerOrdersComponent implements OnInit {
  // Inject Service gọi API Đơn hàng phía Seller, Thông tin phiên đăng nhập và Toast
  private orderService = inject(OrderService);
  userSession = inject(UserSessionService);
  private toastService = inject(ToastService);

  // Mảng Signal lưu danh sách đơn hàng đã bán
  orders = signal<SellerOrderResponse[]>([]);
  // Signal trạng thái loading dữ liệu
  loading = signal<boolean>(true);
  // Signal lưu tên Tab lọc đang mở
  activeTab = signal<string>('ALL');
  // Signal lưu đơn hàng được chọn để mở Popup Xuất hàng
  selectedOrderForShip = signal<SellerOrderResponse | null>(null);

  /**
   * Computed Signal filteredOrders: Tự động lọc danh sách đơn hàng bán được theo Tab được bấm.
   */
  filteredOrders = computed(() => {
    const tab = this.activeTab();
    if (tab === 'ALL') return this.orders();
    return this.orders().filter((o) => o.status === tab);
  });

  /**
   * Computed Signal totalRevenue: Tính tổng số tiền giá chốt thầu của tất cả các đơn hàng đã bán.
   */
  totalRevenue = computed(() => {
    return this.orders().reduce((sum, o) => sum + (o.winningPrice || 0), 0);
  });

  /**
   * Lifecycle Hook ngOnInit: Khởi chạy gọi API nạp đơn hàng khi truy cập Kênh Seller.
   */
  ngOnInit(): void {
    this.fetchSellerOrders();
  }

  /**
   * Hàm fetchSellerOrders: Gửi HTTP GET `/v1/sellers/{sellerId}/orders` để nạp danh sách đơn hàng đã bán.
   */
  fetchSellerOrders(): void {
    const sellerId = this.userSession.currentUser().id;
    this.loading.set(true);
    this.orderService.getSellerOrders(sellerId).subscribe({
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

  /**
   * Đếm số lượng đơn hàng theo từng trạng thái cụ thể.
   */
  countByStatus(status: OrderStatus): number {
    return this.orders().filter((o) => o.status === status).length;
  }

  /**
   * Callback khi Seller xuất hàng thành công trên Modal -> Tải lại danh sách đơn hàng.
   */
  onShipSuccess(): void {
    this.toastService.showSuccess('Xuất hàng thành công!', 'Đơn hàng đã chuyển sang trạng thái Đang Giao (SHIPPING)');
    this.fetchSellerOrders();
  }
}
