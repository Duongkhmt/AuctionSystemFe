# Feature: Public Marketplace (Sàn Đấu Giá Công Khai)

# Mục đích
Hiển thị danh sách sản phẩm đang đấu giá công khai cho toàn bộ người dùng, tìm kiếm theo từ khóa/danh mục và cung cấp màn hình Chi tiết sản phẩm với console thầu thời gian thực (Live Bidding Console).

---

# Cấu trúc & Chi tiết từng File

### 1. `public-marketplace.routes.ts`
- **Tuyến đường**:
  - `''`: Render `HomeComponent`.
  - `'product/:id'`: Render `ProductDetailComponent`.

---

### 2. `public-marketplace.service.ts`
- **Mục đích**: Gọi REST API `/v1/products` và `/v1/products/{id}`.
- **Methods**:
  - `getPublicProducts()`: Trả về danh sách `ProductResponse[]`.
  - `getProductById(id: number)`: Trả về chi tiết 1 sản phẩm `ProductResponse`.

---

### 3. `home.component.ts`
- **Mục đích**: Trang chủ giới thiệu Sàn đấu giá.
- **State Management**:
  - `products = signal<ProductResponse[]>([])`
  - `selectedCategoryId = signal<number | null>(null)`
  - `searchQuery = signal<string>('')`
  - `filteredProducts = computed(...)`: Tự động lọc sản phẩm theo danh mục hoặc từ khóa tìm kiếm mà không cần gọi lại API backend.

---

### 4. `product-detail.component.ts`
- **Mục đích**: Màn hình trung tâm của phiên đấu giá.
- **Tính năng nổi bật**:
  - **Live Countdown**: Hiển thị đồng hồ đếm ngược với `AuctionTimerPipe`.
  - **Đặt Giá Ngay (Place Bid)**: Gọi `BiddingService.placeBid()` kèm giá thầu và Proxy Bidding Max Price.
  - **Hard-Close Mode**: Đếm ngược đồng hồ chính xác tới thời điểm kết thúc phiên và chốt thầu (hết giờ là hết giờ).
  - **Mua Ngay Giá Cố Định**: Nút `submitBuyNow()` cho loại hình đấu giá `BUY_NOW`.
  - **Lịch Sử Thầu (Bid History Log)**: Nạp danh sách nhảy giá thời gian thực từ `BiddingService.getBidHistory()`.
