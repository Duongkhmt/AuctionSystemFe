import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../../core/services/order.service';
import { UserSessionService } from '../../../../core/auth/user-session.service';
import { ToastService } from '../../../../core/services/toast.service';
import { WonAuctionResponse, CheckoutResponse, PaymentMethod } from '../../../../shared/models/order.model';
import { CurrencyVndPipe } from '../../../../shared/pipes/currency-vnd.pipe';

/**
 * ====================================================================================
 * 💳 CHECKOUT MODAL COMPONENT (Popup Thanh Toán Đơn Hàng Phía Người Mua)
 * ====================================================================================
 */
@Component({
  selector: 'app-checkout-modal',
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
              <span class="text-xl">💳</span>
              <div>
                <h2 class="text-lg font-black text-white">Thanh Toán Đơn Hàng Trúng Thầu</h2>
                <p class="text-xs text-slate-400">Mã Đơn Hàng: #ORD-{{ order.orderId }}</p>
              </div>
            </div>
            <button (click)="close.emit()" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors">
              ✕
            </button>
          </div>

          <!-- Thẻ Thống Kê Tóm Tắt Sản Phẩm -->
          <div class="flex items-center gap-4 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
            @if (order.productImage) {
              <img [src]="order.productImage" [alt]="order.productTitle" class="w-16 h-16 rounded-xl object-cover border border-slate-800" />
            } @else {
              <div class="w-16 h-16 rounded-xl bg-slate-900 flex items-center justify-center text-2xl border border-slate-800">🖼</div>
            }
            <div class="flex-1 min-w-0">
              <h4 class="text-xs font-bold text-white truncate">{{ order.productTitle }}</h4>
              <p class="text-[11px] text-slate-400 mt-0.5">Mã SP: #{{ order.productId }} • Mã Thầu: #{{ order.auctionId }}</p>
              <p class="text-sm font-black text-emerald-400 font-mono mt-1">
                {{ order.winningPrice | currencyVnd }}
              </p>
            </div>
          </div>

          <!-- Các Trường Form Có Validation Trực Quan -->
          <div class="space-y-4">
            <!-- Trường 1: Địa Chỉ Giao Hàng Chi Tiết -->
            <div class="space-y-1">
              <label class="block text-xs font-semibold text-slate-300">
                Địa Chỉ Giao Hàng Chi Tiết <span class="text-rose-400">*</span>
              </label>
              <textarea
                [(ngModel)]="shippingAddress"
                (blur)="addressTouched.set(true)"
                rows="2"
                placeholder="Nhập số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                [ngClass]="isAddressInvalid() ? 'border-rose-500/80 bg-rose-950/20 text-rose-100 placeholder-rose-400/50 focus:border-rose-400' : 'border-slate-800 bg-slate-950 text-white focus:border-indigo-500'"
                class="w-full px-4 py-2.5 border rounded-xl text-xs focus:outline-none leading-relaxed transition-all"
              ></textarea>

              @if (isAddressInvalid()) {
                <p class="text-[11px] font-semibold text-rose-400 flex items-center gap-1.5 mt-1 animate-fade-in">
                  <span>⚠️ Vui lòng nhập địa chỉ giao hàng chi tiết (số nhà, tên đường, quận/huyện...)</span>
                </p>
              }
            </div>

            <!-- Trường 2: Số Điện Thoại Nhận Hàng -->
            <div class="space-y-1">
              <label class="block text-xs font-semibold text-slate-300">
                Số Điện Thoại Nhận Hàng <span class="text-rose-400">*</span>
              </label>
              <input
                type="text"
                [(ngModel)]="phoneNumber"
                (blur)="phoneTouched.set(true)"
                placeholder="Ví dụ: 0901234567"
                [ngClass]="isPhoneInvalid() ? 'border-rose-500/80 bg-rose-950/20 text-rose-100 placeholder-rose-400/50 focus:border-rose-400' : 'border-slate-800 bg-slate-950 text-white focus:border-indigo-500'"
                class="w-full px-4 py-2.5 border rounded-xl text-xs font-mono focus:outline-none transition-all"
              />

              @if (isPhoneInvalid()) {
                <p class="text-[11px] font-semibold text-rose-400 flex items-center gap-1.5 mt-1 animate-fade-in">
                  <span>⚠️ Vui lòng nhập số điện thoại người nhận hàng hợp lệ</span>
                </p>
              }
            </div>

            <!-- Trường 3: Chọn Phương Thức Thanh Toán -->
            <div class="space-y-2">
              <label class="block text-xs font-semibold text-slate-300">
                Chọn Phương Thức Thanh Toán <span class="text-rose-400">*</span>
              </label>
              
              <div class="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  (click)="paymentMethod = 'VNPAY'"
                  [ngClass]="paymentMethod === 'VNPAY' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-950'"
                  class="p-3 border rounded-xl text-left transition-all hover:border-slate-700"
                >
                  <div class="text-lg mb-1">🏦</div>
                  <p class="text-xs font-bold text-white">VNPAY</p>
                  <p class="text-[10px] text-slate-400">QR / Ngân hàng</p>
                </button>

                <button
                  type="button"
                  (click)="paymentMethod = 'WALLET'"
                  [ngClass]="paymentMethod === 'WALLET' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-950'"
                  class="p-3 border rounded-xl text-left transition-all hover:border-slate-700"
                >
                  <div class="text-lg mb-1">👛</div>
                  <p class="text-xs font-bold text-white">Ví ĐT</p>
                  <p class="text-[10px] text-slate-400">Số dư tài khoản</p>
                </button>

                <button
                  type="button"
                  (click)="paymentMethod = 'BANK_TRANSFER'"
                  [ngClass]="paymentMethod === 'BANK_TRANSFER' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-950'"
                  class="p-3 border rounded-xl text-left transition-all hover:border-slate-700"
                >
                  <div class="text-lg mb-1">🏧</div>
                  <p class="text-xs font-bold text-white">Chuyển Khoản</p>
                  <p class="text-[10px] text-slate-400">ATM 24/7</p>
                </button>
              </div>
            </div>
          </div>

          <!-- Total & Actions -->
          <div class="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
            <div>
              <p class="text-[10px] text-slate-400">Tổng tiền thanh toán:</p>
              <p class="text-xl font-black text-emerald-400 font-mono">
                {{ order.winningPrice | currencyVnd }}
              </p>
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                (click)="close.emit()"
                class="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                (click)="submitCheckout()"
                [disabled]="submitting()"
                class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
              >
                @if (submitting()) {
                  <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Đang xử lý...</span>
                } @else {
                  <span>⚡ XÁC NHẬN THANH TOÁN</span>
                }
              </button>
            </div>
          </div>

        </div>
      </div>
    }
  `
})
export class CheckoutModalComponent {
  @Input() order: WonAuctionResponse | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() checkoutSuccess = new EventEmitter<CheckoutResponse>();

  private orderService = inject(OrderService);
  private userSession = inject(UserSessionService);
  private toastService = inject(ToastService);

  shippingAddress = '';
  phoneNumber = '';
  paymentMethod: PaymentMethod = 'VNPAY';

  submitted = signal<boolean>(false);
  addressTouched = signal<boolean>(false);
  phoneTouched = signal<boolean>(false);
  submitting = signal<boolean>(false);

  isAddressInvalid(): boolean {
    return (this.submitted() || this.addressTouched()) && !this.shippingAddress.trim();
  }

  isPhoneInvalid(): boolean {
    return (this.submitted() || this.phoneTouched()) && !this.phoneNumber.trim();
  }

  submitCheckout(): void {
    if (!this.order) return;
    this.submitted.set(true);

    const addr = this.shippingAddress.trim();
    const phone = this.phoneNumber.trim();

    if (!addr || !phone) {
      this.toastService.showError('Thông tin chưa hợp lệ', 'Vui lòng kiểm tra các ô màu đỏ và nhập đầy đủ thông tin giao hàng!');
      return;
    }

    this.submitting.set(true);

    this.orderService.checkout(this.order.orderId, {
      shippingAddress: addr,
      phoneNumber: phone,
      paymentMethod: this.paymentMethod
    }).subscribe({
      next: (res) => {
        this.submitting.set(false);
        this.toastService.showSuccess('Thanh Toán Thành Công!', res.message || 'Thanh toán đơn hàng thành công!');
        this.checkoutSuccess.emit(res);
        this.close.emit();
      },
      error: (err) => {
        this.submitting.set(false);
        console.error('Error during checkout:', err);
        const apiMsg = err.error?.message || err.error?.detail || err.message || 'Thanh toán thất bại!';
        this.toastService.showError('Thanh toán thất bại', apiMsg);
      }
    });
  }
}
