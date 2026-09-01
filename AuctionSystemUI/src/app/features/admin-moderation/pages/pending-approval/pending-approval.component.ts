import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../services/admin-api.service';
import { ToastService } from '../../../../core/services/toast.service';
import { LanguageService } from '../../../../core/services/language.service';
import { ProductResponse } from '../../../../shared/models/product.model';
import { ProductDetailModalComponent } from '../../../../shared/components/product-detail-modal/product-detail-modal.component';
import { CurrencyVndPipe } from '../../../../shared/pipes/currency-vnd.pipe';

/**
 * ====================================================================================
 * 🛡️ PENDING APPROVAL COMPONENT (Duyệt Bài Đăng Chờ Xuất Bản - Chuẩn 100% Mockup Gold Luxe)
 * ====================================================================================
 */
@Component({
  selector: 'app-pending-approval',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductDetailModalComponent, CurrencyVndPipe],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto">
      
      <!-- Header Banner Tiêu Đề -->
      <div class="border-b border-emerald-900/30 pb-4">
        <span class="text-[11px] font-bold tracking-widest text-[#c5a059] uppercase">
          — THẨM ĐỊNH NỘI DUNG
        </span>
        <h1 class="text-3xl font-serif font-bold text-white tracking-tight mt-1">
          Duyệt bài đăng chờ xuất bản
        </h1>
        <p class="text-xs text-slate-400 mt-1">
          Danh sách sản phẩm đang chờ Ban Quản Trị thẩm định trước khi lên sàn.
        </p>
      </div>

      <!-- Filter Tabs Bar (Xem: Có bài chờ duyệt vs Xem: Đã xử lý hết) -->
      <div class="flex items-center gap-3">
        <button
          (click)="activeTab.set('PENDING')"
          [class]="activeTab() === 'PENDING' ? 'bg-[#c5a059] text-slate-950 font-bold shadow-lg shadow-[#c5a059]/20' : 'bg-[#07120d] text-slate-400 border border-emerald-900/40 hover:text-white'"
          class="px-5 py-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-2"
        >
          <span>Xem: Có bài chờ duyệt</span>
          <span class="px-1.5 py-0.5 rounded bg-slate-950/80 text-[10px] font-mono" [class.text-slate-950]="activeTab() === 'PENDING'">
            {{ pendingProducts().length }}
          </span>
        </button>

        <button
          (click)="activeTab.set('PROCESSED')"
          [class]="activeTab() === 'PROCESSED' ? 'bg-[#c5a059] text-slate-950 font-bold shadow-lg shadow-[#c5a059]/20' : 'bg-[#07120d] text-slate-400 border border-emerald-900/40 hover:text-white'"
          class="px-5 py-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-2"
        >
          <span>Xem: Đã xử lý hết</span>
        </button>
      </div>

      <!-- Content Area -->
      @if (loading()) {
        <div class="space-y-4 pt-2">
          @for (i of [1,2]; track i) {
            <div class="h-28 rounded-2xl bg-[#07120d] border border-emerald-900/30 animate-pulse"></div>
          }
        </div>
      } @else if (displayedList().length === 0) {
        <!-- Khung Hiển Thị Rỗng Chuẩn Mockup -->
        <div class="py-24 bg-[#050b08]/80 border border-emerald-900/30 rounded-2xl text-center flex flex-col items-center justify-center p-8 space-y-4 shadow-2xl">
          <div class="w-16 h-16 rotate-45 border-2 border-[#c5a059]/60 bg-[#c5a059]/10 flex items-center justify-center mb-2 shadow-inner">
            <span class="-rotate-45 text-[#c5a059] font-serif font-black text-2xl">✓</span>
          </div>

          <h3 class="text-lg font-serif font-bold text-white tracking-wide">
            Không có bài đăng nào chờ duyệt
          </h3>

          <p class="text-xs text-slate-400 max-w-md leading-relaxed">
            Toàn bộ sản phẩm gửi lên đã được Ban Quản Trị thẩm định và xử lý hoàn tất.
          </p>
        </div>
      } @else {
        <!-- Danh Sách Các Lô Bài Đăng Hàng Ngang (Horizontal Card Rows Chuẩn Màn Hình Khách Gửi) -->
        <div class="space-y-4 pt-2">
          @for (item of displayedList(); track item.productId) {
            <div class="group bg-[#07120d] border border-emerald-900/40 hover:border-[#c5a059]/60 rounded-2xl p-5 shadow-xl transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <!-- Bên Trái: Thumbnail & Nội Dung Thông Tin -->
              <div class="flex items-center gap-5 flex-1 min-w-0">
                
                <!-- Box Ảnh Thumbnail -->
                <div (click)="previewProduct.set(item)" class="w-32 h-24 bg-[#050b08] border border-emerald-900/40 rounded-xl overflow-hidden shrink-0 cursor-pointer flex items-center justify-center group-hover:border-[#c5a059]/50 transition-colors">
                  @if (item.images && item.images.length > 0 && item.images[0].imageUrl) {
                    <img [src]="item.images[0].imageUrl" [alt]="item.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  } @else {
                    <span class="text-xs text-slate-500 font-medium">Ảnh sản phẩm</span>
                  }
                </div>

                <!-- Chi Tiết Sản Phẩm -->
                <div class="space-y-1.5 min-w-0 flex-1">
                  <div class="text-[10px] font-mono font-bold tracking-widest text-[#c5a059] uppercase">
                    LOT — CHỜ CẤP MÃ
                  </div>

                  <h3 (click)="previewProduct.set(item)" class="font-serif font-bold text-lg text-white group-hover:text-[#c5a059] transition-colors truncate cursor-pointer">
                    {{ item.title }}
                  </h3>

                  <div class="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-slate-400">
                    <span>Người bán: <strong class="text-slate-200 font-semibold">{{ item.sellerName || 'Văn Dương' }}</strong></span>
                    <span>Danh mục: <strong class="text-slate-200 font-semibold">{{ item.categoryName || 'Đồng Hồ & Trang Sức' }}</strong></span>
                    <span>Giá khởi điểm: <strong class="text-[#c5a059] font-mono font-bold">{{ item.startPrice | currencyVnd }}</strong></span>
                  </div>
                </div>

              </div>

              <!-- Bên Phải: Nút Thao Tác Từ Chối / Phê Duyệt -->
              <div class="flex items-center gap-3 shrink-0">
                <button
                  (click)="openRejectModal(item)"
                  class="px-5 py-2.5 rounded-xl text-xs font-semibold border border-rose-800/60 bg-rose-950/30 hover:bg-rose-600 hover:text-white text-rose-300 transition-all cursor-pointer"
                >
                  Từ chối
                </button>

                <button
                  (click)="approve(item.productId)"
                  class="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#c5a059] hover:bg-[#d4af66] text-slate-950 shadow-lg shadow-[#c5a059]/20 transition-all cursor-pointer"
                >
                  Phê duyệt
                </button>
              </div>

            </div>
          }
        </div>
      }

      <!-- Component Modal Xem Chi Tiết -->
      <app-product-detail-modal
        [product]="previewProduct()"
        [showAdminActions]="true"
        (close)="previewProduct.set(null)"
        (approve)="onModalApprove($event)"
        (reject)="onModalReject($event)"
      />

      <!-- Modal Nhập Lý Do Từ Chối -->
      @if (selectedProductForReject()) {
        <div class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="max-w-md w-full bg-[#07120d] border border-emerald-900/50 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 class="text-lg font-serif font-bold text-white">Từ Chối Bài Đăng #{{ selectedProductForReject()!.productId }}</h3>
            <p class="text-xs text-slate-400">Vui lòng cung cấp lý do từ chối cụ thể gửi tới Người Bán:</p>

            <textarea
              [(ngModel)]="rejectionReason"
              rows="3"
              placeholder="Nhập lý do từ chối (Ví dụ: Ảnh sản phẩm bị mờ, thông tin chưa đầy đủ...)"
              class="w-full px-4 py-3 bg-[#050b08] border border-emerald-900/50 rounded-xl text-xs text-white placeholder-slate-600 focus:border-[#c5a059] focus:outline-none"
            ></textarea>

            <div class="flex items-center justify-end gap-3 pt-2">
              <button (click)="selectedProductForReject.set(null)" class="px-4 py-2 text-xs text-slate-400 hover:text-white">
                Hủy bỏ
              </button>
              <button
                (click)="confirmReject()"
                [disabled]="!rejectionReason.trim()"
                class="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30"
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
  langService = inject(LanguageService);

  pendingProducts = signal<ProductResponse[]>([]);
  loading = signal<boolean>(true);
  activeTab = signal<'PENDING' | 'PROCESSED'>('PENDING');

  previewProduct = signal<ProductResponse | null>(null);
  selectedProductForReject = signal<ProductResponse | null>(null);
  rejectionReason = '';

  displayedList = computed(() => {
    if (this.activeTab() === 'PENDING') {
      return this.pendingProducts();
    }
    return [];
  });

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
        this.toastService.showSuccess('Đã Phê Duyệt', `Bài đăng #${productId} đã chính thức được phê duyệt xuất bản lên sàn!`);
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
        this.toastService.showSuccess('Đã Từ Chối', `Sản phẩm #${p.productId} đã bị từ chối với lý do lưu vết.`);
        this.selectedProductForReject.set(null);
        this.loadPending();
      }
    });
  }
}
