import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../services/admin-api.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ProductResponse } from '../../../../shared/models/product.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { ProductDetailModalComponent } from '../../../../shared/components/product-detail-modal/product-detail-modal.component';
import { CurrencyVndPipe } from '../../../../shared/pipes/currency-vnd.pipe';

@Component({
  selector: 'app-pending-approval',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent, ProductDetailModalComponent, CurrencyVndPipe],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-black text-white">Duyệt Bài Đăng Chờ Xuất Bản</h1>
        <p class="text-xs text-slate-400 mt-1">Danh sách tất cả sản phẩm ở trạng thái PENDING chờ Ban Quản Trị thẩm định.</p>
      </div>

      @if (loading()) {
        <div class="h-64 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse"></div>
      } @else if (pendingProducts().length === 0) {
        <div class="text-center py-16 bg-slate-900/30 rounded-3xl border border-slate-800 p-8">
          <div class="text-4xl mb-3">✅</div>
          <h3 class="text-base font-bold text-slate-300">Không có bài đăng nào chờ duyệt</h3>
          <p class="text-xs text-slate-500 mt-1">Toàn bộ sản phẩm gửi lên đã được xử lý xong.</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          @for (item of pendingProducts(); track item.productId) {
            <div class="bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between transition-all">
              
              <!-- Clickable Content Box to Open Detail Modal -->
              <div (click)="previewProduct.set(item)" class="space-y-3 cursor-pointer group">
                <div class="flex items-start justify-between gap-2">
                  <h3 class="font-bold text-base text-white group-hover:text-indigo-400 transition-colors leading-snug">{{ item.title }}</h3>
                  <app-status-badge [status]="item.status" />
                </div>

                <p class="text-xs text-slate-400 line-clamp-2 leading-relaxed">{{ item.description }}</p>

                <!-- Media Preview -->
                @if (item.images && item.images.length > 0) {
                  <div class="h-44 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden relative">
                    <img [src]="item.images[0].imageUrl" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div class="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold text-white gap-1.5">
                      <span>👁️ Click để đọc chi tiết sản phẩm</span>
                    </div>
                  </div>
                }

                <div class="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                  <div>
                    <span class="text-slate-500 text-[10px] block">Loại hình</span>
                    <span class="font-mono text-indigo-300 font-bold">{{ item.auctionType }}</span>
                  </div>
                  <div>
                    <span class="text-slate-500 text-[10px] block">Giá khởi điểm</span>
                    <span class="font-mono text-emerald-400 font-bold">{{ item.startPrice | currencyVnd }}</span>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="pt-4 border-t border-slate-800 flex items-center gap-2">
                <button
                  (click)="previewProduct.set(item)"
                  class="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  👁️ Xem Chi Tiết
                </button>

                <button
                  (click)="approve(item.productId)"
                  class="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>✓ Chấp Thuận</span>
                </button>
                <button
                  (click)="openRejectModal(item)"
                  class="py-2.5 px-3 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <span>✕ Từ Chối</span>
                </button>
              </div>

            </div>
          }
        </div>
      }

      <!-- Shared Product Detail Modal -->
      <app-product-detail-modal
        [product]="previewProduct()"
        [showAdminActions]="true"
        (close)="previewProduct.set(null)"
        (approve)="onModalApprove($event)"
        (reject)="onModalReject($event)"
      />

      <!-- Reject Reason Modal -->
      @if (selectedProductForReject()) {
        <div class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 class="text-lg font-bold text-white">Từ Chối Bài Đăng #{{ selectedProductForReject()!.productId }}</h3>
            <p class="text-xs text-slate-400">Vui lòng cung cấp lý do từ chối cụ thể gửi cho Seller:</p>

            <textarea
              [(ngModel)]="rejectionReason"
              rows="3"
              placeholder="Nhập lý do từ chối (Ví dụ: Ảnh sản phẩm không rõ ràng, mô tả sai danh mục...)"
              class="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-rose-500"
            ></textarea>

            <div class="flex items-center justify-end gap-3 pt-2">
              <button (click)="selectedProductForReject.set(null)" class="px-4 py-2 text-xs text-slate-400 hover:text-white">
                Hủy bỏ
              </button>
              <button
                (click)="confirmReject()"
                [disabled]="!rejectionReason.trim()"
                class="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30"
              >
                Xác Nhận Từ Chối
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class PendingApprovalComponent implements OnInit {
  private adminService = inject(AdminApiService);
  private toastService = inject(ToastService);

  pendingProducts = signal<ProductResponse[]>([]);
  loading = signal<boolean>(true);

  previewProduct = signal<ProductResponse | null>(null);
  selectedProductForReject = signal<ProductResponse | null>(null);
  rejectionReason = '';

  ngOnInit(): void {
    this.loadPending();
  }

  loadPending(): void {
    this.loading.set(true);
    this.adminService.getPendingProducts().subscribe({
      next: (res) => {
        this.pendingProducts.set(res);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  approve(productId: number): void {
    this.adminService.approveProduct(productId).subscribe({
      next: () => {
        this.toastService.showSuccess('Đã Duyệt Bài', `Sản phẩm #${productId} đã chính thức được kích hoạt trên sàn!`);
        this.previewProduct.set(null);
        this.loadPending();
      }
    });
  }

  onModalApprove(productId: number): void {
    this.approve(productId);
  }

  onModalReject(product: ProductResponse): void {
    this.previewProduct.set(null);
    this.openRejectModal(product);
  }

  openRejectModal(product: ProductResponse): void {
    this.rejectionReason = '';
    this.selectedProductForReject.set(product);
  }

  confirmReject(): void {
    const p = this.selectedProductForReject();
    if (!p || !this.rejectionReason.trim()) return;

    this.adminService.rejectProduct(p.productId, { rejectionReason: this.rejectionReason }).subscribe({
      next: () => {
        this.toastService.showSuccess('Đã Từ Chối Bài', `Sản phẩm #${p.productId} đã bị từ chối với lý do lưu vết.`);
        this.selectedProductForReject.set(null);
        this.loadPending();
      }
    });
  }
}
