import { Pipe, PipeTransform } from '@angular/core';

/**
 * ====================================================================================
 * 💸 CURRENCY VND PIPE (Custom Pipe Định Dạng Tiền Tệ Việt Nam Đồng)
 * ====================================================================================
 * Chuyển đổi con số nguyên/thực thô (ví dụ: `28000000`) thành chuỗi tiền tệ vi-VN có phân cách
 * hàng nghìn bằng dấu chấm và kí tự đơn vị `đ` (thành `28.000.000 ₫`).
 */
@Pipe({
  name: 'currencyVnd',
  standalone: true
})
export class CurrencyVndPipe implements PipeTransform {
  transform(value?: number | null): string {
    if (value === null || value === undefined) return '0 ₫';
    
    // Sử dụng chuẩn API Intl.NumberFormat của trình duyệt cho định dạng vi-VN
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  }
}
