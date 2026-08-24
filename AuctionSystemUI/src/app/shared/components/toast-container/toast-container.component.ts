import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="pointer-events-auto p-4 rounded-xl shadow-lg border backdrop-blur-md flex items-start justify-between transition-all duration-300 transform translate-y-0"
          [ngClass]="{
            'bg-emerald-950/90 text-emerald-100 border-emerald-800': toast.severity === 'success',
            'bg-rose-950/90 text-rose-100 border-rose-800': toast.severity === 'error',
            'bg-amber-950/90 text-amber-100 border-amber-800': toast.severity === 'warn',
            'bg-sky-950/90 text-sky-100 border-sky-800': toast.severity === 'info'
          }"
        >
          <div class="pr-2">
            <h4 class="font-bold text-sm tracking-wide">{{ toast.summary }}</h4>
            @if (toast.detail) {
              <p class="text-xs opacity-90 mt-1 leading-relaxed">{{ toast.detail }}</p>
            }
          </div>
          <button (click)="toastService.remove(toast.id)" class="text-xs opacity-60 hover:opacity-100 p-1">
            ✕
          </button>
        </div>
      }
    </div>
  `
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
}
