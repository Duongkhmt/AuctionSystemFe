import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { ToastService } from '../../../core/services/toast.service';

/**
 * ====================================================================================
 * 🔒 AUTH MODAL COMPONENT (Popup Xác Thực Đăng Nhập / Đăng Ký Nhanh Cho Khách Vãng Lai)
 * ====================================================================================
 */
@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div class="relative max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        
        <!-- Close Button -->
        <button
          (click)="closeModal.emit()"
          class="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center transition-colors"
        >
          ✕
        </button>

        <!-- Header -->
        <div class="text-center space-y-1">
          <div class="inline-flex w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 text-2xl items-center justify-center mb-2 border border-indigo-500/30">
            🔒
          </div>
          <h2 class="text-lg font-extrabold text-white">Yêu Cầu Đăng Nhập</h2>
          <p class="text-xs text-slate-400">Vui lòng đăng nhập để thực hiện đặt thầu & giao dịch trên sàn</p>
        </div>

        <!-- Segment Toggle -->
        <div class="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            (click)="isLoginTab.set(true)"
            [class]="isLoginTab() ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'"
            class="flex-1 py-2 rounded-xl transition-all text-center"
          >
            🔑 Đăng Nhập
          </button>
          <button
            type="button"
            (click)="isLoginTab.set(false)"
            [class]="!isLoginTab() ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'"
            class="flex-1 py-2 rounded-xl transition-all text-center"
          >
            ✨ Đăng Ký Nhanh
          </button>
        </div>

        <!-- Login Form -->
        @if (isLoginTab()) {
          <form [formGroup]="loginForm" (ngSubmit)="onLoginSubmit()" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Email</label>
              <input
                type="email"
                formControlName="email"
                placeholder="nhap.email@domain.com"
                class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Mật khẩu</label>
              <input
                type="password"
                formControlName="password"
                placeholder="••••••••"
                class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <button
              type="submit"
              [disabled]="loginForm.invalid || loading()"
              class="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              @if (loading()) {
                <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              } @else {
                <span>Đăng Nhập Ngay</span>
              }
            </button>
          </form>
        } @else {
          <!-- Register Form -->
          <form [formGroup]="registerForm" (ngSubmit)="onRegisterSubmit()" class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Tên Hiển Thị</label>
              <input
                type="text"
                formControlName="username"
                placeholder="Ví dụ: Hoàng Minh"
                class="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Email</label>
              <input
                type="email"
                formControlName="email"
                placeholder="nhap.email@domain.com"
                class="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Mật khẩu (Tối thiểu 8 ký tự)</label>
              <input
                type="password"
                formControlName="password"
                placeholder="••••••••"
                class="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <button
              type="submit"
              [disabled]="registerForm.invalid || loading()"
              class="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              @if (loading()) {
                <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              } @else {
                <span>Đăng Ký & Đăng Nhập</span>
              }
            </button>
          </form>
        }

      </div>
    </div>
  `
})
export class AuthModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() authSuccess = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  isLoginTab = signal<boolean>(true);
  loading = signal<boolean>(false);

  loginForm = this.fb.group({
    email: ['hoangminh.auction@gmail.com', [Validators.required, Validators.email]],
    password: ['password123', [Validators.required, Validators.minLength(8)]]
  });

  registerForm = this.fb.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  onLoginSubmit(): void {
    if (this.loginForm.valid) {
      this.loading.set(true);
      const { email, password } = this.loginForm.value;
      this.authService.login({ email: email!, password: password! }).subscribe({
        next: (res) => {
          this.loading.set(false);
          this.toastService.showSuccess('Thành công', `Đã đăng nhập tài khoản ${res.username}`);
          this.authSuccess.emit();
          this.closeModal.emit();
        },
        error: () => this.loading.set(false)
      });
    }
  }

  onRegisterSubmit(): void {
    if (this.registerForm.valid) {
      this.loading.set(true);
      const { username, email, password } = this.registerForm.value;
      this.authService.register({ username: username!, email: email!, password: password! }).subscribe({
        next: (res) => {
          this.loading.set(false);
          this.toastService.showSuccess('Chúc mừng!', `Đã đăng ký thành công tài khoản ${res.username}`);
          this.authSuccess.emit();
          this.closeModal.emit();
        },
        error: () => this.loading.set(false)
      });
    }
  }
}
