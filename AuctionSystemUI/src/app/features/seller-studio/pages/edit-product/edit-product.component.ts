import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SellerApiService } from '../../services/seller-api.service';
import { PublicMarketplaceService } from '../../../public-marketplace/services/public-marketplace.service';
import { CategoryService, Category } from '../../../../core/services/category.service';
import { UserSessionService } from '../../../../core/auth/user-session.service';
import { ToastService } from '../../../../core/services/toast.service';
import { AuctionType } from '../../../../shared/models/enums.model';
import { ProductResponse } from '../../../../shared/models/product.model';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-3xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-black text-white">Chỉnh Sửa Bài Đăng Sản Phẩm</h1>
          <p class="text-xs text-slate-400 mt-1">Cập nhật thông tin bài đăng trước khi phiên đấu giá diễn ra.</p>
        </div>
        <a routerLink="/seller" class="text-xs text-slate-400 hover:text-white">← Quay lại danh sách</a>
      </div>

      @if (loading()) {
        <div class="h-96 rounded-3xl bg-slate-900/40 border border-slate-800 animate-pulse"></div>
      } @else {
        <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
          
          <!-- Category & Title -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-2">Danh Mục Sản Phẩm <span class="text-rose-400">*</span></label>
              <select
                formControlName="categoryId"
                [ngClass]="isInvalid('categoryId') ? 'border-rose-500/80 bg-rose-950/20 text-rose-100' : 'border-slate-800 bg-slate-950 text-white focus:border-indigo-500'"
                class="w-full px-4 py-3 border rounded-xl text-xs focus:outline-none transition-all"
              >
                @for (cat of categories(); track cat.id) {
                  <option [value]="cat.id">
                    {{ cat.parentId ? '↳ ' + cat.name : '📁 ' + cat.name }} (ID: {{ cat.id }})
                  </option>
                }
              </select>
              @if (isInvalid('categoryId')) {
                <p class="text-[11px] font-semibold text-rose-400 mt-1 animate-fade-in">⚠️ Vui lòng chọn danh mục</p>
              }
            </div>

            <div class="md:col-span-2">
              <label class="block text-xs font-semibold text-slate-300 mb-2">Tiêu Đề Sản Phẩm (10 - 150 ký tự) <span class="text-rose-400">*</span></label>
              <input
                type="text"
                formControlName="title"
                [ngClass]="isInvalid('title') ? 'border-rose-500/80 bg-rose-950/20 text-rose-100 placeholder-rose-400/50' : 'border-slate-800 bg-slate-950 text-white placeholder-slate-600 focus:border-indigo-500'"
                class="w-full px-4 py-3 border rounded-xl text-xs focus:outline-none transition-all"
              />
              @if (isInvalid('title')) {
                <p class="text-[11px] font-semibold text-rose-400 mt-1 animate-fade-in">⚠️ Tiêu đề sản phẩm phải từ 10 đến 150 ký tự</p>
              }
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-2">Mô Tả Chi Tiết <span class="text-rose-400">*</span></label>
            <textarea
              formControlName="description"
              rows="4"
              [ngClass]="isInvalid('description') ? 'border-rose-500/80 bg-rose-950/20 text-rose-100 placeholder-rose-400/50' : 'border-slate-800 bg-slate-950 text-white placeholder-slate-600 focus:border-indigo-500'"
              class="w-full px-4 py-3 border rounded-xl text-xs focus:outline-none transition-all leading-relaxed"
            ></textarea>
            @if (isInvalid('description')) {
              <p class="text-[11px] font-semibold text-rose-400 mt-1 animate-fade-in">⚠️ Vui lòng nhập mô tả chi tiết sản phẩm</p>
            }
          </div>

          <!-- Images Selection -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-2">Bổ Sung Hình Ảnh Mới (Upload Cloudinary - Tùy chọn)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              (change)="onFileSelected($event)"
              class="w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700"
            />
            @if (selectedFiles().length > 0) {
              <p class="text-[11px] text-emerald-400 mt-2 font-semibold">✓ Đã chọn thêm {{ selectedFiles().length }} tệp hình ảnh mới.</p>
            }
          </div>

          <!-- Auction Configuration -->
          <div class="pt-6 border-t border-slate-800 space-y-4">
            <h3 class="text-sm font-bold text-indigo-400 uppercase tracking-wider">Cấu Hình Phiên Đấu Giá</h3>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-2">Loại Đấu Giá <span class="text-rose-400">*</span></label>
                <select formControlName="auctionType" class="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-indigo-500">
                  <option value="ENGLISH">Đấu Giá Anh (ENGLISH)</option>
                  <option value="RESERVE">Đấu Giá Bảo Lưu (RESERVE)</option>
                  <option value="BUY_NOW">Mua Ngay Giá Cố Định (BUY_NOW)</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-2">Giá Khởi Điểm (VNĐ) <span class="text-rose-400">*</span></label>
                <input
                  type="number"
                  formControlName="startPrice"
                  [ngClass]="isInvalid('startPrice') ? 'border-rose-500/80 bg-rose-950/20 text-rose-100' : 'border-slate-800 bg-slate-950 text-emerald-400 focus:border-indigo-500'"
                  class="w-full px-4 py-3 border rounded-xl text-xs font-bold font-mono focus:outline-none transition-all"
                />
                @if (isInvalid('startPrice')) {
                  <p class="text-[11px] font-semibold text-rose-400 mt-1 animate-fade-in">⚠️ Giá khởi điểm phải lớn hơn 0</p>
                }
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-2">Bước Giá (VNĐ) <span class="text-rose-400">*</span></label>
                <input
                  type="number"
                  formControlName="bidStep"
                  [ngClass]="isInvalid('bidStep') ? 'border-rose-500/80 bg-rose-950/20 text-rose-100' : 'border-slate-800 bg-slate-950 text-slate-200 focus:border-indigo-500'"
                  class="w-full px-4 py-3 border rounded-xl text-xs font-bold font-mono focus:outline-none transition-all"
                />
                @if (isInvalid('bidStep')) {
                  <p class="text-[11px] font-semibold text-rose-400 mt-1 animate-fade-in">⚠️ Bước giá phải lớn hơn 0</p>
                }
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-2">Giá Mua Ngay (Nếu chọn BUY_NOW)</label>
                <input type="number" formControlName="buyNowPrice" class="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-emerald-300 font-mono focus:border-indigo-500" />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-2">Giá Bảo Lưu Reserve (Nếu chọn RESERVE)</label>
                <input type="number" formControlName="reservePrice" class="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-300 font-mono focus:border-indigo-500" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-2">Thời Gian Bắt Đầu <span class="text-rose-400">*</span></label>
                <input
                  type="datetime-local"
                  formControlName="startTime"
                  [ngClass]="isInvalid('startTime') ? 'border-rose-500/80 bg-rose-950/20 text-rose-100' : 'border-slate-800 bg-slate-950 text-white focus:border-indigo-500'"
                  class="w-full px-4 py-3 border rounded-xl text-xs focus:outline-none transition-all"
                />
                @if (isInvalid('startTime')) {
                  <p class="text-[11px] font-semibold text-rose-400 mt-1 animate-fade-in">⚠️ Vui lòng chọn thời gian bắt đầu</p>
                }
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-2">Thời Gian Kết Thúc <span class="text-rose-400">*</span></label>
                <input
                  type="datetime-local"
                  formControlName="endTime"
                  [ngClass]="isInvalid('endTime') ? 'border-rose-500/80 bg-rose-950/20 text-rose-100' : 'border-slate-800 bg-slate-950 text-white focus:border-indigo-500'"
                  class="w-full px-4 py-3 border rounded-xl text-xs focus:outline-none transition-all"
                />
                @if (isInvalid('endTime')) {
                  <p class="text-[11px] font-semibold text-rose-400 mt-1 animate-fade-in">⚠️ Vui lòng chọn thời gian kết thúc</p>
                }
              </div>
            </div>
          </div>

          <button
            type="submit"
            [disabled]="submitting()"
            class="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            @if (submitting()) {
              <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Đang lưu thông tin...</span>
            } @else {
              <span>💾 Lưu Thông Tin Cập Nhật</span>
            }
          </button>
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
  private toastService = inject(ToastService);
  private router = inject(Router);

  productId: number = 0;
  categories = signal<Category[]>([]);
  selectedFiles = signal<File[]>([]);
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

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCategories();
    this.loadProductInfo();
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
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  isInvalid(controlName: string): boolean {
    const ctrl = this.productForm.get(controlName);
    return !!ctrl && ctrl.invalid && (ctrl.touched || ctrl.dirty || this.submitted());
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const files: File[] = Array.from(event.target.files);
      this.selectedFiles.set(files);
    }
  }

  onSubmit(): void {
    this.submitted.set(true);

    if (this.productForm.invalid) {
      this.toastService.showError('Form chưa hợp lệ', 'Vui lòng kiểm tra các ô màu đỏ và nhập đầy đủ thông tin yêu cầu!');
      return;
    }

    const sellerId = this.userSession.currentUser().id;
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
    this.sellerService.updateProduct(sellerId, this.productId, formData).subscribe({
      next: () => {
        this.toastService.showSuccess('Cập Nhật Thành Công', 'Thông tin sản phẩm đã được lưu!');
        this.submitting.set(false);
        this.router.navigate(['/seller']);
      },
      error: () => this.submitting.set(false)
    });
  }
}
