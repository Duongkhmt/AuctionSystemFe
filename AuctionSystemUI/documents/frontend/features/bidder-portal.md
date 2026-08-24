# Feature: Bidder Portal (Cổng Đặt Giá Cá Nhân)

# Mục đích
Quản lý lịch sử đấu giá cá nhân của người dùng vai trò `BIDDER` và cung cấp dịch vụ đặt giá thầu (Bidding Service Engine).

---

# Cấu trúc & Chi tiết từng File

### 1. `bidder-portal.routes.ts`
- **Tuyến đường**: `''`: Render `MyBidsComponent`.

---

### 2. `bidding.service.ts`
- **Mục đích**: Chứa toàn bộ các hàm gọi API đặt giá thầu lên Spring Boot Backend.
- **Methods**:
  - `placeBid(auctionId, bidderId, request: BidRequest)`: Gọi `POST /v1/auctions/{auctionId}/bids?bidderId={bidderId}`.
  - `buyNow(auctionId, bidderId)`: Gọi `POST /v1/auctions/{auctionId}/bids/buy-now?bidderId={bidderId}`.
  - `getBidHistory(auctionId)`: Gọi `GET /v1/auctions/{auctionId}/bids` lấy danh sách nhảy giá.

---

### 3. `my-bids.component.ts`
- **Mục đích**: Trang cá nhân hiển thị danh sách các phiên thầu mà người dùng hiện tại đang tham gia.
- **Dependency Injection**: `userSession = inject(UserSessionService)`.
- **Thông tin**: Hiển thị tên và ID Bidder đang làm việc (Ví dụ: `T Dương`, `ID: 3`).
