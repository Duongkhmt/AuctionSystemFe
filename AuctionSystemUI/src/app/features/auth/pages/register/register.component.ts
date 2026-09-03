import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { LanguageService } from '../../../../core/services/language.service';

/**
 * ====================================================================================
 * ✨ REGISTER COMPONENT (Trang Đăng Ký Tài Khoản JWT Chuẩn Luxury Dark Gold & Emerald)
 * ====================================================================================
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-[#09110d] p-4 relative overflow-hidden font-sans">
      <!-- Background Ambient Gold & Emerald Glow -->
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-md w-full bg-[#0b1610] border border-emerald-950/80 rounded-3xl p-8 shadow-2xl backdrop-blur-2xl relative z-10 space-y-6">
        
        <!-- Nút Quay Về Giao Diện Khách Vãng Lai (Dành cho ai không muốn Đăng ký) -->
        <div class="flex items-center justify-between border-b border-emerald-950/80 pb-4">
          <a
            routerLink="/"
            class="text-xs font-semibold text-slate-400 hover:text-[#c5a059] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>←</span>
            <span>{{ langService.translate('nav.backToMarketplace') }}</span>
          </a>
          <span class="text-[10px] uppercase font-bold tracking-widest text-[#c5a059] bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
            Khách Vãng Lai
          </span>
        </div>

        <!-- Header Brand Logo -->
        <div class="text-center space-y-2">
          <a routerLink="/" class="inline-flex items-center gap-2 text-2xl font-serif tracking-tight text-white group mb-1">
            <span class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#c5a059] text-lg group-hover:scale-105 transition-transform">
              ⚖
            </span>
            <span class="font-bold text-[#c5a059] tracking-wider">AuctionHub</span>
          </a>
          <h1 class="text-xl font-serif font-bold text-white tracking-tight">Tạo Tài Khoản Thành Viên</h1>
          <p class="text-xs text-slate-400">Tham gia sàn đấu giá minh bạch & bảo mật nhất</p>
        </div>

        <!-- Tab Switching (Login / Register) -->
        <div class="flex bg-[#050b08] p-1 rounded-2xl border border-emerald-900/40 text-xs font-semibold">
          <a routerLink="/login" class="flex-1 py-2.5 rounded-xl text-slate-400 hover:text-white transition-all text-center">
            🔑 Đăng Nhập
          </a>
          <button type="button" class="flex-1 py-2.5 rounded-xl bg-[#c5a059] text-slate-950 font-bold shadow-md text-center">
            ✨ Đăng Ký
          </button>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <!-- Input Username -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Tên Hiển Thị (Username)</label>
            <input
              type="text"
              formControlName="username"
              placeholder="Ví dụ: Hoàng Minh"
              [class.border-rose-500]="isFieldInvalid('username')"
              class="w-full px-4 py-3 bg-[#050b08] border border-emerald-900/40 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#c5a059] transition-colors"
            />
            @if (isFieldInvalid('username')) {
              <p class="text-[11px] text-rose-400 mt-1">Username không được để trống</p>
            }
          </div>

          <!-- Input Email -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Email Đăng Ký</label>
            <input
              type="email"
              formControlName="email"
              placeholder="nhap.email@domain.com"
              [class.border-rose-500]="isFieldInvalid('email')"
              class="w-full px-4 py-3 bg-[#050b08] border border-emerald-900/40 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#c5a059] transition-colors"
            />
            @if (isFieldInvalid('email')) {
              <p class="text-[11px] text-rose-400 mt-1">Vui lòng nhập Email đúng định dạng</p>
            }
          </div>

          <!-- Input Password -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Mật Khẩu (Tối thiểu 8 ký tự)</label>
            <input
              type="password"
              formControlName="password"
              placeholder="••••••••"
              [class.border-rose-500]="isFieldInvalid('password')"
              class="w-full px-4 py-3 bg-[#050b08] border border-emerald-900/40 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#c5a059] transition-colors font-mono"
            />
            @if (isFieldInvalid('password')) {
              <p class="text-[11px] text-rose-400 mt-1">Mật khẩu phải từ 8 ký tự trở lên</p>
            }
          </div>

          <!-- Input Confirm Password -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Xác Nhận Mật Khẩu</label>
            <input
              type="password"
              formControlName="confirmPassword"
              placeholder="••••••••"
              [class.border-rose-500]="isFieldInvalid('confirmPassword') || (registerForm.hasError('mismatch') && registerForm.get('confirmPassword')?.touched)"
              class="w-full px-4 py-3 bg-[#050b08] border border-emerald-900/40 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#c5a059] transition-colors font-mono"
            />
            @if (registerForm.hasError('mismatch') && registerForm.get('confirmPassword')?.touched) {
              <p class="text-[11px] text-rose-400 mt-1">Mật khẩu xác nhận không trùng khớp</p>
            }
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            [disabled]="registerForm.invalid || loading()"
            class="w-full py-3.5 px-4 bg-[#c5a059] hover:bg-[#b38e47] disabled:opacity-50 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/10 transition-all flex items-center justify-center gap-2"
          >
            @if (loading()) {
              <span class="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
              <span>Đang khởi tạo tài khoản...</span>
            } @else {
              <span>Tạo Tài Khoản Mới</span>
              <span>✨</span>
            }
          </button>
        </form>

        <div class="pt-2 text-center text-xs text-slate-500 border-t border-emerald-950/80">
          Đã có tài khoản?
          <a routerLink="/login" class="text-[#c5a059] font-bold hover:underline ml-1">Đăng nhập ngay</a>
        </div>

      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  langService = inject(LanguageService);

  loading = signal<boolean>(false);

  registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword ? { mismatch: true } : null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading.set(true);
      const { username, email, password } = this.registerForm.value;

      this.authService.register({
        username: username!,
        email: email!,
        password: password!
      }).subscribe({
        next: (res) => {
          this.loading.set(false);
          this.toastService.showSuccess('Đăng ký thành công!', `Tài khoản ${res.username} đã được tạo thành công. Vui lòng nhập mật khẩu để đăng nhập.`);
          this.router.navigate(['/login'], { queryParams: { registeredEmail: email } });
        },
        error: () => {
          this.loading.set(false);
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
