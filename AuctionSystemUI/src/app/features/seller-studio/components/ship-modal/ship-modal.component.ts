import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../../core/services/order.service';
import { UserSessionService } from '../../../../core/auth/user-session.service';
import { ToastService } from '../../../../core/services/toast.service';
import { SellerOrderResponse } from '../../../../shared/models/order.model';
import { CurrencyVndPipe } from '../../../../shared/pipes/currency-vnd.pipe';

/**
 * ====================================================================================
 * 🚚 SHIP MODAL COMPONENT (Popup Xuất Hàng & Nhập Mã Vận Đơn Phía Người Bán)
 * ====================================================================================
 */
@Component({
  selector: 'app-ship-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyVndPipe],
  template: `
    @if (order) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
        <div class="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative overflow-hidden">
          
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <!-- Header Popup -->
          <div class="flex items-center justify-between border-b border-slate-800 pb-4">
            <div class="flex items-center gap-2.5">
              <span class="text-xl">🚚</span>
              <div>
                <h2 class="text-lg font-black text-white">Xuất Hàng & Nhập Mã Vận Đơn</h2>
                <p class="text-xs text-slate-400">Mã Đơn Hàng: #ORD-{{ order.orderId }}</p>
              </div>
            </div>
            <button (click)="close.emit()" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors">
              ✕
            </button>
          </div>

          <!-- Thẻ Tóm Tắt Sản Phẩm -->
          <div class="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div class="flex items-center gap-3">
              @if (order.productImage) {
                <img [src]="order.productImage" [alt]="order.productTitle" class="w-14 h-14 rounded-xl object-cover border border-slate-800" />
              } @else {
                <div class="w-14 h-14 rounded-xl bg-slate-900 flex items-center justify-center text-xl border border-slate-800">🖼</div>
              }
              <div class="flex-1 min-w-0">
                <h4 class="text-xs font-bold text-white truncate">{{ order.productTitle }}</h4>
                <p class="text-sm font-black text-emerald-400 font-mono mt-0.5">
                  {{ order.winningPrice | currencyVnd }}
                </p>
              </div>
            </div>

            <div class="pt-2.5 border-t border-slate-800/80 text-xs space-y-1 text-slate-300">
              <p>👤 <strong>Người mua:</strong> {{ order.buyerName || 'Khách hàng' }} (SĐT: {{ order.buyerPhone || '---' }})</p>
              <p>📍 <strong>Địa chỉ giao:</strong> {{ order.shippingAddress || 'Chưa cập nhật' }}</p>
            </div>
          </div>

          <!-- Các Trường Form Nhập Thông Tin Vận Chuyển -->
          <div class="space-y-4">
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-slate-300">
                Đơn Vị Vận Chuyển Bưu Cục <span class="text-rose-400">*</span>
              </label>
              <select
                [(ngModel)]="courierName"
                class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
              >
                <option value="Giao Hàng Tiết Kiệm">Giao Hàng Tiết Kiệm (GHTK)</option>
                <option value="Giao Hàng Nhanh">Giao Hàng Nhanh (GHN)</option>
                <option value="Viettel Post">Viettel Post</option>
                <option value="VNPost / Bưu Điện Việt Nam">VNPost / Bưu Điện Việt Nam</option>
                <option value="J&T Express">J&T Express</option>
                <option value="GrabExpress / ShopeeXpress">GrabExpress / ShopeeXpress</option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-slate-300">
                Mã Vận Đơn (Tracking Code) <span class="text-rose-400">*</span>
              </label>
              <input
                type="text"
                [(ngModel)]="trackingNumber"
                (blur)="trackingTouched.set(true)"
                placeholder="Nhập mã phiếu gửi từ bưu cục (Ví dụ: GHTK-88129931)"
                [ngClass]="isTrackingInvalid() ? 'border-rose-500/80 bg-rose-950/20 text-rose-100 placeholder-rose-400/50 focus:border-rose-400' : 'border-slate-800 bg-slate-950 text-emerald-400 focus:border-indigo-500'"
                class="w-full px-4 py-2.5 border rounded-xl text-xs font-mono font-bold focus:outline-none transition-all"
              />

              @if (isTrackingInvalid()) {
                <p class="text-[11px] font-semibold text-rose-400 flex items-center gap-1.5 mt-1 animate-fade-in">
                  <span>⚠️ Vui lòng nhập mã vận đơn để người mua có thể theo dõi hành trình</span>
                </p>
              }
            </div>
          </div>

          <!-- Actions Nút Bấm -->
          <div class="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              (click)="close.emit()"
              class="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors"
            >
              Hủy
            </button>
            <button
              type="button"
              (click)="submitShip()"
              [disabled]="submitting()"
              class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              @if (submitting()) {
                <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Đang xử lý...</span>
              } @else {
                <span>🚀 XÁC NHẬN GIAO HÀNG</span>
              }
            </button>
          </div>

        </div>
      </div>
    }
  `
})
export class ShipModalComponent {
  @Input() order: SellerOrderResponse | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() shipSuccess = new EventEmitter<SellerOrderResponse>();

  private orderService = inject(OrderService);
  private userSession = inject(UserSessionService);
  private toastService = inject(ToastService);

  courierName = 'Giao Hàng Tiết Kiệm';
  trackingNumber = '';

  submitted = signal<boolean>(false);
  trackingTouched = signal<boolean>(false);
  submitting = signal<boolean>(false);

  isTrackingInvalid(): boolean {
    return (this.submitted() || this.trackingTouched()) && !this.trackingNumber.trim();
  }

  submitShip(): void {
    if (!this.order) return;
    this.submitted.set(true);

    const tNum = this.trackingNumber.trim();
    if (!tNum) {
      this.toastService.showError('Thiếu thông tin', 'Vui lòng nhập mã vận đơn để người mua theo dõi!');
      return;
    }

    const sellerId = this.userSession.currentUser().id;
    const cName = this.courierName;

    this.submitting.set(true);

    this.orderService.shipOrder(sellerId, this.order.orderId, {
      courierName: cName,
      trackingNumber: tNum
    }).subscribe({
      next: (res) => {
        this.submitting.set(false);
        this.toastService.showSuccess('Đã Xuất Hàng!', 'Mã vận đơn đã được gửi tới người mua');
        this.shipSuccess.emit(res);
        this.close.emit();
      },
      error: (err) => {
        this.submitting.set(false);
        console.error('Error shipping order:', err);
        const apiMsg = err.error?.message || err.error?.detail || err.message || 'Xuất hàng thất bại!';
        this.toastService.showError('Xuất hàng thất bại', apiMsg);
      }
    });
  }
}
