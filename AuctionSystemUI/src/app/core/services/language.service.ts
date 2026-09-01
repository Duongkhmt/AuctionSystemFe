import { Injectable, signal } from '@angular/core';

export type LanguageCode = 'vi' | 'en';

/**
 * ====================================================================================
 * 🌐 GLOBAL DICTIONARY (Từ Điển Đa Ngôn Ngữ Song Ngữ VN ↔ EN Toàn Hệ Thống)
 * ====================================================================================
 */
const DICTIONARY: Record<LanguageCode, Record<string, string>> = {
  vi: {
    // Header & Layout Nav Items
    'nav.marketplace': 'Sàn Đấu Giá',
    'nav.realEstate': 'Bất Động Sản',
    'nav.watchesJewelry': 'Đồng Hồ & Trang Sức',
    'nav.antiques': 'Đồ Cổ',
    'nav.myAccount': 'Tài Khoản Của Tôi',
    'nav.wonProducts': 'Xem: Sản Phẩm Đã Thắng',
    'nav.myListedProducts': 'Xem: Sản Phẩm Đã Đăng',
    'nav.wonAuctions': 'Sản Phẩm Đã Thắng',
    'nav.sellerStudio': 'Sản Phẩm Đã Đăng',
    'nav.adminApproval': 'Quản Lý Bài Đăng',
    'nav.language': 'Ngôn Ngữ',
    'nav.user': 'Tài Khoản:',
    'nav.backToMarketplace': '← Quay lại sàn đấu giá',
    'nav.login': 'Đăng Nhập',
    'nav.register': 'Đăng Ký',
    'nav.logout': 'Đăng Xuất',

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

    // Home / Hero Banner Section
    'hero.defaultSubtitle': '— PHIÊN ĐẤU GIÁ TRỰC TUYẾN',
    'hero.defaultTitlePrefix': 'Sàn đấu giá cho những ',
    'hero.defaultTitleHighlight': 'vật phẩm hiếm',
    'hero.defaultDescription': 'Đồ cổ, xa xỉ phẩm và bất động sản được thẩm định, minh bạch giá theo thời gian thực — từ phòng đấu giá đến màn hình của bạn.',
    'hero.defaultStat1': '1,240+',
    'hero.defaultStat1Label': 'Lô đã đấu giá',
    'hero.defaultStat2': '98.4%',
    'hero.defaultStat2Label': 'Tỷ lệ đấu thành công',
    'hero.defaultStat3': '0.02s',
    'hero.defaultStat3Label': 'Độ trễ đặt giá realtime',

    'hero.reSubtitle': '— DANH MỤC BẤT ĐỘNG SẢN',
    'hero.reTitlePrefix': 'Đấu giá biệt thự & ',
    'hero.reTitleHighlight': 'bất động sản cao cấp',
    'hero.reDescription': 'Biệt thự ven biển, penthouse xa xỉ và đất nền đấu giá tiềm năng được niêm yết minh bạch.',
    'hero.reStat1': '350+',
    'hero.reStat1Label': 'Bất động sản niêm yết',
    'hero.reStat2': '99.1%',
    'hero.reStat2Label': 'Pháp lý thẩm định',

    'hero.watchSubtitle': '— BẢO TÀNG ĐỒNG HỒ & TRANG SỨC',
    'hero.watchTitlePrefix': 'Đấu giá đồng hồ Thụy Sĩ & ',
    'hero.watchTitleHighlight': 'trang sức xa xỉ',
    'hero.watchDescription': 'Rolex, Patek Philippe, Audemars Piguet và trang sức kim cương thiên nhiên 100% chính hãng.',
    'hero.watchStat1': '480+',
    'hero.watchStat1Label': 'Đồng hồ & kim cương',
    'hero.watchStat2': '100%',
    'hero.watchStat2Label': 'Thẩm định chính hãng',

    'hero.antiqueSubtitle': '— BÁU VẬT & CỔ VẬT LỊCH SỬ',
    'hero.antiqueTitlePrefix': 'Đấu giá cổ vật & ',
    'hero.antiqueTitleHighlight': 'di sản văn hóa',
    'hero.antiqueDescription': 'Gốm sứ cổ, tiền cổ, họa phẩm Đông Dương và di sản Hoàng Gia Triều Nguyễn quý hiếm.',
    'hero.antiqueStat1': '210+',
    'hero.antiqueStat1Label': 'Báu vật di sản',
    'hero.antiqueStat2': '97.8%',
    'hero.antiqueStat2Label': 'Chứng thư cổ vật',

    // Search & Filter Bar
    'home.allCategories': 'Tất Cả Danh Mục',
    'home.searchPlaceholder': 'Tìm kiếm sản phẩm, nhà đất, đồng hồ...',
    'home.searchBtn': 'Tìm Kiếm',
    'home.startPrice': 'Giá khởi điểm:',
    'home.currentPrice': 'Giá hiện tại:',
    'home.minBidStep': 'Bước giá:',
    'home.viewDetail': 'Xem Chi Tiết & Đấu Giá',
    'home.noProducts': 'Không tìm thấy lô đấu giá nào phù hợp.',
    'home.viewAllBtn': 'Xem Tất Cả Sản Phẩm',

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
    'product.inputAutoBidLabel': 'Cài Mức Giá Trần Auto-Bid (Tự động nhảy thầu)',
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

    // Account Portal & Won Lots (WonAuctionsComponent)
    'account.userHeader': '— TÀI KHOẢN CỦA',
    'account.wonLotsTitle': 'Các lô bạn đã thắng',
    'account.wonLotsSub': 'Theo dõi và hoàn tất thủ tục cho những lô đấu giá bạn đã trúng thầu.',
    'account.continueBidding': '← Tiếp tục đấu giá',
    'account.tabAll': 'Tất cả',
    'account.tabUnpaid': 'Chờ thanh toán',
    'account.tabPaid': 'Đã thanh toán',
    'account.tabShipping': 'Đang giao hàng',
    'account.tabCompleted': 'Hoàn tất',
    'account.emptyWonTitle': 'Bạn chưa thắng lô nào',
    'account.emptyWonSub': 'Khi bạn đấu giá thành công một lô, nó sẽ xuất hiện tại đây để bạn thanh toán và theo dõi giao hàng.',
    'account.viewActiveLots': 'Xem các lô đang đấu giá',

    // Seller Studio (SellerProductListComponent & SellerOrdersComponent)
    'seller.headerSub': '— SẢN PHẨM ĐÃ ĐĂNG',
    'seller.manageListings': 'Quản lý sản phẩm đã đăng',
    'seller.manageOrders': 'Quản lý đơn hàng đã bán',
    'seller.workspacePrefix': 'Không gian bán hàng riêng của',
    'seller.sellerId': 'Seller ID:',
    'seller.newListingBtn': '+ Đăng bài mới',
    'seller.sidebarHeader': '— SẢN PHẨM ĐÃ ĐĂNG',
    'seller.menuListings': 'Danh sách sản phẩm',
    'seller.menuOrders': 'Đơn hàng đã bán',
    'seller.menuCreate': '+ Tạo bài đăng mới',
    'seller.emptyListedTitle': 'Bạn chưa đăng sản phẩm nào',
    'seller.emptyListedSub': 'Đăng lô đầu tiên để bắt đầu bán trên AuctionHub — chỉ mất vài phút để tạo bài và chờ duyệt.',
    'seller.revenue': 'Doanh thu trúng thầu',
    'seller.pendingShip': 'Chờ xuất hàng (PAID)',
    'seller.completedOrders': 'Hoàn tất thành công',
    'seller.editBtn': '✏️ Sửa',
    'seller.cancelBtn': 'Hủy Phiên',
    'seller.relistBtn': '🔄 Đăng Lại (30d)',
    'seller.deleteBtn': 'Xóa Bài',

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
    'checkout.phonePlaceholder': 'Nhập số điện thoại nhận hàng...',
    'checkout.phoneError': '⚠️ Vui lòng nhập số điện thoại nhận hàng hợp lệ',
    'checkout.paymentMethod': 'Phương Thức Thanh Toán',
    'checkout.confirmBtn': '⚡ XÁC NHẬN THANH TOÁN',
    'checkout.cancelBtn': 'Hủy Bỏ',

    // Ship Modal
    'ship.title': '🚚 XUẤT HÀNG & NHẬP MÃ VẬN ĐƠN',
    'ship.courier': 'Đơn Vị Vận Chuyển / Bưu Cục',
    'ship.tracking': 'Mã Vận Đơn (Tracking Code)',
    'ship.trackingPlaceholder': 'Nhập mã vận đơn bưu cục...',
    'ship.trackingError': '⚠️ Mã vận đơn không được để trống',
    'ship.confirmBtn': '📦 XÁC NHẬN XUẤT HÀNG',

    // Product Creation (CreateProductComponent)
    'create.headerSub': '— HỒ SƠ ĐĂNG KÝ LÔ MỚI',
    'create.headerTitle': 'Tạo bài đăng sản phẩm',
    'create.headerSubText': 'Bài đăng sẽ được chuyển đến Admin để thẩm định trước khi lên sàn.',
    'create.cancelLink': '← Huỷ bỏ',
    'create.sectionA': 'A. Thông tin sản phẩm',
    'create.categoryLabel': 'Danh mục sản phẩm',
    'create.titleLabel': 'Tiêu đề sản phẩm',
    'create.titleLength': '10–150 ký tự',
    'create.titlePlaceholder': 'Nhập tiêu đề sản phẩm...',
    'create.descLabel': 'Mô tả chi tiết',
    'create.descPlaceholder': 'Nhập mô tả sản phẩm chi tiết...',
    'create.imagesLabel': 'Hình ảnh sản phẩm',
    'create.imagesLimit': 'tối thiểu 1 ảnh, tối đa 20 ảnh',
    'create.dropzoneTitle': 'Kéo thả ảnh vào đây hoặc bấm để chọn file',
    'create.dropzoneSub': 'PNG, JPG — ảnh đầu tiên sẽ là ảnh đại diện của lô',
    'create.mainImageBadge': 'Ảnh chính',
    'create.sectionB': 'B. Cấu hình phiên đấu giá',
    'create.auctionTypeLabel': 'Loại đấu giá',
    'create.typeEnglish': 'Đấu giá kiểu Anh (tăng dần)',
    'create.typeReserve': 'Đấu giá giá bảo lưu (Reserve)',
    'create.typeBuyNow': 'Mua ngay giá cố định (Buy Now)',
    'create.startPriceLabel': 'Giá khởi điểm (VNĐ)',
    'create.bidStepLabel': 'Bước giá (VNĐ)',
    'create.buyNowPriceLabel': 'Giá mua ngay (VNĐ)',
    'create.buyNowPriceSub': 'Người mua có thể chốt ngay ở mức giá này, kết thúc phiên đấu giá.',
    'create.reservePriceLabel': 'Giá bảo lưu — Reserve (VNĐ)',
    'create.reservePriceSub': 'Lô chỉ được chốt bán nếu giá thầu cao nhất đạt mức này.',
    'create.startTimeLabel': 'Thời gian bắt đầu',
    'create.endTimeLabel': 'Thời gian kết thúc',
    'create.saveDraftBtn': 'Lưu nháp',
    'create.submitBtn': 'Gửi duyệt bài đăng',
    
    // Live Preview Box (Preview Card)
    'preview.headerSub': '— XEM TRƯỚC LÔ',
    'preview.lotCodeBadge': 'LOT — CHỜ CẤP MÃ',
    'preview.imagePlaceholder': 'Ảnh đại diện sẽ hiển thị ở đây',
    'preview.titlePlaceholder': 'Tiêu đề sản phẩm...',
    'preview.startPriceLabel': 'Giá khởi điểm',
    'preview.pendingBadge': 'Chờ duyệt',
    'preview.editingBadge': 'Đang sửa',
    'preview.noticeText': 'Đây là cách lô của bạn sẽ hiển thị trên sàn sau khi được duyệt.',
    'preview.categoryLabel': 'Danh mục:',
    'preview.durationLabel': 'Thời lượng:',
    'preview.daysSuffix': 'ngày',

    // Product Editing (EditProductComponent)
    'edit.headerSub': '— HỒ SƠ CHỈNH SỬA LÔ #',
    'edit.headerTitle': 'Chỉnh sửa bài đăng sản phẩm',
    'edit.headerSubText': 'Cập nhật thông tin bài đăng trước khi phiên đấu giá diễn ra.',
    'edit.backLink': '← Quay lại danh sách',
    'edit.cancelBtn': 'Hủy thay đổi',
    'edit.saveBtn': 'Lưu thông tin cập nhật',

    // Admin Moderation
    'admin.title': '🛡️ Cổng Kiểm Duyệt Bài Đăng Admin',
    'admin.subtitle': 'Xem xét danh sách bài đăng PENDING từ người bán và phê duyệt hoặc từ chối.',
    'admin.approveBtn': '✓ Phê Duyệt Cho Lên Sàn',
    'admin.rejectBtn': '✕ Từ Chối Bài Đăng',
    'admin.rejectReasonPlaceholder': 'Nhập lý do từ chối bài đăng...',
    'admin.noPending': 'Hiện không có bài đăng nào đang chờ duyệt.'
  },

  en: {
    // Header & Layout Nav Items
    'nav.marketplace': 'Auction Marketplace',
    'nav.realEstate': 'Real Estate',
    'nav.watchesJewelry': 'Watches & Jewelry',
    'nav.antiques': 'Antiques',
    'nav.myAccount': 'My Account',
    'nav.wonProducts': 'View: Won Lots',
    'nav.myListedProducts': 'View: Listed Items',
    'nav.wonAuctions': 'Won Auctions',
    'nav.sellerStudio': 'Listed Items',
    'nav.adminApproval': 'Admin Moderation',
    'nav.language': 'Language',
    'nav.user': 'Account:',
    'nav.backToMarketplace': '← Back to Marketplace',
    'nav.login': 'Sign In',
    'nav.register': 'Register',
    'nav.logout': 'Sign Out',

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

    // Home / Hero Banner Section
    'hero.defaultSubtitle': '— LIVE ONLINE AUCTION',
    'hero.defaultTitlePrefix': 'Auction platform for ',
    'hero.defaultTitleHighlight': 'rare treasures',
    'hero.defaultDescription': 'Antiques, luxury items, and real estate authenticated and priced in real-time — from the auction room to your screen.',
    'hero.defaultStat1': '1,240+',
    'hero.defaultStat1Label': 'Auctioned Lots',
    'hero.defaultStat2': '98.4%',
    'hero.defaultStat2Label': 'Success Rate',
    'hero.defaultStat3': '0.02s',
    'hero.defaultStat3Label': 'Realtime Bidding Latency',

    'hero.reSubtitle': '— REAL ESTATE CATEGORY',
    'hero.reTitlePrefix': 'Auctions for villas & ',
    'hero.reTitleHighlight': 'luxury real estate',
    'hero.reDescription': 'Beachfront villas, luxury penthouses, and high-potential auction land transparently listed.',
    'hero.reStat1': '350+',
    'hero.reStat1Label': 'Listed Estates',
    'hero.reStat2': '99.1%',
    'hero.reStat2Label': 'Verified Titles',

    'hero.watchSubtitle': '— WATCHES & JEWELRY MUSEUM',
    'hero.watchTitlePrefix': 'Auctions for Swiss watches & ',
    'hero.watchTitleHighlight': 'luxury jewelry',
    'hero.watchDescription': 'Rolex, Patek Philippe, Audemars Piguet, and 100% certified authentic natural diamond jewelry.',
    'hero.watchStat1': '480+',
    'hero.watchStat1Label': 'Watches & Diamonds',
    'hero.watchStat2': '100%',
    'hero.watchStat2Label': 'Certified Authentic',

    'hero.antiqueSubtitle': '— HISTORICAL ANTIQUES & TREASURES',
    'hero.antiqueTitlePrefix': 'Auctions for antiques & ',
    'hero.antiqueTitleHighlight': 'cultural heritage',
    'hero.antiqueDescription': 'Vintage ceramics, ancient coins, Indochine fine art, and rare Nguyen Dynasty Imperial relics.',
    'hero.antiqueStat1': '210+',
    'hero.antiqueStat1Label': 'Heritage Relics',
    'hero.antiqueStat2': '97.8%',
    'hero.antiqueStat2Label': 'Certified Provenance',

    // Search & Filter Bar
    'home.allCategories': 'All Categories',
    'home.searchPlaceholder': 'Search products, real estate, watches...',
    'home.searchBtn': 'Search',
    'home.startPrice': 'Starting Price:',
    'home.currentPrice': 'Current Price:',
    'home.minBidStep': 'Bid Increment:',
    'home.viewDetail': 'View Details & Bid',
    'home.noProducts': 'No matching auction lots found.',
    'home.viewAllBtn': 'View All Products',

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
    'product.inputAutoBidLabel': 'Set Proxy Auto-Bid Ceiling',
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

    // Account Portal & Won Lots (WonAuctionsComponent)
    'account.userHeader': '— ACCOUNT OF',
    'account.wonLotsTitle': 'Lots You Have Won',
    'account.wonLotsSub': 'Track and complete checkout procedures for lots you have won.',
    'account.continueBidding': '← Continue bidding',
    'account.tabAll': 'All',
    'account.tabUnpaid': 'Pending payment',
    'account.tabPaid': 'Paid',
    'account.tabShipping': 'In transit',
    'account.tabCompleted': 'Completed',
    'account.emptyWonTitle': 'You haven\'t won any lots yet',
    'account.emptyWonSub': 'When you win an auction lot, it will appear here for checkout and shipment tracking.',
    'account.viewActiveLots': 'Explore Active Auction Lots',

    // Seller Studio (SellerProductListComponent & SellerOrdersComponent)
    'seller.headerSub': '— MY LISTED ITEMS',
    'seller.manageListings': 'Manage Product Listings',
    'seller.manageOrders': 'Manage Sales Orders',
    'seller.workspacePrefix': 'Private seller workspace of',
    'seller.sellerId': 'Seller ID:',
    'seller.newListingBtn': '+ Create New Listing',
    'seller.sidebarHeader': '— MY LISTED ITEMS',
    'seller.menuListings': 'Product Listings',
    'seller.menuOrders': 'Sales Orders',
    'seller.menuCreate': '+ Create New Listing',
    'seller.emptyListedTitle': 'You haven\'t listed any products yet',
    'seller.emptyListedSub': 'Post your first lot to start selling on AuctionHub — takes only a few minutes to create and submit for review.',
    'seller.revenue': 'Winning Revenue',
    'seller.pendingShip': 'Pending Shipment (PAID)',
    'seller.completedOrders': 'Completed Orders',
    'seller.editBtn': '✏️ Edit',
    'seller.cancelBtn': 'Cancel',
    'seller.relistBtn': '🔄 Relist',
    'seller.deleteBtn': 'Delete',

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
    'checkout.phonePlaceholder': 'Enter recipient phone number...',
    'checkout.phoneError': '⚠️ Please enter a valid phone number',
    'checkout.paymentMethod': 'Payment Method',
    'checkout.confirmBtn': '⚡ CONFIRM PAYMENT',
    'checkout.cancelBtn': 'Cancel',

    // Ship Modal
    'ship.title': '🚚 SHIP ORDER & ENTER TRACKING',
    'ship.courier': 'Shipping Courier Name',
    'ship.tracking': 'Tracking Code',
    'ship.trackingPlaceholder': 'Enter courier tracking code...',
    'ship.trackingError': '⚠️ Tracking code cannot be empty',
    'ship.confirmBtn': '📦 CONFIRM SHIPMENT',

    // Product Creation (CreateProductComponent)
    'create.headerSub': '— NEW LOT REGISTRATION FILE',
    'create.headerTitle': 'Create Product Listing',
    'create.headerSubText': 'Listing will be submitted to Admin for appraisal before going live.',
    'create.cancelLink': '← Cancel',
    'create.sectionA': 'A. Product Information',
    'create.categoryLabel': 'Product Category',
    'create.titleLabel': 'Product Title',
    'create.titleLength': '10–150 characters',
    'create.titlePlaceholder': 'Enter product title...',
    'create.descLabel': 'Detailed Description',
    'create.descPlaceholder': 'Enter detailed product description...',
    'create.imagesLabel': 'Product Images',
    'create.imagesLimit': 'minimum 1 image, maximum 20 images',
    'create.dropzoneTitle': 'Drag & drop images here or click to select files',
    'create.dropzoneSub': 'PNG, JPG — first image will be the primary lot cover',
    'create.mainImageBadge': 'Primary Cover',
    'create.sectionB': 'B. Auction Configuration',
    'create.auctionTypeLabel': 'Auction Type',
    'create.typeEnglish': 'English Auction (Ascending)',
    'create.typeReserve': 'Reserve Price Auction',
    'create.typeBuyNow': 'Fixed Buy-Now Price',
    'create.startPriceLabel': 'Starting Price (VND)',
    'create.bidStepLabel': 'Bid Increment (VND)',
    'create.buyNowPriceLabel': 'Buy-Now Price (VND)',
    'create.buyNowPriceSub': 'Buyers can instantly purchase at this price to end the auction.',
    'create.reservePriceLabel': 'Reserve Price (VND)',
    'create.reservePriceSub': 'Lot will only sell if the highest bid reaches or exceeds this price.',
    'create.startTimeLabel': 'Start Time',
    'create.endTimeLabel': 'End Time',
    'create.saveDraftBtn': 'Save Draft',
    'create.submitBtn': 'Submit Listing For Review',
    
    // Live Preview Box (Preview Card)
    'preview.headerSub': '— LOT LIVE PREVIEW',
    'preview.lotCodeBadge': 'LOT — PENDING CODE',
    'preview.imagePlaceholder': 'Cover image will display here',
    'preview.titlePlaceholder': 'Product title...',
    'preview.startPriceLabel': 'Starting Price',
    'preview.pendingBadge': 'Pending Review',
    'preview.editingBadge': 'Editing',
    'preview.noticeText': 'This is how your lot will be displayed on the marketplace after approval.',
    'preview.categoryLabel': 'Category:',
    'preview.durationLabel': 'Duration:',
    'preview.daysSuffix': 'days',

    // Product Editing (EditProductComponent)
    'edit.headerSub': '— EDITING LOT FILE #',
    'edit.headerTitle': 'Edit Product Listing',
    'edit.headerSubText': 'Update listing details before the auction commences.',
    'edit.backLink': '← Back to listings',
    'edit.cancelBtn': 'Discard Changes',
    'edit.saveBtn': 'Save Updated Details',

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
