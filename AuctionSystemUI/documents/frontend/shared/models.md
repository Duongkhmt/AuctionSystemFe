# Shared Models & Enums: TypeScript Type Definitions

# Mục đích
Định nghĩa kiểu dữ liệu đồng bộ giữa Spring Boot Backend DTOs và Angular Frontend.

---

# Cấu trúc & Chi tiết từng File

### 1. `enums.model.ts`
- **Mục đích**: Chứa các Enums cho Trạng thái Sản phẩm, Trạng thái Phiên đấu giá, Loại Đấu giá và Vai trò Người dùng.
- **Chi tiết Enums**:
  - `ProductStatus`: `PENDING`, `APPROVED`, `REJECTED`.
  - `AuctionStatus`: `PENDING_APPROVAL`, `SCHEDULED`, `RUNNING`, `ENDED`, `CANCELLED`, `EXPIRED`.
  - `AuctionType`: `ENGLISH`, `RESERVE`, `BUY_NOW`.
  - `UserRole`: `'ROLE_BIDDER' | 'ROLE_SELLER' | 'ROLE_ADMIN'`.
  - `UserSession`: Interface gồm `id`, `name`, `email`, `role`.

---

### 2. `product.model.ts`
- **Mục đích**: Interfaces cho bài đăng sản phẩm và phản hồi đầy đủ thông tin phiên đấu giá.
- **Interfaces**:
  - `ProductImageResponse`: `id`, `imageUrl`, `publicId`, `displayOrder`.
  - `ProductResponse`: Tổng hợp thông tin bài đăng + chi tiết đấu giá (`productId`, `sellerId`, `title`, `attributes`, `auctionId`, `currentPrice`, `startPrice`, `maskedWinnerName`, `auctionStatus`...).
  - `ProductRequestForm`: Dữ liệu khi Submit tạo sản phẩm mới.

---

### 3. `bid.model.ts`
- **Mục đích**: Interfaces cho các thao tác đặt giá (Place Bid) và lịch sử giá nhảy (Bid History).
- **Interfaces**:
  - `BidRequest`: `bidAmount`, `maxAutoBidAmount`.
  - `BidResponse`: Phản hồi khi đặt giá thành công (`bidId`, `maskedBidderName`, `newCurrentPrice`, `nextMinBidAmount`, `timeExtended`...).
  - `BidHistoryResponse`: Danh sách lịch sử nhảy giá (`maskedBidderName`, `bidAmount`, `autoBid`, `createdAt`).
