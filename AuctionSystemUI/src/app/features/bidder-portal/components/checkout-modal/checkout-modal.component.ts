import { Component, Input, Output, EventEmitter, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../../../core/services/order.service';
import { WalletService } from '../../../../core/services/wallet.service';
import { UserSessionService } from '../../../../core/auth/user-session.service';
import { ToastService } from '../../../../core/services/toast.service';
import { WonAuctionResponse, CheckoutResponse, PaymentMethod } from '../../../../shared/models/order.model';
import { WalletResponse } from '../../../../shared/models/wallet.model';
import { CurrencyVndPipe } from '../../../../shared/pipes/currency-vnd.pipe';

/**
 * ====================================================================================
 * 💳 CHECKOUT MODAL COMPONENT (Popup Thanh Toán Đơn Hàng Phía Người Mua bằng Ví Escrow)
 * ====================================================================================
 */
@Component({
  selector: 'app-checkout-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyVndPipe],
  template: `
    @if (order) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
        <div class="bg-slate-900 border border-amber-500/30 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative overflow-hidden text-slate-100">
          
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <!-- Header Popup -->
          <div class="flex items-center justify-between border-b border-slate-800 pb-4">
            <div class="flex items-center gap-2.5">
              <span class="text-xl p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">💳</span>
              <div>
                <h2 class="text-lg font-black text-white">Thanh Toán Đơn Hàng Escrow</h2>
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
                [ngClass]="isAddressInvalid() ? 'border-rose-500/80 bg-rose-950/20 text-rose-100 placeholder-rose-400/50 focus:border-rose-400' : 'border-slate-800 bg-slate-950 text-white focus:border-amber-500'"
                class="w-full px-4 py-2.5 border rounded-xl text-xs focus:outline-none leading-relaxed transition-all"
              ></textarea>

              @if (isAddressInvalid()) {
                <p class="text-[11px] font-semibold text-rose-400 flex items-center gap-1.5 mt-1 animate-fade-in">
                  <span>⚠️ Vui lòng nhập địa chỉ giao hàng chi tiết</span>
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
                [ngClass]="isPhoneInvalid() ? 'border-rose-500/80 bg-rose-950/20 text-rose-100 placeholder-rose-400/50 focus:border-rose-400' : 'border-slate-800 bg-slate-950 text-white focus:border-amber-500'"
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
                  (click)="paymentMethod = 'WALLET'"
                  [ngClass]="paymentMethod === 'WALLET' ? 'border-amber-500 bg-amber-500/10' : 'border-slate-800 bg-slate-950'"
                  class="p-3 border rounded-xl text-left transition-all hover:border-amber-500/50"
                >
                  <div class="text-lg mb-1">👛</div>
                  <p class="text-xs font-bold text-amber-300">Ví Ảo Đấu Giá</p>
                  <p class="text-[10px] text-slate-400">Escrow Bảo Đảm</p>
                </button>

                <button
                  type="button"
                  (click)="paymentMethod = 'VNPAY'"
                  [ngClass]="paymentMethod === 'VNPAY' ? 'border-amber-500 bg-amber-500/10' : 'border-slate-800 bg-slate-950'"
                  class="p-3 border rounded-xl text-left transition-all hover:border-slate-700"
                >
                  <div class="text-lg mb-1">🏦</div>
                  <p class="text-xs font-bold text-white">VNPAY QR</p>
                  <p class="text-[10px] text-slate-400">Ngân hàng 24/7</p>
                </button>

                <button
                  type="button"
                  (click)="paymentMethod = 'BANK_TRANSFER'"
                  [ngClass]="paymentMethod === 'BANK_TRANSFER' ? 'border-amber-500 bg-amber-500/10' : 'border-slate-800 bg-slate-950'"
                  class="p-3 border rounded-xl text-left transition-all hover:border-slate-700"
                >
                  <div class="text-lg mb-1">🏧</div>
                  <p class="text-xs font-bold text-white">Chuyển Khoản</p>
                  <p class="text-[10px] text-slate-400">ATM Nội địa</p>
                </button>
              </div>

              <!-- Live Wallet Balance Card inside Modal -->
              @if (paymentMethod === 'WALLET') {
                <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-slate-400">Số dư ví khả dụng:</span>
                    <span class="font-mono font-bold text-emerald-400">
                      {{ (walletInfo()?.availableBalance || 0) | currencyVnd }}
                    </span>
                  </div>

                  @if ((walletInfo()?.availableBalance || 0) < order.winningPrice) {
                    <div class="flex items-center justify-between p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs">
                      <span class="text-rose-400 flex items-center gap-1 font-semibold">
                        ⚠️ Số dư không đủ để thanh toán đơn hàng này!
                      </span>
                      <button
                        type="button"
                        (click)="navigateToWallet()"
                        class="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-all"
                      >
                        + Nạp ngay
                      </button>
                    </div>
                  } @else {
                    <p class="text-[11px] text-amber-400/90 flex items-center gap-1">
                      🔒 Tiền sẽ được khóa giữ an toàn Escrow cho đến khi bạn bấm "Đã nhận hàng".
                    </p>
                  }
                </div>
              }
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
                [disabled]="submitting() || (paymentMethod === 'WALLET' && (walletInfo()?.availableBalance || 0) < order.winningPrice)"
                class="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-900/30 transition-all flex items-center gap-2"
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
export class CheckoutModalComponent implements OnInit {
  @Input() order: WonAuctionResponse | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() checkoutSuccess = new EventEmitter<CheckoutResponse>();

  private orderService = inject(OrderService);
  private walletService = inject(WalletService);
  private userSession = inject(UserSessionService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  shippingAddress = '';
  phoneNumber = '';
  paymentMethod: PaymentMethod = 'WALLET';

  walletInfo = signal<WalletResponse | null>(null);
  submitted = signal<boolean>(false);
  addressTouched = signal<boolean>(false);
  phoneTouched = signal<boolean>(false);
  submitting = signal<boolean>(false);

  ngOnInit(): void {
    this.walletService.getWallet().subscribe({
      next: (res) => this.walletInfo.set(res),
      error: () => {}
    });
  }

  navigateToWallet(): void {
    this.close.emit();
    this.router.navigate(['/wallet']);
  }

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

    if (this.paymentMethod === 'WALLET') {
      const avail = this.walletInfo()?.availableBalance || 0;
      if (avail < this.order.winningPrice) {
        this.toastService.showError('Số dư không đủ', 'Số dư ví ảo khả dụng không đủ để thanh toán. Vui lòng nạp thêm!');
        return;
      }
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

