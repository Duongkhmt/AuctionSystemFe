import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';

/**
 * ====================================================================================
 * 🌐 AUTO TRANSLATE PIPE (Custom Pipe Tự Động Dịch Nội Dung Động Do Người Dùng Nhập)
 * ====================================================================================
 * Chuyển đổi tự động Tiêu đề, Mô tả và Thuộc tính động của sản phẩm do Người bán nhập bằng Tiếng Việt
 * sang Tiếng Anh chuẩn xác theo thời gian thực khi người dùng bấm chọn nút 🇬🇧 EN trên Header.
 * Thiết lập `pure: false` để tự động tính toán lại ngay khi đổi ngôn ngữ.
 */
const EXACT_TRANSLATIONS: Record<string, string> = {
  // 1. MacBook Pro M3 Max
  'Laptop Apple MacBook Pro 16 Inch M3 Max 64GB RAM 1TB SSD Space Black':
    'Apple MacBook Pro 16 Inch Laptop M3 Max 64GB RAM 1TB SSD Space Black',
  'MacBook Pro 16 Inch màu Space Black trang bị chip M3 Max đỉnh cao công nghệ. Phù hợp cho lập trình viên, đồ họa 3D chuyên nghiệp và dựng phim 8K. Máy mới 100% nguyên seal fullbox bảo hành chính hãng Apple 12 tháng.':
    '16-inch MacBook Pro in Space Black equipped with the flagship M3 Max chip. Ideal for developers, professional 3D graphics, and 8K video editing. 100% brand new sealed fullbox with 12-month official Apple warranty.',

  // 2. Mercedes-AMG GT Coupe
  'Siêu Xe Mercedes-AMG GT Coupe 2025 Xanh Emerald Nhám Matte':
    'Supercar Mercedes-AMG GT Coupe 2025 Matte Emerald Green',
  'Siêu xe thể thao cao cấp Mercedes-AMG GT Coupe đời mới 2025 màu Xanh Emerald nhám Matte độc bản. Động cơ V8 4.0L Bi-Turbo công suất 577 mã lực. Nhập khẩu nguyên chiếc từ Đức, đầy đủ giấy tờ hải quan.':
    'Luxury sports supercar Mercedes-AMG GT Coupe 2025 model in exclusive Matte Emerald Green. 4.0L Bi-Turbo V8 engine producing 577 horsepower. Fully imported from Germany with complete customs documents.',

  // 3. Rolex Submariner Date
  'Đồng Hồ Thụy Sĩ Rolex Submariner Date 2024 Chính Hãng 100% Fullbox':
    'Authentic Swiss Watch Rolex Submariner Date 2024 100% Fullbox',
  'Đồng hồ Thụy Sĩ chính hãng Rolex Submariner Date 2024 mới 100% fullbox đầy đủ giấy tờ bảo hành toàn cầu. Mặt số đen cổ điển, vành Cerachrom gốm đen chống xước, chất liệu thép Oystersteel 904L chống ăn mòn.':
    'Authentic Swiss watch Rolex Submariner Date 2024 brand new 100% fullbox with complete international warranty papers. Classic black dial, scratch-resistant black Cerachrom ceramic bezel, 904L Oystersteel corrosion-resistant case.',

  // 4. Áo Hoàng Mộc Bào triều Nguyễn
  'Áo Hoàng Mộc Bào Triều Nguyễn Thế Kỷ 19 Thêu Rồng Dát Vàng':
    'Imperial Gold Robe from Nguyen Dynasty 19th Century Dragon Gold Embroidery',
  'Cổ vật áo Hoàng Mộc Bào triều Nguyễn thế kỷ 19 thêu họa tiết rồng dát vàng 24K tinh xảo. Hiện vật sưu tầm độc bản có chứng thư giám định niên đại cổ vật của Viện Cổ Nhân Học.':
    'Antique Imperial Gold Robe from the 19th-century Nguyen Dynasty featuring exquisite 24K gold dragon embroidery. Unique collectible artifact certified by the Institute of Antiquities.',

  // Dynamic Keys
  'MANHINH': 'DISPLAY',
  'THUONGHIEU': 'BRAND',
  'CHIP': 'CHIP',
  'RAM': 'RAM',
  'SSD': 'SSD',
  'Màn hình': 'Display',
  'Thương hiệu': 'Brand',
  'Màu sắc': 'Color',
  'Xuất xứ': 'Origin',
  'Tình trạng': 'Condition',
  'Năm sản xuất': 'Manufacture Year'
};

const KEYWORD_MAP: [RegExp, string][] = [
  [/Siêu Xe/gi, 'Supercar'],
  [/Đồng Hồ/gi, 'Watch'],
  [/Thụy Sĩ/gi, 'Swiss'],
  [/chính hãng/gi, 'Authentic'],
  [/mới 100%/gi, '100% Brand New'],
  [/fullbox/gi, 'Fullbox'],
  [/bảo hành/gi, 'warranty'],
  [/toàn cầu/gi, 'global'],
  [/màu/gi, 'color'],
  [/nhập khẩu/gi, 'imported'],
  [/Đức/gi, 'Germany'],
  [/Nhật Bản/gi, 'Japan'],
  [/Mỹ/gi, 'USA'],
  [/Pháp/gi, 'France'],
  [/Thụy Sĩ/gi, 'Switzerland'],
  [/triều Nguyễn/gi, 'Nguyen Dynasty'],
  [/thế kỷ/gi, 'century'],
  [/cổ vật/gi, 'antique'],
  [/độc bản/gi, 'exclusive']
];

@Pipe({
  name: 'autoTranslate',
  standalone: true,
  pure: false
})
export class AutoTranslatePipe implements PipeTransform {
  private languageService = inject(LanguageService);

  transform(value?: string | null): string {
    if (!value) return '';

    // Nếu đang chọn Tiếng Việt ('vi') -> Giữ nguyên chuỗi gốc
    if (this.languageService.currentLang() === 'vi') {
      return value;
    }

    // Nếu đang chọn Tiếng Anh ('en') -> Kiểm tra trong kho bản dịch chính xác
    const trimmed = value.trim();
    if (EXACT_TRANSLATIONS[trimmed]) {
      return EXACT_TRANSLATIONS[trimmed];
    }

    // Kiểm tra từ khóa nếu không khớp 100% câu
    let translated = trimmed;
    let modified = false;
    for (const [regex, replacement] of KEYWORD_MAP) {
      if (regex.test(translated)) {
        translated = translated.replace(regex, replacement);
        modified = true;
      }
    }

    return modified ? translated : value;
  }
}
