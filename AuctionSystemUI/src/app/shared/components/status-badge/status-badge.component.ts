import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';

/**
 * ====================================================================================
 * 🏷️ STATUS BADGE COMPONENT (Nhãn Trạng Thái Trực Quan Tái Sử Dụng Toàn Cục Đa Ngôn Ngữ)
 * ====================================================================================
 */
@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [ngClass]="badgeClass" class="px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm">
      <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
      {{ label }}
    </span>
  `
})
export class StatusBadgeComponent {
  private languageService = inject(LanguageService);

  @Input() status: string = '';
  @Input() endTime?: string;

  get computedStatus(): string {
    if (this.endTime && (this.status === 'RUNNING' || this.status === 'SCHEDULED')) {
      if (new Date(this.endTime).getTime() <= Date.now()) {
        return 'ENDED';
      }
    }
    return this.status;
  }

  get badgeClass(): string {
    switch (this.computedStatus) {
      case 'RUNNING':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'PENDING':
      case 'PENDING_APPROVAL':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'APPROVED':
      case 'SCHEDULED':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'ENDED':
        return 'bg-slate-800 text-slate-300 border border-slate-700';
      case 'REJECTED':
      case 'CANCELLED':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'EXPIRED':
        return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      case 'UNPAID':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
      case 'PAID':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
      case 'SHIPPING':
        return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30';
      case 'COMPLETED':
        return 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50';
      default:
        return 'bg-slate-800 text-slate-400 border border-slate-700';
    }
  }

  get label(): string {
    const key = `status.${this.computedStatus}`;
    const translated = this.languageService.translate(key);
    if (translated !== key) {
      return translated;
    }
    switch (this.computedStatus) {
      case 'UNPAID': return this.languageService.translate('won.unpaidTab');
      case 'PAID': return this.languageService.translate('won.paidTab');
      case 'SHIPPING': return this.languageService.translate('won.shippingTab');
      case 'COMPLETED': return this.languageService.translate('won.completedTab');
      default: return this.computedStatus;
    }
  }
}
