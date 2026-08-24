import { Injectable, signal } from '@angular/core';

/**
 * Interface định dạng thông báo Toast ngắn nổi trên màn hình.
 */
export interface ToastMessage {
  id: number;
  severity: 'success' | 'info' | 'warn' | 'error';
  summary: string; // Tiêu đề ngắn
  detail: string;  // Nội dung chi tiết
}

/**
 * ====================================================================================
 * 🔔 TOAST SERVICE (Dịch Vụ Đẩy Thông Báo Góc Màn Hình Toàn Cục)
 * ====================================================================================
 * Quản lý danh sách mảng Toast tin nhắn bằng Angular 18 Signal (`toasts`).
 * Cung cấp các phương thức `showSuccess`, `showError`, `showInfo`, `showWarn`.
 * Tự động xóa thông báo sau 4 giây xuất hiện.
 */
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  // Angular Signal quản lý mảng thông báo Toast đang hiển thị
  toasts = signal<ToastMessage[]>([]);
  private counter = 0;

  /** Hiển thị thông báo Thành Công (Màu xanh lá) */
  showSuccess(summary: string, detail: string = ''): void {
    this.addToast('success', summary, detail);
  }

  /** Hiển thị thông báo Thất Bại / Lỗi (Màu đỏ) */
  showError(summary: string, detail: string = ''): void {
    this.addToast('error', summary, detail);
  }

  /** Hiển thị thông báo Thông Tin (Màu xanh dương) */
  showInfo(summary: string, detail: string = ''): void {
    this.addToast('info', summary, detail);
  }

  /** Hiển thị thông báo Cảnh Báo (Màu vàng) */
  showWarn(summary: string, detail: string = ''): void {
    this.addToast('warn', summary, detail);
  }

  /** Xóa một Toast theo ID */
  remove(id: number): void {
    this.toasts.update((current) => current.filter((t) => t.id !== id));
  }

  /**
   * Tạo bản ghi Toast mới và tự động thiết lập bộ đếm thời gian 4000ms để ẩn Toast.
   */
  private addToast(severity: ToastMessage['severity'], summary: string, detail: string): void {
    const id = ++this.counter;
    const toast: ToastMessage = { id, severity, summary, detail };
    this.toasts.update((current) => [...current, toast]);

    // Tự động xóa thông báo khỏi màn hình sau 4 giây
    setTimeout(() => {
      this.remove(id);
    }, 4000);
  }
}
