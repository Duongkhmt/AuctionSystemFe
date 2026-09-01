import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService, AdminUserResponse, UserStatus } from '../../services/admin-api.service';
import { ToastService } from '../../../../core/services/toast.service';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Top Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-950/80 pb-6">
        <div>
          <span class="text-[10px] font-bold tracking-widest text-[#c5a059] uppercase block mb-1">
            — PHÂN QUYỀN & QUẢN LÝ TÀI KHOẢN
          </span>
          <h1 class="text-2xl font-serif font-bold text-slate-100 flex items-center gap-3">
            <span>Quản lý người dùng hệ thống</span>
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/50 text-[#c5a059] text-xs font-sans font-medium">
              {{ users().length }} thành viên
            </span>
          </h1>
        </div>

        <!-- Summary Stat Cards -->
        <div class="flex items-center gap-3 text-xs">
          <div class="px-3.5 py-2 rounded-xl bg-[#07120d] border border-emerald-950/80 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span class="text-slate-400">Đang hoạt động:</span>
            <span class="font-bold text-emerald-400 font-mono">{{ activeCount() }}</span>
          </div>

          <div class="px-3.5 py-2 rounded-xl bg-[#07120d] border border-emerald-950/80 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-rose-500"></span>
            <span class="text-slate-400">Đã bị khóa / cấm:</span>
            <span class="font-bold text-rose-400 font-mono">{{ bannedCount() }}</span>
          </div>
        </div>
      </div>

      <!-- Search & Filter Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#07120d] border border-emerald-950/80 p-4 rounded-2xl">
        <!-- Search Input -->
        <div class="relative flex-1 max-w-md">
          <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            placeholder="Tìm theo Username, Email hoặc ID..."
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
            Tất cả ({{ users().length }})
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
            (click)="selectedStatusFilter.set('BANNED')"
            [class]="selectedStatusFilter() === 'BANNED'
              ? 'px-3.5 py-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold shadow-md'
              : 'px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-emerald-950/40'"
          >
            Đã khóa / Cấm ({{ bannedCount() }})
          </button>
        </div>
      </div>

      <!-- Users Table Container -->
      <div class="bg-[#07120d] border border-emerald-950/80 rounded-2xl overflow-hidden shadow-2xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b border-emerald-950/80 bg-[#050b08]/80 text-slate-400 font-serif uppercase tracking-wider">
                <th class="py-4 px-6">ID & Người Dùng</th>
                <th class="py-4 px-6">Email Contact</th>
                <th class="py-4 px-6">Vai Trò</th>
                <th class="py-4 px-6">Cảnh Báo Bùng Đơn</th>
                <th class="py-4 px-6">Trạng Thái</th>
                <th class="py-4 px-6 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-emerald-950/40 text-slate-300">
              @for (user of filteredUsers(); track user.id) {
                <tr class="hover:bg-emerald-950/30 transition-colors group">
                  <!-- User Avatar & ID -->
                  <td class="py-4 px-6">
                    <div class="flex items-center gap-3">
                      <!-- Initial Avatar -->
                      <div [class]="user.role === 'ADMIN'
                        ? 'w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-[#c5a059] flex items-center justify-center font-bold font-serif text-sm'
                        : 'w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-sm'">
                        {{ user.username ? user.username.charAt(0).toUpperCase() : 'U' }}
                      </div>
                      <div>
                        <div class="font-bold text-slate-100 group-hover:text-[#c5a059] transition-colors flex items-center gap-1.5">
                          <span>{{ user.username }}</span>
                          @if (user.role === 'ADMIN') {
                            <span class="text-[10px] text-[#c5a059] font-sans">👑</span>
                          }
                        </div>
                        <div class="text-[10px] font-mono text-slate-500">ID: #USER-{{ user.id }}</div>
                      </div>
                    </div>
                  </td>

                  <!-- Email -->
                  <td class="py-4 px-6 font-mono text-slate-300">
                    {{ user.email || 'chua_cap_nhat@auctionhub.vn' }}
                  </td>

                  <!-- Role Badge -->
                  <td class="py-4 px-6">
                    @if (user.role === 'ADMIN') {
                      <span class="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-[#c5a059] font-bold text-[11px]">
                        ADMIN (Quản trị)
                      </span>
                    } @else {
                      <span class="px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 font-medium text-[11px]">
                        USER (Thành viên)
                      </span>
                    }
                  </td>

                  <!-- Unpaid Strikes & Penalties -->
                  <td class="py-4 px-6">
                    @if (user.unpaidStrikeCount && user.unpaidStrikeCount > 0) {
                      <div class="flex items-center gap-1.5 text-rose-400 font-bold">
                        <span>⚠️</span>
                        <span>{{ user.unpaidStrikeCount }} lần bùng đơn</span>
                      </div>
                      @if (user.bannedUntil) {
                        <div class="text-[10px] text-rose-500/80 font-mono mt-0.5">
                          Cấm thầu đến: {{ user.bannedUntil | date:'dd/MM/yyyy' }}
                        </div>
                      }
                    } @else {
                      <span class="text-slate-500">Uy tín 100% (0 vi phạm)</span>
                    }
                  </td>

                  <!-- Account Status Badge -->
                  <td class="py-4 px-6">
                    @if (user.status === 'ACTIVE') {
                      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Hoạt động (ACTIVE)
                      </span>
                    } @else if (user.status === 'BANNED' || user.status === 'LOCKED' || user.status === 'SUSPENDED') {
                      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-medium">
                        <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        Bị khóa ({{ user.status }})
                      </span>
                    }
                  </td>

                  <!-- Action Buttons -->
                  <td class="py-4 px-6 text-right">
                    @if (user.role !== 'ADMIN') {
                      <div class="flex items-center justify-end gap-2">
                        @if (user.status === 'ACTIVE') {
                          <button
                            (click)="toggleUserStatus(user, 'BANNED')"
                            class="px-3.5 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition-all text-xs font-semibold cursor-pointer"
                          >
                            🚫 Khóa tài khoản
                          </button>
                        } @else {
                          <button
                            (click)="toggleUserStatus(user, 'ACTIVE')"
                            class="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all text-xs font-semibold cursor-pointer"
                          >
                            🔓 Mở khóa tài khoản
                          </button>
                        }
                      </div>
                    } @else {
                      <span class="text-slate-500 text-[11px] italic">Bảo vệ hệ thống</span>
                    }
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="py-12 text-center text-slate-500 italic">
                    Không tìm thấy tài khoản người dùng nào phù hợp.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class UserManagementComponent implements OnInit {
  private adminApi = inject(AdminApiService);
  private toast = inject(ToastService);
  langService = inject(LanguageService);

  users = signal<AdminUserResponse[]>([]);
  searchQuery = signal<string>('');
  selectedStatusFilter = signal<'ALL' | 'ACTIVE' | 'BANNED'>('ALL');

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminApi.getAllUsers().subscribe({
      next: (res) => this.users.set(res),
      error: () => this.toast.showError('Không thể tải danh sách tài khoản người dùng')
    });
  }

  activeCount = computed(() => this.users().filter(u => u.status === 'ACTIVE').length);
  bannedCount = computed(() => this.users().filter(u => u.status !== 'ACTIVE').length);

  filteredUsers = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const filter = this.selectedStatusFilter();

    return this.users().filter(user => {
      const matchesSearch =
        !query ||
        user.username.toLowerCase().includes(query) ||
        (user.email && user.email.toLowerCase().includes(query)) ||
        user.id.toString().includes(query);

      const matchesFilter =
        filter === 'ALL' ? true :
        filter === 'ACTIVE' ? user.status === 'ACTIVE' :
        user.status !== 'ACTIVE';

      return matchesSearch && matchesFilter;
    });
  });

  toggleUserStatus(user: AdminUserResponse, newStatus: UserStatus): void {
    this.adminApi.updateUserStatus(user.id, { status: newStatus }).subscribe({
      next: () => {
        this.toast.showSuccess(`Đã ${newStatus === 'ACTIVE' ? 'mở khóa' : 'khóa'} tài khoản thành công!`);
        this.loadUsers();
      },
      error: () => this.toast.showError('Không thể thay đổi trạng thái tài khoản')
    });
  }
}
