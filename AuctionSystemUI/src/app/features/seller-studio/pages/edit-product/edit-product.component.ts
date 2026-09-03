import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { SellerApiService } from '../../services/seller-api.service';
import { PublicMarketplaceService } from '../../../public-marketplace/services/public-marketplace.service';
import { CategoryService, Category } from '../../../../core/services/category.service';
import { UserSessionService } from '../../../../core/auth/user-session.service';
import { ToastService } from '../../../../core/services/toast.service';
import { LanguageService } from '../../../../core/services/language.service';
import { AuctionType } from '../../../../shared/models/enums.model';
import { ProductResponse, ProductImageResponse } from '../../../../shared/models/product.model';
import { CurrencyVndPipe } from '../../../../shared/pipes/currency-vnd.pipe';

/**
 * ====================================================================================
 * ✏️ EDIT PRODUCT COMPONENT (Trang Chỉnh Sửa Sản Phẩm & Quản Lý Ảnh Xóa/Thêm)
 * ====================================================================================
 */
@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CurrencyVndPipe],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto px-4 py-4">
      
      <!-- Header Banner Tiêu Đề -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-900/30 pb-4">
        <div>
          <span class="text-[11px] font-bold tracking-widest text-[#c5a059] uppercase">
            {{ langService.translate('edit.headerSub') }}{{ productId }}
          </span>
          <h1 class="text-3xl font-serif font-bold text-white tracking-tight mt-1">
            {{ langService.translate('edit.headerTitle') }}
          </h1>
          <p class="text-xs text-slate-400 mt-1">
            {{ langService.translate('edit.headerSubText') }}
          </p>
        </div>

        <a
          routerLink="/seller"
          class="text-xs text-slate-400 hover:text-[#c5a059] transition-colors flex items-center gap-1 font-medium"
        >
          <span>{{ langService.translate('edit.backLink') }}</span>
        </a>
      </div>

      @if (loading()) {
        <div class="h-96 rounded-2xl bg-[#07120d] border border-emerald-900/30 animate-pulse"></div>
      } @else {
        <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Cột Phía Trái: Form A & B -->
          <div class="lg:col-span-2 space-y-6">
            
            <!-- Khung A. Thông tin sản phẩm & Hình ảnh -->
            <div class="bg-[#07120d] border border-emerald-900/40 rounded-2xl p-6 space-y-6 shadow-xl">
              <h2 class="text-sm font-bold text-[#c5a059] tracking-wide flex items-center gap-2 border-b border-emerald-900/30 pb-3">
                {{ langService.translate('create.sectionA') }}
              </h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-2">
                    {{ langService.translate('create.categoryLabel') }} <span class="text-rose-400">*</span>
                  </label>
                  <select
                    formControlName="categoryId"
                    [ngClass]="isInvalid('categoryId') ? 'border-rose-500/80 bg-rose-950/20 text-rose-100' : 'border-emerald-900/50 bg-[#050b08] text-white focus:border-[#c5a059]'"
                    class="w-full px-4 py-3 border rounded-xl text-xs focus:outline-none transition-all appearance-none cursor-pointer"
                  >
                    @for (cat of categories(); track cat.id) {
                      <option [value]="cat.id" class="bg-slate-900 text-white">
                        {{ cat.parentId ? '↳ ' + cat.name : '📁 ' + cat.name }}
                      </option>
                    }
                  </select>
                </div>

                <div>
                  <div class="flex items-center justify-between mb-2">
                    <label class="text-xs font-semibold text-slate-300">
                      {{ langService.translate('create.titleLabel') }} <span class="text-rose-400">*</span>
                    </label>
                    <span class="text-[10px] text-slate-500 font-mono">{{ langService.translate('create.titleLength') }}</span>
                  </div>
                  <input
                    type="text"
                    formControlName="title"
                    [placeholder]="langService.translate('create.titlePlaceholder')"
                    [ngClass]="isInvalid('title') ? 'border-rose-500/80 bg-rose-950/20 text-rose-100 placeholder-rose-400/50' : 'border-emerald-900/50 bg-[#050b08] text-white placeholder-slate-600 focus:border-[#c5a059]'"
                    class="w-full px-4 py-3 border rounded-xl text-xs focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-2">
                  {{ langService.translate('create.descLabel') }} <span class="text-rose-400">*</span>
                </label>
                <textarea
                  formControlName="description"
                  rows="4"
                  [placeholder]="langService.translate('create.descPlaceholder')"
                  [ngClass]="isInvalid('description') ? 'border-rose-500/80 bg-rose-950/20 text-rose-100 placeholder-rose-400/50' : 'border-emerald-900/50 bg-[#050b08] text-white placeholder-slate-600 focus:border-[#c5a059]'"
                  class="w-full px-4 py-3 border rounded-xl text-xs focus:outline-none transition-all leading-relaxed"
                ></textarea>
              </div>

              <!-- ========================================================================= -->
              <!-- 🖼️ KHUNG QUẢN LÝ HÌNH ẢNH SẢN PHẨM (XÓA ẢNH CŨ & THÊM ẢNH MỚI) -->
              <!-- ========================================================================= -->
              <div class="space-y-5 pt-4 border-t border-emerald-900/30">
                <div class="flex items-center justify-between">
                  <h3 class="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
                    <span>🖼️</span> {{ langService.translate('create.imagesLabel') }}
                  </h3>
                  <span class="text-[11px] font-mono text-slate-400">
                    {{ langService.translate('edit.totalImagesCount') }} 
                    <strong [ngClass]="totalRemainingImages() < 1 ? 'text-rose-400 font-black' : 'text-[#c5a059] font-bold'">
                      {{ totalRemainingImages() }}
                    </strong> / 20
                  </span>
                </div>

                <!-- 1. Danh Sách Ảnh Đã Đăng (Ảnh Gốc Tải Từ Hệ Thống) -->
                @if (existingImages().length > 0) {
                  <div class="space-y-3">
                    <p class="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>{{ langService.translate('edit.existingImagesTitle') }} ({{ existingImages().length }})</span>
                      <span class="text-[11px] text-amber-400/90 font-normal">
                        Rê chuột vào ảnh và bấm nút 🗑️ để xóa ảnh cũ
                      </span>
                    </p>

                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      @for (img of existingImages(); track img.id; let idx = $index) {
                        <div class="relative group h-28 bg-[#050b08] border border-emerald-900/60 rounded-xl overflow-hidden shadow-md">
                          <img [src]="img.imageUrl" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          
                          <span class="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur text-[10px] font-bold text-[#c5a059] border border-[#c5a059]/30">
                            Ảnh #{{ idx + 1 }}
                          </span>

                          <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-2">
                            <button
                              type="button"
                              (click)="removeExistingImage(img.id)"
                              class="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold shadow-lg transition-all flex items-center gap-1 scale-95 hover:scale-100 cursor-pointer"
                            >
                              <span>🗑️</span>
                              <span>{{ langService.translate('edit.deleteImageBtn') }}</span>
                            </button>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                }

                <!-- 2. Khung Bổ Sung Hình Ảnh Mới -->
                <div class="space-y-3 pt-2">
                  <label class="block text-xs font-semibold text-slate-300">
                    {{ langService.translate('edit.newImagesTitle') }} <span class="text-slate-400 font-normal">(Tùy chọn)</span>
                  </label>

                  <div
                    (click)="fileInput.click()"
                    class="border-2 border-dashed border-emerald-900/60 hover:border-[#c5a059]/80 bg-[#050b08] hover:bg-[#07120d] rounded-2xl p-5 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center space-y-2"
                  >
                    <input
                      #fileInput
                      type="file"
                      multiple
                      accept="image/*"
                      (change)="onFileSelected($event)"
                      class="hidden"
                    />
                    <span class="text-2xl text-[#c5a059]">📸</span>
                    <p class="text-xs font-bold text-slate-200">
                      {{ langService.translate('edit.newImagesSub') }}
                    </p>
                    <p class="text-[10px] text-slate-500">
                      {{ langService.translate('create.dropzoneSub') }}
                    </p>
                  </div>

                  @if (selectedFilePreviews().length > 0) {
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                      @for (src of selectedFilePreviews(); track $index; let idx = $index) {
                        <div class="relative group h-28 bg-[#050b08] border border-emerald-900/60 rounded-xl overflow-hidden shadow-md">
                          <img [src]="src" class="w-full h-full object-cover" />
                          
                          <span class="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-emerald-950/90 backdrop-blur text-[10px] font-bold text-emerald-400 border border-emerald-700/50">
                            Ảnh mới #{{ idx + 1 }}
                          </span>

                          <button
                            type="button"
                            (click)="removeNewFile(idx)"
                            class="absolute top-1.5 right-1.5 p-1 bg-rose-600/90 hover:bg-rose-500 text-white rounded-full text-[10px] font-bold w-6 h-6 flex items-center justify-center shadow-lg transition-all cursor-pointer"
                            title="Hủy chọn file mới này"
                          >
                            ✕
                          </button>
                        </div>
                      }
                    </div>
                  }
                </div>

                @if (totalRemainingImages() < 1) {
                  <p class="text-rose-400 font-bold text-xs bg-rose-950/40 border border-rose-900/50 rounded-xl p-3 text-center">
                    ⚠️ {{ langService.translate('edit.minImageWarning') }}
                  </p>
                }
              </div>

            </div>

            <!-- Khung B. Cấu hình phiên đấu giá -->
            <div class="bg-[#07120d] border border-emerald-900/40 rounded-2xl p-6 space-y-5 shadow-xl">
              <h2 class="text-sm font-bold text-[#c5a059] tracking-wide flex items-center gap-2 border-b border-emerald-900/30 pb-3">
                {{ langService.translate('create.sectionB') }}
              </h2>

              <!-- Chọn Loại Đấu Giá -->
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-2">
                  {{ langService.translate('create.auctionTypeLabel') }} <span class="text-rose-400">*</span>
                </label>
                <select
                  formControlName="auctionType"
                  class="w-full px-4 py-3 border border-emerald-900/50 bg-[#050b08] text-white rounded-xl text-xs focus:border-[#c5a059] focus:outline-none cursor-pointer"
                >
                  <option value="ENGLISH">{{ langService.translate('create.typeEnglish') }}</option>
                  <option value="RESERVE">{{ langService.translate('create.typeReserve') }}</option>
                  <option value="BUY_NOW">{{ langService.translate('create.typeBuyNow') }}</option>
                </select>

                <!-- Helper Badge theo loại đấu giá -->
                @if (formValue().auctionType === 'ENGLISH') {
                  <p class="text-[11px] text-emerald-400/90 mt-2 bg-emerald-950/40 border border-emerald-900/40 rounded-xl p-2.5">
                    💡 <strong>Đấu Giá Tăng Dần:</strong> Người thầu sau đặt giá cao hơn người trước tối thiểu 1 bước giá. Không áp dụng giá mua ngay và giá bảo lưu.
                  </p>
                } @else if (formValue().auctionType === 'RESERVE') {
                  <p class="text-[11px] text-amber-400/90 mt-2 bg-amber-950/40 border border-amber-900/40 rounded-xl p-2.5">
                    🔒 <strong>Đấu Giá Giá Bảo Lưu (Giá Ẩn):</strong> Đặt giá thầu tối thiểu mong muốn. Nếu khi hết giờ giá thầu chưa đạt Giá Ẩn này, sản phẩm sẽ không bán.
                  </p>
                } @else if (formValue().auctionType === 'BUY_NOW') {
                  <p class="text-[11px] text-indigo-400/90 mt-2 bg-indigo-950/40 border border-indigo-900/40 rounded-xl p-2.5">
                    ⚡ <strong>Mua Ngay Giá Cố Định:</strong> Người mua chỉ cần bấm mua với mức giá niêm yết để sở hữu ngay sản phẩm mà không cần đấu thầu tăng dần.
                  </p>
                }
              </div>

              <!-- Trường Giá Khởi Điểm & Bước Giá (Dành cho ENGLISH và RESERVE) -->
              @if (formValue().auctionType === 'ENGLISH' || formValue().auctionType === 'RESERVE') {
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-semibold text-slate-300 mb-2">
                      {{ langService.translate('create.startPriceLabel') }} <span class="text-rose-400">*</span>
                    </label>
                    <input
                      type="number"
                      formControlName="startPrice"
                      [ngClass]="isInvalid('startPrice') ? 'border-rose-500/80 bg-rose-950/20 text-rose-100' : 'border-emerald-900/50 bg-[#050b08] text-[#c5a059] focus:border-[#c5a059]'"
                      class="w-full px-4 py-3 border rounded-xl text-xs font-mono font-bold focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-slate-300 mb-2">
                      {{ langService.translate('create.bidStepLabel') }} <span class="text-rose-400">*</span>
                    </label>
                    <input
                      type="number"
                      formControlName="bidStep"
                      [ngClass]="isInvalid('bidStep') ? 'border-rose-500/80 bg-rose-950/20 text-rose-100' : 'border-emerald-900/50 bg-[#050b08] text-slate-200 focus:border-[#c5a059]'"
                      class="w-full px-4 py-3 border rounded-xl text-xs font-mono font-bold focus:outline-none transition-all"
                    />
                  </div>
                </div>
              }

              <!-- Trường Giá Bảo Lưu (Chỉ hiển thị khi RESERVE) -->
              @if (formValue().auctionType === 'RESERVE') {
                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1">
                    🔒 {{ langService.translate('create.reservePriceLabel') }} <span class="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    formControlName="reservePrice"
                    placeholder="Ví dụ: 5.000.000 (Giá ẩn tối thiểu chấp nhận bán)"
                    [ngClass]="isInvalid('reservePrice') ? 'border-rose-500/80 bg-rose-950/20 text-rose-100' : 'border-emerald-900/50 bg-[#050b08] text-amber-400 focus:border-[#c5a059]'"
                    class="w-full px-4 py-3 border rounded-xl text-xs font-mono font-bold focus:outline-none transition-all"
                  />
                  <p class="text-[10px] text-slate-500 mt-1">Giá Ẩn phải lớn hơn hoặc bằng Giá Khởi Điểm</p>
                </div>
              }

              <!-- Trường Giá Mua Ngay (Chỉ hiển thị khi BUY_NOW) -->
              @if (formValue().auctionType === 'BUY_NOW') {
                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1">
                    ⚡ Giá Mua Ngay Niêm Yết <span class="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    formControlName="buyNowPrice"
                    placeholder="Ví dụ: 10.000.000 (Giá bán cố định)"
                    [ngClass]="isInvalid('buyNowPrice') ? 'border-rose-500/80 bg-rose-950/20 text-rose-100' : 'border-emerald-900/50 bg-[#050b08] text-emerald-400 focus:border-[#c5a059]'"
                    class="w-full px-4 py-3 border rounded-xl text-xs font-mono font-bold focus:outline-none transition-all"
                  />
                  <p class="text-[10px] text-slate-500 mt-1">Giá người mua thanh toán ngay để sở hữu sản phẩm</p>
                </div>
              }

              <!-- Thời Gian Bắt Đầu / Kết Thúc -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-2">
                    {{ langService.translate('create.startTimeLabel') }} <span class="text-rose-400">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    formControlName="startTime"
                    [ngClass]="isInvalid('startTime') ? 'border-rose-500/80 bg-rose-950/20 text-rose-100' : 'border-emerald-900/50 bg-[#050b08] text-white focus:border-[#c5a059]'"
                    class="w-full px-4 py-3 border rounded-xl text-xs focus:outline-none transition-all font-mono"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-2">
                    {{ langService.translate('create.endTimeLabel') }} <span class="text-rose-400">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    formControlName="endTime"
                    [ngClass]="isInvalid('endTime') ? 'border-rose-500/80 bg-rose-950/20 text-rose-100' : 'border-emerald-900/50 bg-[#050b08] text-white focus:border-[#c5a059]'"
                    class="w-full px-4 py-3 border rounded-xl text-xs focus:outline-none transition-all font-mono"
                  />
                </div>
              </div>

            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                routerLink="/seller"
                class="px-6 py-3 bg-[#0d1a14] hover:bg-[#12241c] text-slate-300 border border-emerald-900/40 font-semibold text-xs rounded-xl transition-all cursor-pointer"
              >
                {{ langService.translate('edit.cancelBtn') }}
              </button>

              <button
                type="submit"
                [disabled]="submitting() || totalRemainingImages() < 1"
                class="px-7 py-3 bg-[#c5a059] hover:bg-[#d4af66] disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-[#c5a059]/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                @if (submitting()) {
                  <span class="inline-block w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  <span>Đang lưu...</span>
                } @else {
                  <span>{{ langService.translate('edit.saveBtn') }}</span>
                }
              </button>
            </div>

          </div>

          <!-- Cột Phía Phải: Live Preview Box -->
          <div class="lg:col-span-1 space-y-4">
            <span class="text-[11px] font-bold tracking-widest text-[#c5a059] uppercase block">
              {{ langService.translate('preview.headerSub') }}
            </span>

            <div class="bg-[#07120d] border border-emerald-900/40 rounded-2xl p-5 space-y-4 shadow-2xl sticky top-24">
              <div class="text-[10px] font-mono font-bold tracking-widest text-slate-400">
                LOT — #{{ productId }}
              </div>

              <!-- Preview Ảnh Đầu Tiên -->
              <div class="relative h-48 bg-[#050b08] border border-emerald-900/40 rounded-xl overflow-hidden flex items-center justify-center">
                @if (existingImages().length > 0) {
                  <img [src]="existingImages()[0].imageUrl" class="w-full h-full object-cover" />
                } @else if (selectedFilePreviews().length > 0) {
                  <img [src]="selectedFilePreviews()[0]" class="w-full h-full object-cover" />
                } @else {
                  <span class="text-xs text-slate-500 font-medium">{{ langService.translate('preview.imagePlaceholder') }}</span>
                }
              </div>

              <h3 class="font-serif font-bold text-white text-base leading-snug line-clamp-2">
                {{ formValue().title || langService.translate('preview.titlePlaceholder') }}
              </h3>

              <div class="flex items-center justify-between pt-2 border-t border-emerald-900/30">
                <div>
                  <p class="text-[10px] text-slate-500 font-medium">{{ langService.translate('preview.startPriceLabel') }}</p>
                  <p class="text-lg font-black text-[#c5a059] font-mono">
                    {{ (formValue().startPrice || 0) | currencyVnd }}
                  </p>
                </div>

                <span class="px-2.5 py-1 rounded bg-[#0d1a14] border border-emerald-900/40 text-[#c5a059] text-[10px] font-bold">
                  {{ langService.translate('preview.editingBadge') }}
                </span>
              </div>

              <p class="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-emerald-900/20">
                {{ langService.translate('preview.noticeText') }}
              </p>

              <div class="space-y-1 text-[11px] text-slate-400 pt-1">
                <p><strong>{{ langService.translate('preview.categoryLabel') }}</strong> {{ selectedCategoryName() }}</p>
                <p><strong>{{ langService.translate('preview.durationLabel') }}</strong> {{ durationDays() }} {{ langService.translate('preview.daysSuffix') }}</p>
              </div>
            </div>
          </div>

        </form>
      }
    </div>
  `
})
export class EditProductComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private sellerService = inject(SellerApiService);
  private marketplaceService = inject(PublicMarketplaceService);
  private categoryService = inject(CategoryService);
  userSession = inject(UserSessionService);
  langService = inject(LanguageService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  productId: number = 0;
  categories = signal<Category[]>([]);

  // State quản lý hình ảnh
  existingImages = signal<ProductImageResponse[]>([]);
  deletedImageIds = signal<number[]>([]);
  selectedFiles = signal<File[]>([]);
  selectedFilePreviews = signal<string[]>([]);

  totalRemainingImages = computed(() => this.existingImages().length + this.selectedFiles().length);

  loading = signal<boolean>(true);
  submitted = signal<boolean>(false);
  submitting = signal<boolean>(false);

  productForm = this.fb.group({
    categoryId: [1, [Validators.required]],
    title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(150)]],
    description: ['', [Validators.required]],
    auctionType: ['ENGLISH' as AuctionType, [Validators.required]],
    startPrice: [0, [Validators.required, Validators.min(1)]],
    bidStep: [0, [Validators.required, Validators.min(1)]],
    buyNowPrice: [null as number | null],
    reservePrice: [null as number | null],
    startTime: ['', [Validators.required]],
    endTime: ['', [Validators.required]]
  });

  formValue = toSignal(this.productForm.valueChanges, {
    initialValue: this.productForm.value
  });

  selectedCategoryName = computed(() => {
    const catId = Number(this.formValue()?.categoryId);
    const cat = this.categories().find((c) => c.id === catId);
    return cat ? cat.name : '—';
  });

  durationDays = computed(() => {
    const startStr = this.formValue()?.startTime;
    const endStr = this.formValue()?.endTime;
    if (!startStr || !endStr) return 0;
    const start = new Date(startStr).getTime();
    const end = new Date(endStr).getTime();
    if (isNaN(start) || isNaN(end) || end <= start) return 0;
    const diff = end - start;
    return Math.round(diff / (1000 * 60 * 60 * 24));
  });

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCategories();
    this.loadProductInfo();

    this.productForm.get('auctionType')?.valueChanges.subscribe((type) => {
      this.onAuctionTypeChange(type);
    });

    this.productForm.get('buyNowPrice')?.valueChanges.subscribe((buyPrice) => {
      if (this.productForm.get('auctionType')?.value === 'BUY_NOW' && buyPrice) {
        this.productForm.patchValue({ startPrice: buyPrice, bidStep: 1 }, { emitEvent: false });
      }
    });
  }

  onAuctionTypeChange(type: string | null): void {
    const reserveCtrl = this.productForm.get('reservePrice');
    const buyNowCtrl = this.productForm.get('buyNowPrice');
    const startCtrl = this.productForm.get('startPrice');
    const stepCtrl = this.productForm.get('bidStep');

    if (type === 'ENGLISH') {
      buyNowCtrl?.clearValidators();
      buyNowCtrl?.setValue(null);
      reserveCtrl?.clearValidators();
      reserveCtrl?.setValue(null);

      startCtrl?.setValidators([Validators.required, Validators.min(1)]);
      stepCtrl?.setValidators([Validators.required, Validators.min(1)]);
    } else if (type === 'RESERVE') {
      buyNowCtrl?.clearValidators();
      buyNowCtrl?.setValue(null);

      reserveCtrl?.setValidators([Validators.required, Validators.min(1)]);
      startCtrl?.setValidators([Validators.required, Validators.min(1)]);
      stepCtrl?.setValidators([Validators.required, Validators.min(1)]);
    } else if (type === 'BUY_NOW') {
      reserveCtrl?.clearValidators();
      reserveCtrl?.setValue(null);

      buyNowCtrl?.setValidators([Validators.required, Validators.min(1)]);
      if (buyNowCtrl?.value) {
        startCtrl?.setValue(buyNowCtrl.value);
      }
      stepCtrl?.setValue(1);
    }

    reserveCtrl?.updateValueAndValidity();
    buyNowCtrl?.updateValueAndValidity();
    startCtrl?.updateValueAndValidity();
    stepCtrl?.updateValueAndValidity();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (list) => this.categories.set(list)
    });
  }

  loadProductInfo(): void {
    this.marketplaceService.getProductById(this.productId).subscribe({
      next: (prod: ProductResponse) => {
        this.productForm.patchValue({
          categoryId: prod.categoryId,
          title: prod.title,
          description: prod.description,
          auctionType: prod.auctionType as AuctionType,
          startPrice: prod.startPrice,
          bidStep: prod.bidStep,
          buyNowPrice: prod.buyNowPrice,
          reservePrice: prod.reservePrice,
          startTime: prod.startTime ? prod.startTime.slice(0, 16) : '',
          endTime: prod.endTime ? prod.endTime.slice(0, 16) : ''
        });

        if (prod.images && prod.images.length > 0) {
          this.existingImages.set(prod.images);
        }
        this.onAuctionTypeChange(prod.auctionType as string);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  isInvalid(controlName: string): boolean {
    const ctrl = this.productForm.get(controlName);
    return !!ctrl && ctrl.invalid && (ctrl.touched || ctrl.dirty || this.submitted());
  }

  /**
   * Xóa một ảnh gốc đã tải lên trước đó
   */
  removeExistingImage(imageId: number): void {
    if (this.totalRemainingImages() <= 1) {
      this.toastService.showWarn('Không thể xóa', 'Sản phẩm phải giữ lại ít nhất 1 hình ảnh!');
      return;
    }

    // Thêm ID vào danh sách cần gửi lên Backend để xóa
    this.deletedImageIds.update((ids) => [...ids, imageId]);

    // Loại bỏ khỏi UI hiển thị
    this.existingImages.update((imgs) => imgs.filter((img) => img.id !== imageId));

    this.toastService.showInfo('Đã chọn xóa ảnh', 'Ảnh sẽ chính thức bị xóa khi bạn bấm nút Lưu!');
  }

  /**
   * Thêm các file ảnh mới từ máy tính
   */
  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const files: File[] = Array.from(event.target.files);

      if (this.totalRemainingImages() + files.length > 20) {
        this.toastService.showError('Quá số lượng ảnh', 'Tổng số lượng ảnh không được vượt quá 20 bức!');
        return;
      }

      this.selectedFiles.update((curr) => [...curr, ...files]);

      const newPreviews = files.map((file) => URL.createObjectURL(file));
      this.selectedFilePreviews.update((curr) => [...curr, ...newPreviews]);
    }
  }

  /**
   * Hủy chọn một file ảnh mới chọn
   */
  removeNewFile(index: number): void {
    URL.revokeObjectURL(this.selectedFilePreviews()[index]);
    this.selectedFiles.update((curr) => curr.filter((_, i) => i !== index));
    this.selectedFilePreviews.update((curr) => curr.filter((_, i) => i !== index));
  }

  /**
   * Gửi thông tin cập nhật bài đăng lên Backend API
   */
  onSubmit(): void {
    this.submitted.set(true);

    if (this.productForm.invalid) {
      this.toastService.showError('Form chưa hợp lệ', 'Vui lòng kiểm tra các ô màu đỏ và nhập đầy đủ thông tin yêu cầu!');
      return;
    }

    if (this.totalRemainingImages() < 1) {
      this.toastService.showError('Thiếu hình ảnh', 'Sản phẩm phải có ít nhất 1 hình ảnh!');
      return;
    }

    const formData = new FormData();
    const val = this.productForm.value;
    const type = val.auctionType;

    formData.append('categoryId', String(val.categoryId));
    formData.append('title', val.title!);
    formData.append('description', val.description!);
    formData.append('auctionType', type!);
    formData.append('startTime', val.startTime!);
    formData.append('endTime', val.endTime!);

    if (type === 'ENGLISH') {
      formData.append('startPrice', String(val.startPrice));
      formData.append('bidStep', String(val.bidStep));
    } else if (type === 'RESERVE') {
      formData.append('startPrice', String(val.startPrice));
      formData.append('bidStep', String(val.bidStep));
      formData.append('reservePrice', String(val.reservePrice));
    } else if (type === 'BUY_NOW') {
      const buyPrice = val.buyNowPrice || val.startPrice || 0;
      formData.append('startPrice', String(buyPrice));
      formData.append('bidStep', '1');
      formData.append('buyNowPrice', String(buyPrice));
    }

    // Gửi danh sách ID ảnh cũ cần xóa
    this.deletedImageIds().forEach((id) => {
      formData.append('deleteImageIds', String(id));
    });

    // Gửi danh sách file ảnh mới chọn bổ sung
    this.selectedFiles().forEach((file) => {
      formData.append('newImages', file);
    });

    this.submitting.set(true);
    this.sellerService.updateProduct(this.productId, formData).subscribe({
      next: () => {
        this.toastService.showSuccess('Cập Nhật Thành Công', 'Thông tin và danh sách hình ảnh đã được cập nhật thành công!');
        this.submitting.set(false);
        this.router.navigate(['/seller']);
      },
      error: () => this.submitting.set(false)
    });
  }
}
