import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserSessionService } from '../../../../core/auth/user-session.service';

@Component({
  selector: 'app-my-bids',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <div class="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
        <h1 class="text-2xl font-black text-white mb-2">Lịch Sử Đặt Giá Cá Nhân</h1>
        <p class="text-xs text-slate-400">
          Danh sách các thầu bạn đã đặt với tư cách <strong>{{ userSession.currentUser().name }}</strong> (ID: {{ userSession.currentUser().id }}).
        </p>
      </div>

      <div class="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800">
        <p class="text-sm text-slate-400">Vui lòng truy cập trực tiếp các phiên thầu từ Sàn Đấu Giá để theo dõi nhảy giá tức thì.</p>
        <a routerLink="/" class="inline-block mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-all">
          Khám Phá Sàn Đấu Giá
        </a>
      </div>
    </div>
  `
})
export class MyBidsComponent {
  userSession = inject(UserSessionService);
}
