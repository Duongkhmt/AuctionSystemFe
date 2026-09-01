import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService, AdminCategoryResponse, CategoryRequest } from '../../services/admin-api.service';
import { ToastService } from '../../../../core/services/toast.service';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Top Header & Actions -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-950/80 pb-6">
        <div>
          <span class="text-[10px] font-bold tracking-widest text-[#c5a059] uppercase block mb-1">
            — QUẢN LÝ THỂ LOẠI & DANH MỤC
          </span>
          <h1 class="text-2xl font-serif font-bold text-slate-100 flex items-center gap-3">
            <span>Danh mục sản phẩm đấu giá</span>
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/50 text-[#c5a059] text-xs font-sans font-medium">
              {{ categories().length }} danh mục
            </span>
          </h1>
        </div>

        <button
          (click)="openCreateModal()"
          class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c5a059] to-[#dfb86c] text-slate-950 font-bold text-xs shadow-lg shadow-[#c5a059]/10 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <span>➕</span>
          <span>Thêm danh mục mới</span>
        </button>
      </div>

      <!-- Search & Filter Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#07120d] border border-emerald-950/80 p-4 rounded-2xl">
        <!-- Search Input -->
        <div class="relative flex-1 max-w-md">
          <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            placeholder="Tìm kiếm danh mục theo tên..."
            class="w-full bg-[#050b08] border border-emerald-950 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#c5a059]/50 transition-colors"
          />
        </div>

        <!-- Filter Tabs -->
        <div class="flex items-center gap-2 text-xs">
          <button
            (click)="selectedStatusFilter.set('ALL')"
            [class]="selectedStatusFilter() === 'ALL'
              ? 'px-3.5 py-1.5 rounded-lg bg-[#c5a059] text-slate-950 font-bold shadow-md'
              : 'px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-emerald-950/40'"
          >
            Tất cả ({{ categories().length }})
          </button>

          <button
            (click)="selectedStatusFilter.set('ACTIVE')"
            [class]="selectedStatusFilter() === 'ACTIVE'
              ? 'px-3.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold shadow-md'
              : 'px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-emerald-950/40'"
          >
            Đang hoạt động ({{ activeCount() }})
          </button>

          <button
            (click)="selectedStatusFilter.set('INACTIVE')"
            [class]="selectedStatusFilter() === 'INACTIVE'
              ? 'px-3.5 py-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold shadow-md'
              : 'px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-emerald-950/40'"
          >
            Đã ẩn ({{ inactiveCount() }})
          </button>
        </div>
      </div>

      <!-- Categories Table Container -->
      <div class="bg-[#07120d] border border-emerald-950/80 rounded-2xl overflow-hidden shadow-2xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b border-emerald-950/80 bg-[#050b08]/80 text-slate-400 font-serif uppercase tracking-wider">
                <th class="py-4 px-6">ID</th>
                <th class="py-4 px-6">Tên Danh Mục</th>
                <th class="py-4 px-6">Danh Mục Cha</th>
                <th class="py-4 px-6">Trạng Thái</th>
                <th class="py-4 px-6 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-emerald-950/40 text-slate-300">
              @for (cat of filteredCategories(); track cat.id) {
                <tr class="hover:bg-emerald-950/30 transition-colors group">
                  <!-- ID -->
                  <td class="py-4 px-6 font-mono text-slate-500 font-bold">#CAT-{{ cat.id }}</td>

                  <!-- Name -->
                  <td class="py-4 px-6">
                    <div class="flex items-center gap-2">
                      <span class="text-base">📁</span>
                      <span class="font-bold text-slate-100 group-hover:text-[#c5a059] transition-colors">
                        {{ cat.name }}
                      </span>
                    </div>
                  </td>

                  <!-- Parent Category -->
                  <td class="py-4 px-6">
                    @if (cat.parentId) {
                      <span class="px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-900/40 text-emerald-400 text-[11px] font-medium">
                        ↳ {{ getParentCategoryName(cat.parentId) }}
                      </span>
                    } @else {
                      <span class="text-slate-500 italic">Gốc (Root Category)</span>
                    }
                  </td>

                  <!-- Active Status Badge -->
                  <td class="py-4 px-6">
                    @if (cat.active) {
                      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Đang hoạt động
                      </span>
                    } @else {
                      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-medium">
                        <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        Đã tạm ngưng / Ẩn
                      </span>
                    }
                  </td>

                  <!-- Action Buttons -->
                  <td class="py-4 px-6 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button
                        (click)="openEditModal(cat)"
                        title="Chỉnh sửa danh mục"
                        class="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-slate-300 hover:text-[#c5a059] hover:border-[#c5a059]/50 transition-all text-xs font-semibold cursor-pointer"
                      >
                        ✏️ Sửa
                      </button>

                      <button
                        (click)="toggleCategoryStatus(cat)"
                        [title]="cat.active ? 'Ẩn danh mục' : 'Kích hoạt danh mục'"
                        [class]="cat.active
                          ? 'px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition-all text-xs font-semibold cursor-pointer'
                          : 'px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all text-xs font-semibold cursor-pointer'"
                      >
                        {{ cat.active ? '🔒 Ẩn' : '🔓 Hiện' }}
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="py-12 text-center text-slate-500 italic">
                    Không tìm thấy danh mục nào phù hợp.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODAL KHUNG THÊM / SỬA DANH MỤC -->
    <!-- ========================================================================= -->
    @if (isModalOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <div class="w-full max-w-md bg-[#07120d] border border-emerald-950 rounded-2xl shadow-2xl p-6 space-y-6 relative animate-in fade-in zoom-in-95 duration-200">

          <!-- Modal Header -->
          <div class="flex items-center justify-between border-b border-emerald-950/80 pb-4">
            <h3 class="text-base font-serif font-bold text-slate-100 flex items-center gap-2">
              <span class="text-[#c5a059]">📁</span>
              <span>{{ editingCatId() ? 'Chỉnh sửa danh mục #' + editingCatId() : 'Thêm danh mục sản phẩm mới' }}</span>
            </h3>

            <button
              (click)="closeModal()"
              class="text-slate-400 hover:text-slate-100 p-1 text-lg rounded-lg cursor-pointer"
            >
              ✕
            </button>
          </div>

          <!-- Modal Form -->
          <div class="space-y-4 text-xs">
            <!-- Name Input -->
            <div class="space-y-1.5">
              <label class="block font-semibold text-slate-300">Tên danh mục <span class="text-rose-500">*</span></label>
              <input
                type="text"
                [(ngModel)]="formData.name"
                placeholder="Ví dụ: Đồng Hồ Cổ, Bất Động Sản..."
                class="w-full bg-[#050b08] border border-emerald-950 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#c5a059]/50 transition-colors"
              />
            </div>

            <!-- Parent Category Select -->
            <div class="space-y-1.5">
              <label class="block font-semibold text-slate-300">Danh mục cha (Tùy chọn)</label>
              <select
                [(ngModel)]="formData.parentId"
                class="w-full bg-[#050b08] border border-emerald-950 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#c5a059]/50 transition-colors cursor-pointer"
              >
                <option [ngValue]="null">-- Không có (Danh mục gốc / Root) --</option>
                @for (rootCat of rootCategories(); track rootCat.id) {
                  @if (rootCat.id !== editingCatId()) {
                    <option [ngValue]="rootCat.id">📁 {{ rootCat.name }}</option>
                  }
                }
              </select>
            </div>

            <!-- Active Checkbox -->
            <div class="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="catActiveToggle"
                [(ngModel)]="formData.active"
                class="w-4 h-4 rounded border-emerald-950 bg-[#050b08] text-[#c5a059] focus:ring-0 cursor-pointer"
              />
              <label for="catActiveToggle" class="text-slate-300 font-medium cursor-pointer">
                Kích hoạt hiển thị công khai trên sàn đấu giá
              </label>
            </div>
          </div>

          <!-- Modal Actions -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-emerald-950/80">
            <button
              (click)="closeModal()"
              class="px-4 py-2 rounded-xl bg-emerald-950/40 text-slate-400 hover:text-slate-200 text-xs font-semibold cursor-pointer"
            >
              Hủy
            </button>

            <button
              (click)="saveCategory()"
              [disabled]="isSaving()"
              class="px-5 py-2 rounded-xl bg-gradient-to-r from-[#c5a059] to-[#dfb86c] text-slate-950 font-bold text-xs hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              @if (isSaving()) {
                <span class="inline-block animate-spin">⌛</span>
              }
              <span>{{ editingCatId() ? 'Cập nhật' : 'Tạo danh mục' }}</span>
            </button>
          </div>

        </div>
      </div>
    }
  `
})
export class CategoryManagementComponent implements OnInit {
  private adminApi = inject(AdminApiService);
  private toast = inject(ToastService);
  langService = inject(LanguageService);

  categories = signal<AdminCategoryResponse[]>([]);
  searchQuery = signal<string>('');
  selectedStatusFilter = signal<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  isModalOpen = signal<boolean>(false);
  editingCatId = signal<number | null>(null);
  isSaving = signal<boolean>(false);

  formData: CategoryRequest = {
    name: '',
    parentId: null,
    active: true
  };

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.adminApi.getAllCategories().subscribe({
      next: (res) => this.categories.set(res),
      error: () => this.toast.showError('Không thể tải danh sách danh mục')
    });
  }

  activeCount = computed(() => this.categories().filter(c => c.active).length);
  inactiveCount = computed(() => this.categories().filter(c => !c.active).length);

  rootCategories = computed(() => this.categories().filter(c => !c.parentId));

  filteredCategories = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const filter = this.selectedStatusFilter();

    return this.categories().filter(cat => {
      const matchesSearch = !query || cat.name.toLowerCase().includes(query);
      const matchesFilter =
        filter === 'ALL' ? true :
        filter === 'ACTIVE' ? cat.active :
        !cat.active;

      return matchesSearch && matchesFilter;
    });
  });

  getParentCategoryName(parentId: number): string {
    const parent = this.categories().find(c => c.id === parentId);
    return parent ? parent.name : `ID #${parentId}`;
  }

  openCreateModal(): void {
    this.editingCatId.set(null);
    this.formData = { name: '', parentId: null, active: true };
    this.isModalOpen.set(true);
  }

  openEditModal(cat: AdminCategoryResponse): void {
    this.editingCatId.set(cat.id);
    this.formData = {
      name: cat.name,
      parentId: cat.parentId,
      active: cat.active
    };
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  saveCategory(): void {
    if (!this.formData.name.trim()) {
      this.toast.showError('Tên danh mục không được để trống');
      return;
    }

    this.isSaving.set(true);
    const catId = this.editingCatId();

    if (catId) {
      this.adminApi.updateCategory(catId, this.formData).subscribe({
        next: () => {
          this.toast.showSuccess('Cập nhật danh mục thành công!');
          this.isSaving.set(false);
          this.closeModal();
          this.loadCategories();
        },
        error: () => {
          this.toast.showError('Không thể cập nhật danh mục');
          this.isSaving.set(false);
        }
      });
    } else {
      this.adminApi.createCategory(this.formData).subscribe({
        next: () => {
          this.toast.showSuccess('Tạo mới danh mục thành công!');
          this.isSaving.set(false);
          this.closeModal();
          this.loadCategories();
        },
        error: () => {
          this.toast.showError('Không thể tạo danh mục mới');
          this.isSaving.set(false);
        }
      });
    }
  }

  toggleCategoryStatus(cat: AdminCategoryResponse): void {
    const updatedStatus = !cat.active;
    const request: CategoryRequest = {
      name: cat.name,
      parentId: cat.parentId,
      active: updatedStatus
    };

    this.adminApi.updateCategory(cat.id, request).subscribe({
      next: () => {
        this.toast.showSuccess(`Đã ${updatedStatus ? 'kích hoạt' : 'ẩn'} danh mục thành công!`);
        this.loadCategories();
      },
      error: () => this.toast.showError('Không thể đổi trạng thái danh mục')
    });
  }
}
