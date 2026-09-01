import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { SellerApiService } from '../../services/seller-api.service';
import { CategoryService, Category } from '../../../../core/services/category.service';
import { UserSessionService } from '../../../../core/auth/user-session.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { LanguageService } from '../../../../core/services/language.service';
import { AuctionType } from '../../../../shared/models/enums.model';
import { CurrencyVndPipe } from '../../../../shared/pipes/currency-vnd.pipe';

/**
 * ====================================================================================
 * 📝 CREATE PRODUCT COMPONENT (Trang Tạo Bài Đăng - Chuẩn Mockup Gold Luxury Song Ngữ)
 * ====================================================================================
 */
@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CurrencyVndPipe],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto px-4 py-4">
      
      <!-- Header Banner Tiêu Đề -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-900/30 pb-4">
        <div>
          <span class="text-[11px] font-bold tracking-widest text-[#c5a059] uppercase">
            {{ langService.translate('create.headerSub') }}
          </span>
          <h1 class="text-3xl font-serif font-bold text-white tracking-tight mt-1">
            {{ langService.translate('create.headerTitle') }}
          </h1>
          <p class="text-xs text-slate-400 mt-1">
            {{ langService.translate('create.headerSubText') }}
          </p>
        </div>

        <a
          routerLink="/seller"
          class="text-xs text-slate-400 hover:text-[#c5a059] transition-colors flex items-center gap-1 font-medium"
        >
          <span>{{ langService.translate('create.cancelLink') }}</span>
        </a>
      </div>

      <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Cột Phía Trái: Form A & B -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Khung A. Thông tin sản phẩm -->
          <div class="bg-[#07120d] border border-emerald-900/40 rounded-2xl p-6 space-y-5 shadow-xl">
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

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-2">
                {{ langService.translate('create.imagesLabel') }} <span class="text-rose-400">*</span> — <span class="text-slate-400 font-normal">{{ langService.translate('create.imagesLimit') }}</span>
              </label>

              <div
                (click)="fileInput.click()"
                (dragover)="$event.preventDefault()"
                (drop)="onDrop($event)"
                class="relative border-2 border-dashed border-emerald-900/60 hover:border-[#c5a059]/80 bg-[#050b08] hover:bg-[#07120d] rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 group flex flex-col items-center justify-center space-y-3"
              >
                <input
                  #fileInput
                  type="file"
                  multiple
                  accept="image/*"
                  (change)="onFileSelected($event)"
                  class="hidden"
                />

                <div class="w-12 h-12 rotate-45 border border-[#c5a059]/60 bg-[#c5a059]/10 group-hover:scale-110 flex items-center justify-center transition-transform">
                  <span class="-rotate-45 text-[#c5a059] font-serif font-black text-xl">+</span>
                </div>

                <div>
                  <p class="text-xs font-bold text-slate-200 group-hover:text-[#c5a059] transition-colors">
                    {{ langService.translate('create.dropzoneTitle') }}
                  </p>
                  <p class="text-[11px] text-slate-500 mt-1">
                    {{ langService.translate('create.dropzoneSub') }}
                  </p>
                </div>
              </div>

              @if (selectedFilePreviews().length > 0) {
                <div class="grid grid-cols-4 sm:grid-cols-6 gap-3 mt-4">
                  @for (src of selectedFilePreviews(); track $index) {
                    <div class="relative group h-20 bg-slate-950 border border-emerald-900/50 rounded-xl overflow-hidden">
                      <img [src]="src" class="w-full h-full object-cover" />
                      <button
                        type="button"
                        (click)="removeFile($index)"
                        class="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        ✕
                      </button>
                      @if ($index === 0) {
                        <span class="absolute bottom-0 left-0 right-0 bg-[#c5a059] text-slate-950 font-bold text-[9px] text-center py-0.5">
                          {{ langService.translate('create.mainImageBadge') }}
                        </span>
                      }
                    </div>
                  }
                </div>
              }
            </div>

          </div>

          <!-- Khung B. Cấu hình phiên đấu giá -->
          <div class="bg-[#07120d] border border-emerald-900/40 rounded-2xl p-6 space-y-5 shadow-xl">
            <h2 class="text-sm font-bold text-[#c5a059] tracking-wide flex items-center gap-2 border-b border-emerald-900/30 pb-3">
              {{ langService.translate('create.sectionB') }}
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              </div>

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

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">{{ langService.translate('create.buyNowPriceLabel') }}</label>
                <input
                  type="number"
                  formControlName="buyNowPrice"
                  placeholder="Bỏ trống nếu không áp dụng mua ngay"
                  class="w-full px-4 py-3 border border-emerald-900/50 bg-[#050b08] text-emerald-400 placeholder-slate-600 rounded-xl text-xs font-mono focus:border-[#c5a059] focus:outline-none"
                />
                <p class="text-[10px] text-slate-500 mt-1">{{ langService.translate('create.buyNowPriceSub') }}</p>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">{{ langService.translate('create.reservePriceLabel') }}</label>
                <input
                  type="number"
                  formControlName="reservePrice"
                  placeholder="Bỏ trống nếu không áp dụng giá bảo lưu"
                  class="w-full px-4 py-3 border border-emerald-900/50 bg-[#050b08] text-amber-400 placeholder-slate-600 rounded-xl text-xs font-mono focus:border-[#c5a059] focus:outline-none"
                />
                <p class="text-[10px] text-slate-500 mt-1">{{ langService.translate('create.reservePriceSub') }}</p>
              </div>
            </div>

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

          <div class="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              routerLink="/seller"
              class="px-6 py-3 bg-[#0d1a14] hover:bg-[#12241c] text-slate-300 border border-emerald-900/40 font-semibold text-xs rounded-xl transition-all"
            >
              {{ langService.translate('create.saveDraftBtn') }}
            </button>

            <button
              type="submit"
              [disabled]="submitting()"
              class="px-7 py-3 bg-[#c5a059] hover:bg-[#d4af66] disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-[#c5a059]/20 transition-all flex items-center gap-2"
            >
              @if (submitting()) {
                <span class="inline-block w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                <span>Processing...</span>
              } @else {
                <span>{{ langService.translate('create.submitBtn') }}</span>
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
              {{ langService.translate('preview.lotCodeBadge') }}
            </div>

            <div class="relative h-48 bg-[#050b08] border border-emerald-900/40 rounded-xl overflow-hidden flex items-center justify-center">
              @if (selectedFilePreviews().length > 0) {
                <img [src]="selectedFilePreviews()[0]" class="w-full h-full object-cover" />
              } @else {
                <div class="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#050b08] to-[#0a1711]">
                  <span class="text-xs text-slate-500 font-medium">{{ langService.translate('preview.imagePlaceholder') }}</span>
                </div>
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

              <span class="px-2.5 py-1 rounded bg-[#0d1a14] border border-emerald-900/40 text-slate-400 text-[10px] font-bold">
                {{ langService.translate('preview.pendingBadge') }}
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
    </div>
  `
})
export class CreateProductComponent implements OnInit {
  private fb = inject(FormBuilder);
  private sellerService = inject(SellerApiService);
  private categoryService = inject(CategoryService);
  authService = inject(AuthService);
  userSession = inject(UserSessionService);
  langService = inject(LanguageService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  categories = signal<Category[]>([]);
  selectedFiles = signal<File[]>([]);
  selectedFilePreviews = signal<string[]>([]);
  submitted = signal<boolean>(false);
  submitting = signal<boolean>(false);

  nowStr = new Date().toISOString().slice(0, 16);
  endStr = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);

  productForm = this.fb.group({
    categoryId: [1, [Validators.required]],
    title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(150)]],
    description: ['', [Validators.required]],
    auctionType: ['ENGLISH' as AuctionType, [Validators.required]],
    startPrice: [1000000, [Validators.required, Validators.min(1)]],
    bidStep: [50000, [Validators.required, Validators.min(1)]],
    buyNowPrice: [null as number | null],
    reservePrice: [null as number | null],
    startTime: [this.nowStr, [Validators.required]],
    endTime: [this.endStr, [Validators.required]]
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
    this.categoryService.getCategories().subscribe({
      next: (list) => {
        this.categories.set(list);
        if (list.length > 0) {
          this.productForm.patchValue({ categoryId: list[0].id });
        }
      },
      error: (err) => console.error('Lỗi khi tải danh mục từ DB:', err)
    });
  }

  isInvalid(controlName: string): boolean {
    const ctrl = this.productForm.get(controlName);
    return !!ctrl && ctrl.invalid && (ctrl.touched || ctrl.dirty || this.submitted());
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.handleFiles(Array.from(event.target.files));
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFiles(Array.from(event.dataTransfer.files));
    }
  }

  handleFiles(files: File[]): void {
    this.selectedFiles.set(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    this.selectedFilePreviews.set(previews);
  }

  removeFile(index: number): void {
    const files = [...this.selectedFiles()];
    const previews = [...this.selectedFilePreviews()];
    files.splice(index, 1);
    previews.splice(index, 1);
    this.selectedFiles.set(files);
    this.selectedFilePreviews.set(previews);
  }

  onSubmit(): void {
    this.submitted.set(true);

    if (this.productForm.invalid) {
      this.toastService.showError('Form chưa hợp lệ', 'Vui lòng kiểm tra các ô màu đỏ và nhập đầy đủ thông tin yêu cầu!');
      return;
    }

    if (this.selectedFiles().length === 0) {
      this.toastService.showError('Thiếu hình ảnh', 'Vui lòng tải lên ít nhất 1 ảnh sản phẩm!');
      return;
    }

    const formData = new FormData();
    const val = this.productForm.value;

    formData.append('categoryId', String(val.categoryId));
    formData.append('title', val.title!);
    formData.append('description', val.description!);
    formData.append('auctionType', val.auctionType!);
    formData.append('startPrice', String(val.startPrice));
    formData.append('bidStep', String(val.bidStep));
    formData.append('startTime', val.startTime!);
    formData.append('endTime', val.endTime!);

    if (val.buyNowPrice) formData.append('buyNowPrice', String(val.buyNowPrice));
    if (val.reservePrice) formData.append('reservePrice', String(val.reservePrice));

    this.selectedFiles().forEach((file) => {
      formData.append('images', file);
    });

    this.submitting.set(true);
    this.sellerService.createProduct(formData).subscribe({
      next: () => {
        this.toastService.showSuccess('Đã Đăng Bài', 'Sản phẩm đã tạo thành công và đang chờ Admin duyệt!');
        this.submitting.set(false);
        this.router.navigate(['/seller']);
      },
      error: () => this.submitting.set(false)
    });
  }
}
