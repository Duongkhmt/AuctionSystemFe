import { Injectable, signal } from '@angular/core';

export type LanguageCode = 'vi' | 'en';

/**
 * ====================================================================================
 * 🌐 GLOBAL DICTIONARY (Từ Điển Đa Ngôn Ngữ VN ↔ EN Toàn Hệ Thống)
 * ====================================================================================
 */
const DICTIONARY: Record<LanguageCode, Record<string, string>> = {
  vi: {
    // Header & Layout
    'nav.marketplace': 'Sàn Đấu Giá',
    'nav.wonAuctions': '🏆 Sản Phẩm Đã Thắng',
    'nav.sellerStudio': 'Kênh Người Bán',
    'nav.adminApproval': 'Duyệt Bài Admin',
    'nav.language': 'Ngôn Ngữ',
    'nav.user': 'Tài Khoản:',
    'nav.backToMarketplace': '← Quay lại sàn đấu giá',

    // Status Badges
    'status.PENDING': 'CHỜ DUYỆT',
    'status.PENDING_APPROVAL': 'CHỜ DUYỆT',
    'status.APPROVED': 'ĐÃ DUYỆT',
    'status.REJECTED': 'TỪ CHỐI',
    'status.SCHEDULED': 'SẮP DIỄN RA',
    'status.RUNNING': 'ĐANG ĐẤU GIÁ',
    'status.ENDED': 'ĐÃ KẾT THÚC',
    'status.EXPIRED': 'HẾT HẠN',
    'status.CANCELLED': 'ĐÃ HỦY',
    'status.BUY_NOW': 'MUA NGAY',

    // Timer Pipe
    'timer.ended': 'Đã kết thúc',
    'timer.notStarted': 'Chưa bắt đầu',

    // Home / Marketplace
    'home.heroTitle': 'Sàn Đấu Giá Trực Tuyến Đa Ngành Hàng',
    'home.heroSubtitle': 'Khám phá và săn ngay những tài sản giá trị, đồ cổ xa xỉ & sản phẩm hiếm với hệ thống đấu giá minh bạch realtime.',
    'home.allCategories': 'Tất Cả Danh Mục',
    'home.searchPlaceholder': 'Tìm kiếm sản phẩm, nhà đất, đồng hồ, xe cộ...',
    'home.startPrice': 'Giá khởi điểm:',
    'home.currentPrice': 'Giá hiện tại:',
    'home.minBidStep': 'Bước giá tối thiểu:',
    'home.viewDetail': '🔍 Xem Chi Tiết & Đặt Giá',
    'home.noProducts': 'Không tìm thấy sản phẩm nào phù hợp.',

    // Product Detail Page
    'product.category': 'Danh mục',
    'product.productId': 'Mã sản phẩm:',
    'product.auctionId': 'Mã thầu:',
    'product.specs': '⚙️ Thông Số & Thuộc Tính Kỹ Thuật',
    'product.description': '📝 Mô Tả Chi Tiết Sản Phẩm',
    'product.timeRemaining': 'Thời Gian Còn Lại',
    'product.fixedBuyNowPrice': 'Giá Mua Ngay Cố Định',
    'product.currentBidPrice': 'Giá Hiện Tại',
    'product.minBidStepLabel': 'Bước Giá Tối Thiểu',
    'product.inputBidLabel': 'Nhập Giá Đặt Cạnh Tranh (Tối thiểu:',
    'product.inputAutoBidLabel': 'Cài Mức Giá Trần Auto-Bid (Tùy chọn - Tự động nhảy thầu cho bạn)',
    'product.autoBidPlaceholder': 'Nhập giá trần tối đa...',
    'product.placeBidBtn': '🚀 Đặt Giá Ngay',
    'product.buyNowBtn': '⚡ Mua Ngay Giá',
    'product.buyNowOrLabel': 'Hoặc sở hữu ngay không cần chờ đợi:',
    'product.ownerNotice': '🏪 Bạn là Người Bán sản phẩm này',
    'product.endedTitle': '🏆 Phiên Đấu Giá Đã Kết Thúc!',
    'product.endedWinner': 'Người thắng cuộc:',
    'product.endedWinningPrice': 'Giá thắng chung cuộc:',
    'product.endedNoBids': 'Phiên đấu giá đã khép lại mà không có lượt đặt giá nào.',
    'product.historyTitle': '📜 Lịch Sử Đặt Giá Công Khai',
    'product.refresh': '🔄 Làm mới',
    'product.noHistory': 'Chưa có ai đặt thầu phiên này.',

    // Won Auctions (Bidder Portal)
    'won.title': '🏆 Sản Phẩm Đã Thắng Đấu Giá',
    'won.subtitle': 'Quản lý danh sách các bài đấu giá bạn đã chiến thắng, thực hiện Checkout thanh toán và xác nhận nhận hàng.',
    'won.allTab': 'Tất Cả',
    'won.unpaidTab': '⏳ Chờ Thanh Toán',
    'won.paidTab': '✅ Đã Thanh Toán',
    'won.shippingTab': '🚚 Đang Giao Hàng',
    'won.completedTab': '🎉 Hoàn Tất',
    'won.winningPrice': 'Giá thắng thầu:',
    'won.checkoutBtn': '💳 Thanh Toán Ngay (Checkout)',
    'won.confirmReceivedBtn': '📦 Bấm Xác Nhận "Đã Nhận Hàng"',
    'won.shippingInfo': 'Thông tin vận chuyển:',
    'won.courier': 'Bưu cục:',
    'won.tracking': 'Mã vận đơn:',
    'won.noItems': 'Bạn chưa thắng phiên đấu giá nào.',

    // Checkout Modal
    'checkout.title': '💳 XÁC NHẬN THANH TOÁN ĐƠN HÀNG',
    'checkout.shippingAddress': 'Địa Chỉ Giao Hàng Chi Tiết',
    'checkout.addressPlaceholder': 'Nhập số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành...',
    'checkout.addressError': '⚠️ Vui lòng nhập địa chỉ giao hàng chi tiết',
    'checkout.phone': 'Số Điện Thoại Liên Hệ',
    'checkout.phonePlaceholder': 'Nhập số điện thoại nhận hàng (ví dụ: 0912345678)...',
    'checkout.phoneError': '⚠️ Vui lòng nhập số điện thoại nhận hàng hợp lệ',
    'checkout.paymentMethod': 'Phương Thức Thanh Toán',
    'checkout.confirmBtn': '⚡ XÁC NHẬN THANH TOÁN',
    'checkout.cancelBtn': 'Hủy Bỏ',

    // Seller Studio
    'seller.title': '📦 Quản Lý Bài Đăng & Đơn Hàng Người Bán',
    'seller.subtitle': 'Đăng bài sản phẩm mới, quản lý phiên đấu giá, theo dõi trạng thái kiểm duyệt và xuất hàng.',
    'seller.createBtn': '➕ Đăng Bài Sản Phẩm Mới',
    'seller.ordersTab': '📦 Đơn Hàng Đã Bán',
    'seller.productsTab': '📋 Bài Đăng Của Tôi',
    'seller.totalRevenue': 'Tổng Doanh Thu Trúng Thầu:',
    'seller.shipBtn': '🚚 Xuất Hàng & Nhập Mã Vận Đơn',
    'seller.cancelBtn': '🚫 Hủy Phiên',
    'seller.relistBtn': '🔄 Đấu Giá Lại (Relist)',
    'seller.editBtn': '✏️ Chỉnh Sửa',
    'seller.deleteBtn': '🗑️ Xóa Bài',
    'seller.noProducts': 'Bạn chưa có bài đăng sản phẩm nào.',

    // Ship Modal
    'ship.title': '🚚 XUẤT HÀNG & NHẬP MÃ VẬN ĐƠN',
    'ship.courier': 'Đơn Vị Vận Chuyển / Bưu Cục',
    'ship.tracking': 'Mã Vận Đơn (Tracking Code)',
    'ship.trackingPlaceholder': 'Nhập mã vận đơn bưu cục...',
    'ship.trackingError': '⚠️ Mã vận đơn không được để trống',
    'ship.confirmBtn': '📦 XÁC NHẬN XUẤT HÀNG',

    // Product Create / Edit Form
    'form.createTitle': '➕ Tạo Bài Đăng Sản Phẩm Mới',
    'form.editTitle': '✏️ Chỉnh Sửa Bài Đăng Sản Phẩm',
    'form.productTitle': 'Tiêu Đề Sản Phẩm',
    'form.titleError': '⚠️ Vui lòng nhập tiêu đề sản phẩm (tối thiểu 5 ký tự)',
    'form.category': 'Danh Mục Sản Phẩm',
    'form.categoryError': '⚠️ Vui lòng chọn danh mục sản phẩm',
    'form.auctionType': 'Hình Thức Đấu Giá',
    'form.startPrice': 'Giá Khởi Điểm (VNĐ)',
    'form.priceError': '⚠️ Giá khởi điểm phải lớn hơn 0',
    'form.bidStep': 'Bước Giá Tối Thiểu (VNĐ)',
    'form.reservePrice': 'Giá Bảo Lưu / Giá Sàn Ẩn (VNĐ)',
    'form.buyNowPrice': 'Giá Mua Ngay Cố Định (VNĐ)',
    'form.startTime': 'Thời Gian Bắt Đầu',
    'form.endTime': 'Thời Gian Kết Thúc',
    'form.images': 'Hình Ảnh Sản Phẩm (Tối đa 20 ảnh)',
    'form.imagesError': '⚠️ Vui lòng chọn tối thiểu 1 hình ảnh sản phẩm',
    'form.description': 'Mô Tả Chi Tiết',
    'form.submitCreate': '🚀 Gửi Bài Đăng Chờ Duyệt',
    'form.submitEdit': '💾 Cập Nhật Bài Đăng',

    // Admin Moderation
    'admin.title': '🛡️ Cổng Kiểm Duyệt Bài Đăng Admin',
    'admin.subtitle': 'Xem xét danh sách bài đăng PENDING từ người bán và phê duyệt hoặc từ chối.',
    'admin.approveBtn': '✓ Phê Duyệt Cho Lên Sàn',
    'admin.rejectBtn': '✕ Từ Chối Bài Đăng',
    'admin.rejectReasonPlaceholder': 'Nhập lý do từ chối bài đăng...',
    'admin.noPending': 'Hiện không có bài đăng nào đang chờ duyệt.'
  },

  en: {
    // Header & Layout
    'nav.marketplace': 'Marketplace',
    'nav.wonAuctions': '🏆 Won Auctions',
    'nav.sellerStudio': 'Seller Studio',
    'nav.adminApproval': 'Admin Moderation',
    'nav.language': 'Language',
    'nav.user': 'Account:',
    'nav.backToMarketplace': '← Back to Marketplace',

    // Status Badges
    'status.PENDING': 'PENDING APPROVAL',
    'status.PENDING_APPROVAL': 'PENDING APPROVAL',
    'status.APPROVED': 'APPROVED',
    'status.REJECTED': 'REJECTED',
    'status.SCHEDULED': 'SCHEDULED',
    'status.RUNNING': 'LIVE AUCTION',
    'status.ENDED': 'ENDED',
    'status.EXPIRED': 'EXPIRED',
    'status.CANCELLED': 'CANCELLED',
    'status.BUY_NOW': 'BUY NOW',

    // Timer Pipe
    'timer.ended': 'Ended',
    'timer.notStarted': 'Not started',

    // Home / Marketplace
    'home.heroTitle': 'Realtime Multi-Category Online Auction Platform',
    'home.heroSubtitle': 'Discover and bid on valuable assets, luxury watches, sports cars & vintage antiques with live countdown.',
    'home.allCategories': 'All Categories',
    'home.searchPlaceholder': 'Search products, real estate, watches, cars...',
    'home.startPrice': 'Starting Price:',
    'home.currentPrice': 'Current Price:',
    'home.minBidStep': 'Min Bid Step:',
    'home.viewDetail': '🔍 View Details & Bid',
    'home.noProducts': 'No matching products found.',

    // Product Detail Page
    'product.category': 'Category',
    'product.productId': 'Product ID:',
    'product.auctionId': 'Auction ID:',
    'product.specs': '⚙️ Specifications & Technical Attributes',
    'product.description': '📝 Detailed Description',
    'product.timeRemaining': 'Time Remaining',
    'product.fixedBuyNowPrice': 'Fixed Buy-Now Price',
    'product.currentBidPrice': 'Current Price',
    'product.minBidStepLabel': 'Min Bid Increment',
    'product.inputBidLabel': 'Enter Competitive Bid Amount (Min:',
    'product.inputAutoBidLabel': 'Set Proxy Auto-Bid Ceiling (Optional - Auto-bids for you)',
    'product.autoBidPlaceholder': 'Enter maximum bid ceiling...',
    'product.placeBidBtn': '🚀 Place Bid Now',
    'product.buyNowBtn': '⚡ Buy Now Price',
    'product.buyNowOrLabel': 'Or buy instantly without waiting:',
    'product.ownerNotice': '🏪 You are the Seller of this product',
    'product.endedTitle': '🏆 Auction Has Ended!',
    'product.endedWinner': 'Winning Bidder:',
    'product.endedWinningPrice': 'Final Winning Price:',
    'product.endedNoBids': 'Auction closed with no submitted bids.',
    'product.historyTitle': '📜 Public Bid History',
    'product.refresh': '🔄 Refresh',
    'product.noHistory': 'No bids placed yet for this auction.',

    // Won Auctions (Bidder Portal)
    'won.title': '🏆 Won Auction Products',
    'won.subtitle': 'Manage won auctions, execute checkout payments, and confirm receipt of items.',
    'won.allTab': 'All',
    'won.unpaidTab': '⏳ Pending Payment',
    'won.paidTab': '✅ Paid',
    'won.shippingTab': '🚚 In Transit',
    'won.completedTab': '🎉 Completed',
    'won.winningPrice': 'Winning Price:',
    'won.checkoutBtn': '💳 Checkout Now',
    'won.confirmReceivedBtn': '📦 Confirm Order Received',
    'won.shippingInfo': 'Shipping Details:',
    'won.courier': 'Courier:',
    'won.tracking': 'Tracking Code:',
    'won.noItems': 'You have not won any auctions yet.',

    // Checkout Modal
    'checkout.title': '💳 CONFIRM ORDER CHECKOUT',
    'checkout.shippingAddress': 'Detailed Shipping Address',
    'checkout.addressPlaceholder': 'Enter house number, street name, ward, district, city...',
    'checkout.addressError': '⚠️ Please enter a detailed shipping address',
    'checkout.phone': 'Contact Phone Number',
    'checkout.phonePlaceholder': 'Enter recipient phone number (e.g. 0912345678)...',
    'checkout.phoneError': '⚠️ Please enter a valid phone number',
    'checkout.paymentMethod': 'Payment Method',
    'checkout.confirmBtn': '⚡ CONFIRM PAYMENT',
    'checkout.cancelBtn': 'Cancel',

    // Seller Studio
    'seller.title': '📦 Seller Listings & Sales Orders',
    'seller.subtitle': 'Post new products, manage auctions, track moderation status, and ship orders.',
    'seller.createBtn': '➕ Post New Product',
    'seller.ordersTab': '📦 Sales Orders',
    'seller.productsTab': '📋 My Listings',
    'seller.totalRevenue': 'Total Winning Revenue:',
    'seller.shipBtn': '🚚 Ship Order & Enter Tracking',
    'seller.cancelBtn': '🚫 Cancel Auction',
    'seller.relistBtn': '🔄 Relist Auction',
    'seller.editBtn': '✏️ Edit',
    'seller.deleteBtn': '🗑️ Delete',
    'seller.noProducts': 'You have no posted products yet.',

    // Ship Modal
    'ship.title': '🚚 SHIP ORDER & ENTER TRACKING',
    'ship.courier': 'Shipping Courier Name',
    'ship.tracking': 'Tracking Code',
    'ship.trackingPlaceholder': 'Enter courier tracking code...',
    'ship.trackingError': '⚠️ Tracking code cannot be empty',
    'ship.confirmBtn': '📦 CONFIRM SHIPMENT',

    // Product Create / Edit Form
    'form.createTitle': '➕ Create New Product Listing',
    'form.editTitle': '✏️ Edit Product Listing',
    'form.productTitle': 'Product Title',
    'form.titleError': '⚠️ Please enter a title (min 5 chars)',
    'form.category': 'Product Category',
    'form.categoryError': '⚠️ Please select a category',
    'form.auctionType': 'Auction Type',
    'form.startPrice': 'Starting Price (VND)',
    'form.priceError': '⚠️ Starting price must be greater than 0',
    'form.bidStep': 'Min Bid Increment (VND)',
    'form.reservePrice': 'Reserve Price (VND)',
    'form.buyNowPrice': 'Fixed Buy-Now Price (VND)',
    'form.startTime': 'Start Time',
    'form.endTime': 'End Time',
    'form.images': 'Product Images (Max 20)',
    'form.imagesError': '⚠️ Please select at least 1 image',
    'form.description': 'Detailed Description',
    'form.submitCreate': '🚀 Submit For Moderation',
    'form.submitEdit': '💾 Save Changes',

    // Admin Moderation
    'admin.title': '🛡️ Admin Moderation Portal',
    'admin.subtitle': 'Review PENDING listings from sellers and approve or reject them.',
    'admin.approveBtn': '✓ Approve For Marketplace',
    'admin.rejectBtn': '✕ Reject Listing',
    'admin.rejectReasonPlaceholder': 'Enter rejection reason...',
    'admin.noPending': 'No pending listings to review.'
  }
};

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly LANG_KEY = 'app_language';
  currentLang = signal<LanguageCode>(this.loadInitialLang());

  private loadInitialLang(): LanguageCode {
    const saved = localStorage.getItem(this.LANG_KEY);
    if (saved === 'en' || saved === 'vi') {
      return saved;
    }
    return 'vi';
  }

  setLanguage(lang: LanguageCode): void {
    localStorage.setItem(this.LANG_KEY, lang);
    this.currentLang.set(lang);
  }

  translate(key: string): string {
    const lang = this.currentLang();
    return DICTIONARY[lang]?.[key] || DICTIONARY['vi']?.[key] || key;
  }

  t(key: string): string {
    return this.translate(key);
  }
}
