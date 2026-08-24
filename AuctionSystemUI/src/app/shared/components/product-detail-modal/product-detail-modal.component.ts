import { Component, EventEmitter, Input, Output, OnChanges, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductResponse } from '../../models/product.model';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import { CurrencyVndPipe } from '../../pipes/currency-vnd.pipe';
import { AuctionTimerPipe } from '../../pipes/auction-timer.pipe';

/**
 * ====================================================================================
 * 📋 PRODUCT DETAIL MODAL COMPONENT (Popup Xem Chi Tiết Bài Đăng Nội Bộ)
 * ====================================================================================
 * Component Popup nội bộ dùng chung cho cả Admin (Duyệt bài) và Seller (Quản lý sản phẩm).
 * Cho phép xem trước hình ảnh, giá khởi điểm, bước giá, thuộc tính động JSONB, và mô tả
 * mà không cần chuyển hướng khỏi trang hiện tại.
 */
@Component({
  selector: 'app-product-detail-modal',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent, CurrencyVndPipe, AuctionTimerPipe],
  template: `
    <!-- Kiểm tra nếu có dữ liệu sản phẩm truyền vào thì mới hiển thị Overlay Popup -->
    @if (product) {
      <!-- Overlay phủ mờ toàn màn hình (Z-index 50) -->
      <div class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
        
        <!-- Khung chứa nội dung Modal chính (Max width 4XL, Bo góc 3xl, Đổ bóng 2xl) -->
        <div class="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
          
          <!-- Nút Đóng Modal góc trên bên phải -->
          <button
            (click)="closeModal()"
            title="Đóng cửa sổ"
            class="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center font-bold text-sm transition-all z-10"
          >
            ✕
          </button>

          <!-- Header Modal: Mã Sản Phẩm, Mã Phiên Đấu Giá & Badge Trạng Thái -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 pr-10">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <!-- Mã ID Sản phẩm -->
                <span class="text-xs text-indigo-400 font-mono font-semibold">Mã SP: #{{ product.productId }}</span>
                <span class="text-xs text-slate-500">•</span>
                <!-- Mã ID Phiên đấu giá -->
                <span class="text-xs text-slate-400 font-mono">Mã Thầu: #{{ product.auctionId }}</span>
              </div>
              <!-- Tiêu đề Sản phẩm -->
              <h2 class="text-xl font-extrabold text-white leading-tight">{{ product.title }}</h2>
            </div>
            
            <!-- Component Badge Trạng thái bài đăng -->
            <app-status-badge [status]="product.auctionStatus || product.status" [endTime]="product.endTime" />
          </div>

          <!-- Thân Modal: Hình Ảnh Gallery bên trái (6 Cột) & Chi Tiết Giá bên phải (6 Cột) -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            <!-- Cột Trái (6 Cột): Khung Ảnh Phóng To & Thumbnail Ảnh Phụ -->
            <div class="md:col-span-6 space-y-3">
              <!-- Khung hiển thị Ảnh Chính đang chọn -->
              <div class="aspect-video w-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden relative shadow-lg">
                @if (activeImg()) {
                  <img [src]="activeImg()" [alt]="product.title" class="w-full h-full object-contain p-2" />
                } @else {
                  <div class="w-full h-full flex items-center justify-center text-slate-700 text-4xl">🖼</div>
                }
              </div>

              <!-- Danh sách Thumbnails các Ảnh Phụ (Bấm vào để đổi Ảnh Chính) -->
              @if (product.images && product.images.length > 1) {
                <div class="flex gap-2 overflow-x-auto pb-1">
                  @for (img of product.images; track img.id) {
                    <button
                      (click)="activeImg.set(img.imageUrl)"
                      [class]="activeImg() === img.imageUrl ? 'border-indigo-500 ring-2 ring-indigo-500/30' : 'border-slate-800 opacity-60 hover:opacity-100'"
                      class="w-16 h-12 rounded-xl bg-slate-950 border overflow-hidden flex-shrink-0 transition-all"
                    >
                      <img [src]="img.imageUrl" class="w-full h-full object-cover" />
                    </button>
                  }
                </div>
              }
            </div>

            <!-- Cột Phải (6 Cột): Các Thông Số Tài Chính & Khung Thời Gian Đấu Giá -->
            <div class="md:col-span-6 space-y-4">
              
              <!-- Bảng Thông Số Giá (Phân chia theo Loại hình AuctionType) -->
              <div class="grid grid-cols-2 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
                <div>
                  <span class="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">Loại hình</span>
                  <span class="font-mono text-indigo-300 font-bold text-sm">{{ product.auctionType }}</span>
                </div>

                <!-- Phân biệt theo Loại hình MUA NGAY (BUY_NOW) vs ĐẤU GIÁ (ENGLISH / RESERVE) -->
                @if (product.auctionType === 'BUY_NOW') {
                  <div>
                    <span class="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">Giá mua ngay</span>
                    <span class="font-mono text-emerald-400 font-bold text-sm">{{ (product.buyNowPrice || product.startPrice) | currencyVnd }}</span>
                  </div>
                } @else {
                  <div>
                    <span class="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">Giá khởi điểm</span>
                    <span class="font-mono text-emerald-400 font-bold text-sm">{{ product.startPrice | currencyVnd }}</span>
                  </div>

                  <div>
                    <span class="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">Bước giá</span>
                    <span class="font-mono text-slate-200 font-bold">{{ product.bidStep | currencyVnd }}</span>
                  </div>
                }

                <!-- Giá bảo lưu áp dụng riêng cho loại hình RESERVE -->
                @if (product.auctionType === 'RESERVE' && product.reservePrice) {
                  <div>
                    <span class="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">Giá bảo lưu</span>
                    <span class="font-mono text-amber-300 font-bold">{{ product.reservePrice | currencyVnd }}</span>
                  </div>
                }
              </div>

              <!-- Khung Thời Gian Bắt Đầu / Kết Thúc -->
              <div class="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs space-y-1">
                <div class="flex justify-between text-slate-400">
                  <span>Bắt đầu:</span>
                  <span class="font-mono text-slate-200">{{ product.startTime ? (product.startTime | date:'dd/MM/yyyy HH:mm') : 'Ngay sau khi duyệt' }}</span>
                </div>
                <div class="flex justify-between text-slate-400">
                  <span>Kết thúc:</span>
                  <span class="font-mono text-slate-200">{{ product.endTime ? (product.endTime | date:'dd/MM/yyyy HH:mm') : 'N/A' }}</span>
                </div>
              </div>

              <!-- Hiển thị Lý do từ chối nếu bài bị Admin từ chối -->
              @if (product.rejectionReason) {
                <div class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                  <strong>Lý do từ chối:</strong> {{ product.rejectionReason }}
                </div>
              }
            </div>

          </div>

          <!-- Thuộc Tính Động JSONB (Thông số kỹ thuật sản phẩm) -->
          @if (attrEntries.length > 0) {
            <div class="pt-4 border-t border-slate-800 space-y-3">
              <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>⚙️</span> Thông Số & Thuộc Tính Kỹ Thuật
              </h4>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                @for (attr of attrEntries; track attr.key) {
                  <div class="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <p class="text-[9px] uppercase font-bold text-slate-500 tracking-wider">{{ attr.key }}</p>
                    <p class="text-xs font-semibold text-indigo-300 font-mono truncate">{{ attr.value }}</p>
                  </div>
                }
              </div>
            </div>
          }

          <!-- Mô Tả Chi Tiết Sản Phẩm -->
          <div class="pt-4 border-t border-slate-800 space-y-2">
            <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>📝</span> Mô Tả Chi Tiết
            </h4>
            <p class="text-xs text-slate-300 whitespace-pre-line leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800 max-h-40 overflow-y-auto">
              {{ product.description }}
            </p>
          </div>

          <!-- Thanh Thao Tác (Action Bar) Dưới Cùng -->
          <div class="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <!-- Nút thao tác của ADMIN (Cho phép Duyệt / Từ chối) -->
            @if (showAdminActions) {
              <button
                (click)="onApprove()"
                class="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5"
              >
                <span>✓ Duyệt Cho Lên Sàn</span>
              </button>
              <button
                (click)="onReject()"
                class="py-2.5 px-5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
              >
                <span>✕ Từ Chối Bài</span>
              </button>
            }

            <!-- Nút thao tác của SELLER (Cho phép Sửa bài) -->
            @if (showSellerActions) {
              <button
                (click)="onEdit()"
                class="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
              >
                <span>✏️ Chỉnh Sửa Bài Đăng</span>
              </button>
            }

            <!-- Nút Đóng Modal -->
            <button
              (click)="closeModal()"
              class="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-all"
            >
              Đóng
            </button>
          </div>

        </div>
      </div>
    }
  `
})
export class ProductDetailModalComponent implements OnChanges {
  // Dữ liệu sản phẩm truyền từ Component cha vào
  @Input() product: ProductResponse | null = null;
  // Cờ bật hiển thị các nút Duyệt/Từ chối của Admin
  @Input() showAdminActions: boolean = false;
  // Cờ bật hiển thị nút Chỉnh sửa của Seller
  @Input() showSellerActions: boolean = false;

  // Các sự kiện phát ra cho Component cha xử lý
  @Output() close = new EventEmitter<void>();
  @Output() approve = new EventEmitter<number>();
  @Output() reject = new EventEmitter<ProductResponse>();
  @Output() edit = new EventEmitter<number>();

  // Angular 18 Signal lưu URL của ảnh đang được chọn phóng to
  activeImg = signal<string>('');

  /**
   * Lifecycle Hook ngOnChanges: Chạy tự động mỗi khi giá trị @Input() product thay đổi.
   * Nhiệm vụ: Tự động gán ảnh mặc định là ảnh đầu tiên trong danh sách ảnh của sản phẩm.
   */
  ngOnChanges(): void {
    if (this.product && this.product.images && this.product.images.length > 0) {
      this.activeImg.set(this.product.images[0].imageUrl);
    }
  }

  /**
   * Getter attrEntries: Chuyển đổi Object chứa thuộc tính động JSONB (`attributes`)
   * thành mảng danh sách Key-Value để lặp hiển thị lên giao diện thông số kỹ thuật.
   */
  get attrEntries(): { key: string; value: string }[] {
    if (!this.product || !this.product.attributes || typeof this.product.attributes !== 'object') return [];
    return Object.entries(this.product.attributes).map(([key, value]) => ({ key, value: String(value) }));
  }

  // Hàm phát sự kiện đóng Modal
  closeModal(): void {
    this.close.emit();
  }

  // Hàm phát sự kiện Admin bấm Phê duyệt sản phẩm
  onApprove(): void {
    if (this.product) this.approve.emit(this.product.productId);
  }

  // Hàm phát sự kiện Admin bấm Từ chối sản phẩm
  onReject(): void {
    if (this.product) this.reject.emit(this.product);
  }

  // Hàm phát sự kiện Seller bấm Chỉnh sửa sản phẩm
  onEdit(): void {
    if (this.product) this.edit.emit(this.product.productId);
  }
}
