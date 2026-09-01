import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';

/**
 * ====================================================================================
 * 🌐 AUTO TRANSLATE PIPE (Custom Pipe Tự Động Dịch 2 Chiều VN ↔ EN Toàn Diện)
 * ====================================================================================
 * Tự động dịch Tên danh mục, Tiêu đề, Mô tả, Thuộc tính động của sản phẩm do người dùng nhập
 * theo thời gian thực khi chuyển đổi giữa 🇻🇳 VN và 🇬🇧 EN.
 * Thiết lập `pure: false` để tự động tính toán lại ngay lập tức khi đổi ngôn ngữ.
 */
const CATEGORY_TRANSLATIONS: Record<string, { vi: string; en: string }> = {
  '🏛️ Cổ Vật & Di Sản Lịch Sử': { vi: '🏛️ Cổ Vật & Di Sản Lịch Sử', en: '🏛️ Antiques & Historical Heritage' },
  '💎 Đồng Hồ & Trang Sức Xa Xỉ': { vi: '💎 Đồng Hồ & Trang Sức Xa Xỉ', en: '💎 Luxury Watches & Jewelry' },
  '🏎️ Siêu Xe & Phương Tiện Độc Bản': { vi: '🏎️ Siêu Xe & Phương Tiện Độc Bản', en: '🏎️ Supercars & Unique Vehicles' },
  '💻 Thiết Bị Công Nghệ High-End': { vi: '💻 Thiết Bị Công Nghệ High-End', en: '💻 High-End Tech & Gadgets' },
  '👜 Thời Trang & Phụ Kiện Hàng Hiệu': { vi: '👜 Thời Trang & Phụ Kiện Hàng Hiệu', en: '👜 Luxury Fashion & Designer Accessories' },
  '🎨 Hội Họa & Tác Phẩm Nghệ Thuật': { vi: '🎨 Hội Họa & Tác Phẩm Nghệ Thuật', en: '🎨 Fine Arts & Masterpieces' },
  '🏰 Bất Động Sản & Tài Sản Cao Cấp': { vi: '🏰 Bất Động Sản & Tài Sản Cao Cấp', en: '🏰 Real Estate & Premium Assets' },
  '🍷 Rượu Vang Cổ & Xì Gà Thượng Hạng': { vi: '🍷 Rượu Vang Cổ & Xì Gà Thượng Hạng', en: '🍷 Vintage Wine & Fine Cigars' },
  '🎸 Nhạc Cụ & Audio Hi-End': { vi: '🎸 Nhạc Cụ & Audio Hi-End', en: '🎸 Musical Instruments & Audio' },
  '⚽ Đồ Sưu Tầm Thể Thao & Chữ Ký': { vi: '⚽ Đồ Sưu Tầm Thể Thao & Chữ Ký', en: '⚽ Sports Collectibles & Autographs' },

  // Subcategories
  'Gốm Sứ & Đồ Ngọc Cổ Thập Niên 18-19': { vi: 'Gốm Sứ & Đồ Ngọc Cổ Thập Niên 18-19', en: '18th-19th Century Ceramics & Jade' },
  'Tiền Cổ & Tem Thư Độc Bản': { vi: 'Tiền Cổ & Tem Thư Độc Bản', en: 'Ancient Coins & Rare Stamps' },
  'Cổ Vật Hoàng Gia Triều Nguyễn': { vi: 'Cổ Vật Hoàng Gia Triều Nguyễn', en: 'Nguyen Dynasty Imperial Relics' },

  'Đồng Hồ Thụy Sĩ (Rolex, Patek Philippe)': { vi: 'Đồng Hồ Thụy Sĩ (Rolex, Patek Philippe)', en: 'Swiss Watches (Rolex, Patek Philippe)' },
  'Trang Sức Kim Cương & Đá Quý Natural': { vi: 'Trang Sức Kim Cương & Đá Quý Natural', en: 'Natural Diamond & Gemstone Jewelry' },

  'Siêu Xe Thể Thao (Mercedes-AMG, Porsche)': { vi: 'Siêu Xe Thể Thao (Mercedes-AMG, Porsche)', en: 'Sports Supercars (Mercedes-AMG, Porsche)' },
  'Xe Máy Cổ & Biển Số Phong Thủy Hiếm': { vi: 'Xe Máy Cổ & Biển Số Phong Thủy Hiếm', en: 'Vintage Motorcycles & Lucky License Plates' },

  'Laptop & Máy Tính Đồ Họa High-End': { vi: 'Laptop & Máy Tính Đồ Họa High-End', en: 'High-End Laptops & Workstations' },
  'Điện Thoại Flagship & Xa Xỉ (Vertu, Titan)': { vi: 'Điện Thoại Flagship & Xa Xỉ (Vertu, Titan)', en: 'Flagship & Luxury Phones (Vertu, Titanium)' },

  'Túi Xách Xa Xỉ (Hermès Birkin, Chanel)': { vi: 'Túi Xách Xa Xỉ (Hermès Birkin, Chanel)', en: 'Luxury Handbags (Hermès Birkin, Chanel)' },
  'Giày Sneaker Sưu Tầm Phiên Bản Giới Hạn': { vi: 'Giày Sneaker Sưu Tầm Phiên Bản Giới Hạn', en: 'Limited Edition Collectible Sneakers' },

  'Tranh Sơn Mài & Tranh Lụa Đông Dương': { vi: 'Tranh Sơn Mài & Tranh Lụa Đông Dương', en: 'Indochine Lacquer & Silk Paintings' },
  'Tượng Điêu Khắc Nghệ Thuật': { vi: 'Tượng Điêu Khắc Nghệ Thuật', en: 'Art Sculptures & Statues' },

  'Biệt Thự Ven Biển & Penthouse Xa Xỉ': { vi: 'Biệt Thự Ven Biển & Penthouse Xa Xỉ', en: 'Beachfront Villas & Luxury Penthouses' },
  'Đất Nền Đấu Giá Trung Tâm': { vi: 'Đất Nền Đấu Giá Trung Tâm', en: 'Prime Location Auction Land' },

  'Rượu Vang Đỏ & Cognac Sưu Tầm Cổ': { vi: 'Rượu Vang Đỏ & Cognac Sưu Tầm Cổ', en: 'Vintage Red Wine & Rare Cognac' },
  'Xì Gà Cuba Nguyên Bản Hộp Gỗ': { vi: 'Xì Gà Cuba Nguyên Bản Hộp Gỗ', en: 'Authentic Wooden Box Cuban Cigars' },

  'Đàn Guitar & Piano Cổ Niên Đại Cao': { vi: 'Đàn Guitar & Piano Cổ Niên Đại Cao', en: 'Antique Guitars & Classic Pianos' },
  'Mâm Đĩa Than & Hệ Thống Audio Đèn': { vi: 'Mâm Đĩa Than & Hệ Thống Audio Đèn', en: 'Turntables & Vacuum Tube Audio Systems' },

  'Áo Đấu & Giày Có Chữ Ký Huyền Thoại': { vi: 'Áo Đấu & Giày Có Chữ Ký Huyền Thoại', en: 'Autographed Legend Jerseys & Shoes' },
  'Thẻ Thể Thao Trading Cards Quý Hiếm': { vi: 'Thẻ Thẻ Thao Trading Cards Quý Hiếm', en: 'Rare Sports Trading Cards' }
};

const EXACT_PRODUCT_TRANSLATIONS: Record<string, { vi: string; en: string }> = {
  // MacBook
  'Laptop Apple MacBook Pro 16 Inch M3 Max 64GB RAM 1TB SSD Space Black': {
    vi: 'Laptop Apple MacBook Pro 16 Inch M3 Max 64GB RAM 1TB SSD Space Black',
    en: 'Apple MacBook Pro 16 Inch Laptop M3 Max 64GB RAM 1TB SSD Space Black'
  },
  // Mercedes
  'Siêu Xe Mercedes-AMG GT Coupe 2025 Xanh Emerald Nhám Matte': {
    vi: 'Siêu Xe Mercedes-AMG GT Coupe 2025 Xanh Emerald Nhám Matte',
    en: 'Supercar Mercedes-AMG GT Coupe 2025 Matte Emerald Green'
  },
  // Rolex
  'Đồng Hồ Thụy Sĩ Rolex Submariner Date 2024 Chính Hãng 100% Fullbox': {
    vi: 'Đồng Hồ Thụy Sĩ Rolex Submariner Date 2024 Chính Hãng 100% Fullbox',
    en: 'Authentic Swiss Watch Rolex Submariner Date 2024 100% Fullbox'
  },
  // Nguyen Robe
  'Áo Hoàng Mộc Bào Triều Nguyễn Thế Kỷ 19 Thêu Rồng Dát Vàng': {
    vi: 'Áo Hoàng Mộc Bào Triều Nguyễn Thế Kỷ 19 Thêu Rồng Dát Vàng',
    en: 'Imperial Gold Robe from Nguyen Dynasty 19th Century Dragon Gold Embroidery'
  }
};

const KEYWORD_MAP_EN: [RegExp, string][] = [
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
  [/triều Nguyễn/gi, 'Nguyen Dynasty'],
  [/thế kỷ/gi, 'century'],
  [/cổ vật/gi, 'antique'],
  [/độc bản/gi, 'exclusive'],
  [/Biệt Thự/gi, 'Villa'],
  [/Bất Động Sản/gi, 'Real Estate'],
  [/Đồ Cổ/gi, 'Antiques'],
  [/Trang Sức/gi, 'Jewelry'],
  [/Kim Cương/gi, 'Diamond']
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

    const lang = this.languageService.currentLang();
    const trimmed = value.trim();

    // 1. Kiểm tra danh mục
    if (CATEGORY_TRANSLATIONS[trimmed]) {
      return CATEGORY_TRANSLATIONS[trimmed][lang];
    }

    // 2. Kiểm tra sản phẩm chính xác
    if (EXACT_PRODUCT_TRANSLATIONS[trimmed]) {
      return EXACT_PRODUCT_TRANSLATIONS[trimmed][lang];
    }

    // 3. Nếu chọn Tiếng Việt -> Giữ nguyên chuỗi gốc
    if (lang === 'vi') {
      return value;
    }

    // 4. Nếu chọn Tiếng Anh -> Chạy bộ lọc từ khóa thông minh
    let translated = trimmed;
    let modified = false;
    for (const [regex, replacement] of KEYWORD_MAP_EN) {
      if (regex.test(translated)) {
        translated = translated.replace(regex, replacement);
        modified = true;
      }
    }

    return modified ? translated : value;
  }
}
