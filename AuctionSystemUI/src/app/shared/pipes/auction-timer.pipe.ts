import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';

/**
 * ====================================================================================
 * ⏱️ AUCTION TIMER PIPE (Custom Pipe Tính & Định Dạng Thời Gian Đếm Ngược Realtime Đa Ngôn Ngữ)
 * ====================================================================================
 */
@Pipe({
  name: 'auctionTimer',
  standalone: true,
  pure: false
})
export class AuctionTimerPipe implements PipeTransform {
  private languageService = inject(LanguageService);

  transform(endTimeStr?: string): string {
    if (!endTimeStr) return '--:--:--';
    const end = new Date(endTimeStr).getTime();
    const now = Date.now();
    const diff = end - now;

    if (diff <= 0) {
      return this.languageService.translate('timer.ended');
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const isEn = this.languageService.currentLang() === 'en';

    if (days > 0) {
      return isEn
        ? `${days}d ${hours}h ${minutes}m ${seconds}s`
        : `${days} ngày ${hours}h ${minutes}m ${seconds}s`;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}
