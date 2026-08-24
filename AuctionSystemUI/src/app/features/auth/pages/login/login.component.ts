import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { UserRole } from '../../../../shared/models/enums.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div class="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
        
        <div class="text-center mb-8">
          <div class="inline-flex w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 text-2xl items-center justify-center mb-3 border border-indigo-500/30">
            ⚖
          </div>
          <h1 class="text-2xl font-black text-white tracking-tight">Đăng Nhập AuctionHub</h1>
          <p class="text-xs text-slate-400 mt-1">Chọn vai trò hệ thống để bắt đầu trải nghiệm</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-2">Email Đăng Nhập</label>
            <input
              type="email"
              formControlName="email"
              placeholder="nhap.email@domain.com"
              class="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-2">Vai Trò Đăng Nhập (Role Context)</label>
            <select
              formControlName="role"
              class="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="USER">Thành Viên (User: Đấu Giá & Đăng Bán)</option>
              <option value="ADMIN">Quản Trị Viên (Admin)</option>
            </select>
          </div>

          <button
            type="submit"
            [disabled]="loginForm.invalid"
            class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/25 transition-all"
          >
            Đăng Nhập Ngay
          </button>
        </form>

        <div class="mt-6 text-center text-xs text-slate-500">
          Chưa có tài khoản? <a routerLink="/auth/register" class="text-indigo-400 font-semibold hover:underline">Đăng ký mới</a>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['hoangminh.auction@gmail.com', [Validators.required, Validators.email]],
    role: ['USER' as UserRole, [Validators.required]]
  });

  onSubmit(): void {
    if (this.loginForm.valid) {
      const val = this.loginForm.value;
      const email = val.email || 'hoangminh.auction@gmail.com';
      const role = (val.role as UserRole) || 'USER';

      this.authService.login({ email, role }).subscribe(() => {
        this.toastService.showSuccess('Đăng nhập thành công', `Chào mừng ${email}`);
        if (role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      });
    }
  }
}
