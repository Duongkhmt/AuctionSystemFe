# TỔNG QUAN & PHÂN TÍCH CHI TIẾT 100% CÁC FILE/CLASS FRONTEND (ANGULAR 18) DÀNH CHO BACKEND DEVELOPER


---

---

## PHẦN 1 — BẢN ĐỒ TOÀN BỘ FRONTEND & TECH STACK

### 1. Thông số Kỹ thuật (Tech Stack Summary)
* **Framework**: Angular `^18.2.0` (Sử dụng chuẩn mới nhất: **Standalone Components**, **Signals**, **Functional Interceptors/Guards** - KHÔNG dùng NgModules cũ).
* **Ngôn ngữ**: TypeScript `~5.5.2` (Strongly-typed tương tự Java).
* **Build Tool & CLI**: `@angular-devkit/build-angular` `^18.2.21`, `@angular/cli` `^18.2.21`.
* **Package Manager**: `npm` (`package.json`, `package-lock.json`).
* **UI Component Library**: `primeng` `^18.0.2`, `primeicons` `^8.0.0` (Thư viện UI cung cấp Bảng Table, Modal Dialog, Toast, Button,...).
* **State Management**: Angular **Signals** (`signal()`, `computed()`) kết hợp với RxJS (`BehaviorSubject`, `Observable`).
* **Routing**: `@angular/router` `^18.2.0` với Lazy Loading router chunks.
* **HTTP Client**: `@angular/common/http` (`HttpClient` với functional `withInterceptors`).
* **Form & Validation**: `@angular/forms` (`ReactiveFormsModule`, `FormGroup`, `FormControl`, `Validators`).
* **Styling**: SCSS / Vanilla CSS + PrimeFlex utilities (`app.component.scss`).

---

### 2. Bản Đồ Thư Mục Thực Tế (Actual Directory Map)

```text
AuctionSystemUI/
├── documents/                     # Tài liệu hướng dẫn & Onboarding
│   └── frontend/
│       ├── 01-project-overview.md
│       ├── 02-core.md
│       ├── ...
│       └── FRONTEND_ARCHITECTURE_GUIDE.md
├── public/                        # Static assets (Favicon, Logo, Images)
├── src/
│   ├── index.html                 # Single Page Application HTML duy nhất
│   ├── main.ts                    # Entry Point khởi tạo ứng dụng Angular
│   ├── styles.scss                # Global CSS / Style toàn cục
│   └── app/                       # Mã nguồn ứng dụng chính
│       ├── app.component.ts       # Root Component chính của Angular
│       ├── app.component.html     # Root HTML Template chứa <router-outlet>
│       ├── app.component.scss     # Root Styles
│       ├── app.config.ts          # Dependency Injection Config (Providers, HttpClient, Router)
│       ├── app.routes.ts          # Định tuyến chính (App Level Routing)
│       │
│       ├── core/                  # [LAYER 1] Dịch vụ dùng chung toàn hệ thống (Singleton Services)
│       │   ├── auth/              # Quản lý User Session, Token & Permission
│       │   │   ├── auth.service.ts
│       │   │   ├── permission.service.ts
│       │   │   ├── token.service.ts
│       │   │   └── user-session.service.ts  # State lưu trữ User hiện tại (Signals)
│       │   ├── config/            # Cấu hình URL backend & API endpoints
│       │   │   └── api-endpoints.config.ts
│       │   ├── guards/            # Bảo vệ Route (Role Guard, Auth Guard)
│       │   │   ├── auth.guard.ts
│       │   │   └── role.guard.ts
│       │   ├── interceptors/      # Middleware xử lý HTTP Request & Response
│       │   │   ├── api-header.interceptor.ts  # Đính kèm Header
│       │   │   ├── error.interceptor.ts       # Bắt lỗi 4xx, 5xx tập trung
│       │   │   └── loading.interceptor.ts     # Quản lý Spinner Loading
│       │   ├── services/          # Các Service hỗ trợ toàn cục
│       │   │   ├── category.service.ts
│       │   │   ├── language.service.ts
│       │   │   ├── loading.service.ts
│       │   │   ├── order.service.ts           # Service gọi API Đơn hàng & Checkout
│       │   │   └── toast.service.ts           # Hiển thị thông báo Popup Toast
│       │   └── utils/             # Hàm tiện ích dùng chung
│       │       └── case-converter.util.ts     # Chuyển đổi snake_case ↔ camelCase
│       │
│       ├── shared/                # [LAYER 2] Thành phần tái sử dụng giữa các Feature
│       │   ├── components/        # UI Component chung (Modal, Auth Modal, Status Badge, Toast)
│       │   │   ├── auth-modal/                # Modal Đăng nhập / Đăng ký nhanh khi đang thầu
│       │   │   ├── product-detail-modal/
│       │   │   ├── status-badge/
│       │   │   └── toast-container/
│       │   ├── models/            # Interfaces / Data Models (Tương đương DTO)
│       │   │   ├── bid.model.ts
│       │   │   ├── enums.model.ts
│       │   │   ├── order.model.ts
│       │   │   └── product.model.ts
│       │   └── pipes/             # Hàm biến đổi hiển thị trên Template (Format currency, Time,...)
│       │       ├── auction-status-badge.pipe.ts
│       │       ├── currency-format.pipe.ts
│       │       ├── currency-vnd.pipe.ts
│       │       └── time-remaining.pipe.ts
│       │
│       ├── layout/                # [LAYER 3] Các bộ khung giao diện chính (Master Layouts)
│       │   ├── admin-layout/      # Layout dành cho Quản trị viên
│       │   ├── main-layout/       # Layout công khai dành cho Khách hàng & Bidder
│       │   └── seller-layout/     # Layout dành cho Người bán (Seller Studio)
│       │
│       └── features/              # [LAYER 4] Các Module Phân vùng Nghiệp vụ chính
│           ├── admin-moderation/  # Duyệt sản phẩm đấu giá (Admin)
│           │   ├── admin.routes.ts
│           │   ├── pages/pending-approval/
│           │   └── services/admin-api.service.ts
│           ├── auth/              # Đăng nhập, Đăng ký & JWT Session
│           │   ├── auth.routes.ts
│           │   └── pages/
│           │       ├── login/                 # Màn hình Đăng nhập (Auto-fill email từ Đăng ký)
│           │       └── register/              # Màn hình Đăng ký (Chuyển sang Login khi xong)
│           ├── bidder-portal/     # Trang dành cho Người đấu giá (Đơn thắng cuộc, Đã đặt giá)
│           │   ├── bidder-portal.routes.ts
│           │   ├── components/checkout-modal/
│           │   ├── pages/
│           │   │   ├── my-bids/
│           │   │   └── won-auctions/
│           │   └── services/bidding.service.ts
│           ├── public-marketplace/# Sàn đấu giá công khai (Trang chủ, Chi tiết sản phẩm)
│           │   ├── public-marketplace.routes.ts
│           │   ├── pages/
│           │   │   ├── home/
│           │   │   └── product-detail/
│           │   └── services/public-marketplace.service.ts
│           └── seller-studio/     # Kênh Quản lý dành cho Người bán
│               ├── seller.routes.ts
│               ├── components/ship-modal/
│               ├── pages/
│               │   ├── create-product/
│               │   ├── edit-product/
│               │   ├── product-list/
│               │   └── seller-orders/
│               └── services/seller-api.service.ts
```

---

## PHẦN 2 — TƯƠNG QUAN KIẾN TRÚC: BACKEND VS FRONTEND

### 1. Bảng So Sánh Kiến Trúc (Architecture Mapping)

| Kiến Trúc Backend (Spring Boot) | Kiến Trúc Frontend (Angular 18) | Vai Trò Tương Ứng |
| :--- | :--- | :--- |
| `HTTP Request` (Client gửi tới) | `Browser Router Event` | Người dùng gõ URL hoặc click link điều hướng |
| `Filter / SecurityFilterChain` | `Functional Route Guard` (`roleGuard`) | Kiểm tra đăng nhập/quyền trước khi cho truy cập |
| `Controller` (`@RestController`) | `Page / Component` (`HomeComponent`) | Bắt sự kiện người dùng, nhận dữ liệu và điều phối UI |
| `@PathVariable` / `@RequestParam` | `@Input()` / `ActivatedRoute` | Lấy tham số từ URL truyền vào Component |
| `Service Layer` (`@Service`) | `Feature / Core Service` (`OrderService`) | Chứa logic gọi API, xử lý dữ liệu nghiệp vụ |
| `DTO` (Data Transfer Object) | `TypeScript Interface / Model` | Định nghĩa kiểu dữ liệu mã hóa chuẩn xác |
| `Jackson Serialization` (snake_case) | `Case Converter Utility` | Chuyển đổi tên trường: `winning_price` ↔ `winningPrice` |
| `RestTemplate` / `WebClient` | `HttpClient` | Gọi HTTP Request đi ra ngoài |
| `Spring Interceptor` | `Functional HTTP Interceptor` | Tự động chèn Header Token, bắt lỗi HTTP Status |
| `Database State` / `Repository` | `Angular Signals` / `LocalStorage` | Quản lý state dữ liệu hiển thị tức thì trên màn hình |

---

### 2. Sơ Đồ Luồng Xử Lý Dữ Liệu Tương Tác (Data Flow Lifecycle)

```text
 [ User Click Nút "Thanh Toán" ]
               │
               ▼
 [ CheckoutModalComponent ] (bắt event submit form -> validate)
               │
               ▼
 [ OrderService.checkout() ] (chuyển payload từ camelCase -> snake_case)
               │
               ▼
 [ apiHeaderInterceptor ] (tự động gắn header 'x-user-id')
               │
               ▼
 [ HttpClient.post() ] ───────── HTTP POST /v1/bidders/3/orders/10/checkout ─────────► [ Spring Boot Backend ]
                                                                                                 │
 [ CheckoutModalComponent ] ◄── [ snakeToCamelKeys ] ◄── [ HTTP 200 Response (JSON) ] ──────────┘
       │
       ▼ (Cập nhật Signal State)
 [ UI Re-render ] -> Hiện Popup "Thanh toán thành công!"
```

---

## PHẦN 3 — PHÂN TÍCH CHI TIẾT THEO FOLDER (FOLDER STRUCTURE)

### 1. Thư mục `src/app/core/` (Lớp Lõi Hệ Thống)
* **Chức năng**: Chứa tất cả các dịch vụ dùng chung có phạm vi **Singleton** (chỉ có 1 instance trong toàn bộ ứng dụng).
* **Quy tắc**: `core` KHÔNG ĐƯỢC HỦY HAY ĐỘNG ĐẾN các component giao diện cụ thể. `core` chỉ phục vụ các dữ liệu nền tảng như Authentication, Session, Interceptors, Guards và API Config.
* **Mối quan hệ**: Được tất cả các lớp `layout` và `features` gọi tới.

### 2. Thư mục `src/app/shared/` (Lớp Tái Sử Dụng)
* **Chức năng**: Chứa các UI Components, Models, Pipes mang tính chất trung lập và có thể tái sử dụng ở bất kỳ Feature nào.
* **Ví dụ**: Component `StatusBadgeComponent` được cả trang Người bán (`seller-orders`), trang Người mua (`won-auctions`) và trang Admin (`pending-approval`) tái sử dụng để hiển thị màu sắc trạng thái đơn hàng/sản phẩm.
* **Quy tắc**: `shared` không phụ thuộc vào bất kỳ `feature` cụ thể nào.

### 3. Thư mục `src/app/layout/` (Khung Giao Diện Master)
* **Chức năng**: Chứa các Master Layouts định hình giao diện chung (Header, Navigation Bar, Sidebar, Footer).
* **Các Layout**:
  - `MainLayoutComponent`: Giao diện dành cho người dùng xem sàn đấu giá (Chứa Thanh Header tìm kiếm, Danh mục, Nút đổi tài khoản Test).
  - `SellerLayoutComponent`: Giao diện làm việc chuyên biệt cho Người Bán (Chứa Sidebar menu Quản lý sản phẩm, Quản lý đơn hàng).
  - `AdminLayoutComponent`: Giao diện làm việc cho Admin (Sidebar duyệt sản phẩm).
* **Cơ chế**: Mỗi Layout chứa thẻ `<router-outlet></router-outlet>`. Đây chính là "lỗ hổng" động để Angular chèn nội dung của từng trang (`Page Component`) tương ứng vào khi người dùng điều hướng.

### 4. Thư mục `src/app/features/` (Các Phân Vùng Nghiệp Vụ)
* **Chức năng**: Chứa toàn bộ mã nguồn xử lý màn hình giao diện thực tế và logic nghiệp vụ. Được chia theo đúng Domain miền nghiệp vụ:
  - `auth`: Đăng nhập, đổi quyền test.
  - `public-marketplace`: Sàn đấu giá chung (Home, Product Detail).
  - `bidder-portal`: Khu vực của Bidder (Lịch sử đặt giá, Đơn đã thắng, Checkout).
  - `seller-studio`: Khu vực của Seller (Tạo bài, Sửa bài, Xuất đơn hàng).
  - `admin-moderation`: Khu vực của Admin (Duyệt bài đăng).

---

## PHẦN 4 — KHÁI NIỆM FRONTEND (ANGULAR 18) NGHĨA LÀ GÌ NẾU SO SÁNH VỚI BACKEND?

Khi học Angular 18, Backend Developer chỉ cần ghi nhớ 6 khái niệm cốt lõi sau:

### 1. Standalone Component (Thành phần giao diện độc lập)
* **Backend tương đương**: Một class `@RestController` đi kèm với một template render HTML.
* **Bản chất**: Trong Angular 18, mỗi Component là một class TypeScript độc lập khai báo rõ `standalone: true`, tự khai báo các thư viện mình cần dùng trong mảng `imports: [...]`.

```typescript
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent, CurrencyFormatPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent { ... }
```

### 2. Angular Signal (`signal()`) - Trạng thái phản ứng (State Management)
* **Backend tương đương**: Một biến lưu trữ dữ liệu trong bộ nhớ (In-memory variable). Nhưng điểm khác biệt là khi giá trị của Signal thay đổi, Angular sẽ **tự động phát hiện và render lại đúng vị trí HTML hiển thị biến đó** mà không cần reload trang!
* **Cách khởi tạo & Cập nhật**:
  ```typescript
  // Khai báo signal
  products = signal<ProductResponse[]>([]);

  // Đọc giá trị
  console.log(this.products());

  // Ghi/Cập nhật giá trị
  this.products.set(newData);
  ```

### 3. Service & Dependency Injection (`inject()`)
* **Backend tương đương**: Spring Bean `@Service` được `@Autowired` vào Controller.
* **Cách dùng trong Angular 18**:
  ```typescript
  @Injectable({ providedIn: 'root' })
  export class OrderService {
    private http = inject(HttpClient); // Tương tự @Autowired private HttpClient http;
  }
  ```

### 4. Directives trên Template HTML (`@if`, `@for`)
* **Backend tương đương**: Vòng lặp `for` và câu lệnh `if-else` trong Java / Thymeleaf template.
* **Cú pháp Angular 18**:
  ```html
  @if (loading()) {
    <p>Đang tải dữ liệu...</p>
  } @else {
    @for (item of products(); track item.id) {
      <div>{{ item.productTitle }}</div>
    }
  }
  ```

### 5. `@Input()` và `@Output()` (Giao tiếp giữa các Component)
* **`@Input()`**: Props truyền dữ liệu từ Component CHA xuống Component CON (Tương tự truyền tham số vào Method).
* **`@Output()`**: Component CON bắn Event tín hiệu ngược lên cho Component CHA xử lý (Tương tự Callback Event Listener).

### 6. RxJS Observable vs Promise
* **Observable**: Một dòng chảy dữ liệu (Stream) bất đồng bộ. Khi bạn gọi `http.get()`, Angular trả về một `Observable`. Bạn phải gọi `.subscribe()` hoặc `pipe()` thì HTTP Request mới thực sự được gửi đi (Lazy execution).

---

## PHẦN 5 — PHÂN TÍCH ROUTING (ĐIỀU HƯỚNG VÀ ROUTE GUARDS)

Cấu hình routing hệ thống nằm tại file `src/app/app.routes.ts`:

### 1. Bảng Phân Tích Cấu Hình Route (Route Registry Map)

| URL Path | Master Layout | Feature Route File | Authorization Guard | Ý Nghĩa / Trang Render |
| :--- | :--- | :--- | :--- | :--- |
| `/login` | None | `auth.routes.ts` | Public | Màn hình Đăng nhập (Auto-fill Email từ Đăng ký) |
| `/register` | None | `auth.routes.ts` | Public | Màn hình Đăng ký tài khoản thành viên mới |
| `/` | `MainLayoutComponent` | `public-marketplace.routes.ts` | Public | Trang chủ sàn đấu giá (Hiển thị tất cả sản phẩm) |
| `/product/:id` | `MainLayoutComponent` | `public-marketplace.routes.ts` | Public | Trang chi tiết sản phẩm & Đặt giá tự do |
| `/my-bids` | `MainLayoutComponent` | `bidder-portal.routes.ts` | `authGuard` | Trang lịch sử đấu giá & Đơn thắng cuộc của tôi |
| `/seller/...` | `SellerLayoutComponent` | `seller.routes.ts` | `roleGuard(['USER', 'ADMIN'])` | Quản lý sản phẩm, Tạo bài đăng động, Đơn bán |
| `/admin/...` | `AdminLayoutComponent` | `admin.routes.ts` | `roleGuard(['ADMIN'])` | Trang duyệt bài dành cho Admin |
| `**` (Wildcard) | None | Redirect về `/` | Public | Tự động chuyển hướng nếu gõ sai URL |

---

### 2. Cơ Chế Route Guard Phân Quyền (`role.guard.ts`)

File [role.guard.ts](file:///home/duong/Projects/Frontend/AuctionSystemUI/src/app/core/guards/role.guard.ts) đóng vai trò như một **Spring Security Filter** ở Frontend:

```typescript
export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return () => {
    const userSessionService = inject(UserSessionService);
    const router = inject(Router);
    const toastService = inject(ToastService);

    const currentUser = userSessionService.getCurrentUser();
    
    // Kiểm tra xem User hiện tại có nằm trong danh sách được phép truy cập hay không
    if (currentUser && allowedRoles.includes(currentUser.role)) {
      return true; // Cho phép truy cập route
    }

    toastService.showError('Bạn không có quyền truy cập trang này!');
    router.navigate(['/']);
    return false; // Ngăn chặn truy cập, chuyển hướng về Home
  };
};
```

---

## PHẦN 6 — LUỒNG XỬ LÝ API (API FLOW & HTTP INTERCEPTORS)

### 1. Quản Lý Endpoints tập trung (`api-endpoints.config.ts`)
Tất cả các URL Backend đều được định nghĩa tại file [api-endpoints.config.ts](file:///home/duong/Projects/Frontend/AuctionSystemUI/src/app/core/config/api-endpoints.config.ts):
```typescript
export const API_BASE_URL = 'http://localhost:8080';
export const API_ENDPOINTS = {
  PUBLIC_PRODUCTS: `${API_BASE_URL}/v1/products`,
  SELLER_PRODUCTS: (sellerId: number) => `${API_BASE_URL}/v1/sellers/${sellerId}/products`,
  BIDDING_PLACE_BID: (auctionId: number, bidderId: number) => `${API_BASE_URL}/v1/auctions/${auctionId}/bids?bidderId=${bidderId}`,
  ...
};
```

---

### 2. Bộ Ba HTTP Interceptors (HTTP Middleware)

Trong Angular 18, các Interceptor được đăng ký tại `app.config.ts` và chạy theo đúng thứ tự chuỗi pipeline:

1. **[apiHeaderInterceptor](file:///home/duong/Projects/Frontend/AuctionSystemUI/src/app/core/interceptors/api-header.interceptor.ts)**:
   - **Nhiệm vụ**: Đính kèm Header `x-user-id` và `Authorization` (nếu có token) vào tất cả các Request đi ra ngoài.
   - **Tác dụng**: Giúp Backend Spring Boot nhận biết được ai đang thực hiện request mà không cần gõ thủ công ở từng Service call.

2. **[loadingInterceptor](file:///home/duong/Projects/Frontend/AuctionSystemUI/src/app/core/interceptors/loading.interceptor.ts)**:
   - **Nhiệm vụ**: Tự động bật `LoadingService` (bật spinner) khi request bắt đầu gửi đi, và tự động tắt spinner khi nhận được response hoặc bị lỗi (`finalize`).

3. **[errorInterceptor](file:///home/duong/Projects/Frontend/AuctionSystemUI/src/app/core/interceptors/error.interceptor.ts)**:
   - **Nhiệm vụ**: Bắt lỗi HTTP Status (400, 401, 403, 404, 500) trả về từ Backend. Bóc tách thông điệp lỗi (Error Message) từ JSON Backend và phát hiệu lệnh hiển thị Toast thông báo màu đỏ cho người dùng.
   - **Xử lý Silent Refresh Token (401)**: Khi nhận lỗi 401 Unauthorized do token hết hạn, Interceptor tự động gọi API `POST /v1/auth/refresh` ngầm để lấy Access Token mới và tiếp tục thực hiện lại Request của người dùng mà không bị ngắt quãng phiên làm việc.

---

### 3. Utility Tự Động Biến Đổi Naming (`case-converter.util.ts`)

Backend Spring Boot trả về JSON định dạng `snake_case` (ví dụ: `winning_price`, `start_price`). Frontend Angular sử dụng chuẩn `camelCase` (`winningPrice`, `startPrice`). 

File [case-converter.util.ts](file:///home/duong/Projects/Frontend/AuctionSystemUI/src/app/core/utils/case-converter.util.ts) giải quyết bài toán này triệt để bằng cách **chuyển đổi đệ quy tự động**:
* **`snakeToCamelKeys(response)`**: Gọi khi **nhận Response từ Backend** để convert tất cả key thành `camelCase`.
* **`camelToSnakeKeys(payload)`**: Gọi khi **gửi Payload sang Backend** để convert tất cả key thành `snake_case`.

---

## PHẦN 7 — AUTHENTICATION & AUTHORIZATION

### 1. Cơ Chế Quản Lý Session Tài Khoản (`UserSessionService`)

Dự án hiện tại hỗ trợ cơ chế **Role & User Tester Mode** cực kỳ linh hoạt để phục vụ phát triển và kiểm thử mà không bị phụ thuộc vào tính năng Login phức tạp.

Thông tin tài khoản hiện tại được lưu ở `localStorage` dưới key `active_user_session` và được quản lý bằng Angular Signal:
```typescript
export const TEST_USERS: Record<string, UserSession> = {
  ADMIN: { id: 1, name: 'Admin System', email: 'admin123@gmail.com', role: 'ADMIN' },
  SELLER: { id: 2, name: 'Thanh Trúc', email: 'ttruc00@gmail.com', role: 'USER' },
  BIDDER_DUONG: { id: 3, name: 'T Dương', email: 'TDuong04@gmail.com', role: 'USER' },
  BIDDER_HOANG_MINH: { id: 4, name: 'Hoàng Minh', email: 'hoangminh.auction@gmail.com', role: 'USER' },
  BIDDER_KHANH_LINH: { id: 5, name: 'Khánh Linh', email: 'khanhlinh.bidder@gmail.com', role: 'USER' },
  BIDDER_QUOC_ANH: { id: 6, name: 'Quốc Anh', email: 'quocanh.trader@gmail.com', role: 'USER' }
};
```

* **Thao tác chuyển đổi user**: Người dùng có thể click vào thanh Navigation bar trên Header để chuyển sang bất kỳ User nào (Ví dụ: Từ Bidder Hoàng Minh nhảy sang Seller Thanh Trúc hoặc Admin). Signal `currentUser` sẽ phát tín hiệu thay đổi, toàn bộ giao diện và quyền truy cập route tự động cập nhật ngay lập tức!

---

## PHẦN 8 — STATE MANAGEMENT & GIẢI MÃ SIGNALS

Trong dự án `AuctionSystemUI`, state được phân chia rõ ràng làm 2 cấp độ:

### 1. Local State (Trạng Thái Nội Bộ Component)
Dùng Angular `signal()` trực tiếp trong Component để lưu trữ danh sách sản phẩm, trạng thái đóng mở modal, dữ liệu form nhập liệu.
```typescript
export class WonAuctionsComponent {
  wonAuctions = signal<WonAuctionResponse[]>([]); // Lưu danh sách đơn đấu giá đã thắng
  loading = signal<boolean>(false);               // Lưu trạng thái loading
  selectedOrder = signal<WonAuctionResponse | null>(null); // Lưu đơn đang chọn thanh toán
}
```

### 2. Global State (Trạng Thái Toàn Cục)
Dùng Service có `@Injectable({ providedIn: 'root' })` để chia sẻ dữ liệu giữa các Component khác nhau:
- **`UserSessionService.currentUser`**: Lưu thông tin đăng nhập của User đang hoạt động.
- **`LoadingService.isLoading`**: Lưu trạng thái hiển thị của thanh Spinner toàn ứng dụng.
- **`ToastService`**: Quản lý danh sách các thông báo Toast nổi trên góc màn hình.

---

## PHẦN 9 — CÁC FILE & COMPONENT QUAN TRỌNG NHẤT (CODE WALKTHROUGH)

Dưới đây là chi tiết phân tích 4 Component trọng tâm của dự án:

### 1. Trang Chủ Sàn Đấu Giá ([home.component.ts](file:///home/duong/Projects/Frontend/AuctionSystemUI/src/app/features/public-marketplace/pages/home/home.component.ts))
* **Vai trò**: Màn hình đầu tiên người dùng nhìn thấy. Hiển thị danh sách các bài đấu giá, bộ lọc danh mục, ô tìm kiếm từ khóa, bộ lọc trạng thái (`UPCOMING`, `ACTIVE`, `ENDED`).
* **Input / State**:
  - `products = signal<ProductResponse[]>([])`: Danh sách sản phẩm nguyên bản từ API.
  - `filteredProducts = computed(...)`: Danh sách sản phẩm tự động lọc theo Từ khóa / Danh mục / Trạng thái bằng thuật toán phản ứng `computed()`.
* **API Gọi**: `PublicMarketplaceService.getPublicProducts()`.

---

### 2. Trang Đơn Thắng Cuộc & Thanh Toán ([won-auctions.component.ts](file:///home/duong/Projects/Frontend/AuctionSystemUI/src/app/features/bidder-portal/pages/won-auctions/won-auctions.component.ts))
* **Vai trò**: Dành cho Bidder quản lý các đơn hàng mình đã thắng đấu giá.
* **Nghiệp vụ**:
  - Hiển thị danh sách sản phẩm đã đấu giá thành công kèm thông tin giá thắng (`winningPrice`).
  - Nút **"Thanh toán ngay"**: Mở modal `CheckoutModalComponent` cho phép nhập Địa chỉ giao hàng & Phương thức thanh toán -> Gọi API `OrderService.checkout()`.
  - Nút **"Đã nhận hàng"**: Khi đơn hàng ở trạng thái `SHIPPED` (Đang giao), Bidder bấm nút này để gọi API `OrderService.confirmReceived()` hoàn tất giao dịch.

---

### 3. Trang Quản Lý Đơn Bán Của Seller ([seller-orders.component.ts](file:///home/duong/Projects/Frontend/AuctionSystemUI/src/app/features/seller-studio/pages/seller-orders/seller-orders.component.ts))
* **Vai trò**: Dành cho Seller theo dõi danh sách các đơn hàng mà khách đã mua/thắng đấu giá.
* **Nghiệp vụ**:
  - Lọc đơn hàng theo Tab trạng thái: Tất cả, Chờ thanh toán (`PENDING_PAYMENT`), Đang xử lý (`PROCESSING`), Đang giao (`SHIPPED`), Đã giao (`DELIVERED`).
  - Nút **"Xuất hàng / Giao hàng"**: Mở modal `ShipModalComponent` cho phép Seller nhập **Mã vận đơn (Shipping Tracking Code)** và đơn vị vận chuyển -> Gọi API `OrderService.shipOrder()`.

---

### 4. Modal Điền Địa Chỉ & Checkout ([checkout-modal.component.ts](file:///home/duong/Projects/Frontend/AuctionSystemUI/src/app/features/bidder-portal/components/checkout-modal/checkout-modal.component.ts))
* **Vai trò**: Component Dialog Popup nhập thông tin giao hàng.
* **Sử dụng Form**: `ReactiveFormsModule` khai báo các ô nhập: `shippingAddress`, `phoneNumber`, `recipientName`, `paymentMethod`.
* **Validation**: Kiểm tra không được để trống, kiểm tra định dạng Số điện thoại chuẩn Việt Nam (`Validators.pattern(/^(0|\+84)[0-9]{9}$/)`).

---

## PHẦN 10 — TRACE THE CODE: HƯỚNG DẪN LUỒNG CHẠY NHAU THEO CÁC NGHIỆP VỤ THỰC TẾ

Hãy cùng trace chi tiết 2 luồng nghiệp vụ quan trọng nhất từ lúc User Click nút cho đến khi dữ liệu biến đổi trên màn hình:

### 🏆 LUỒNG 1: BIDDER THẮNG ĐẤU GIÁ VÀ TIẾN HÀNH THANH TOÁN (CHECKOUT)

```text
[1. User Click nút "Thanh toán ngay" tại WonAuctionsComponent]
               │
               ▼
[2. openCheckoutModal(order)] 
   -> Gán selectedOrder.set(order) 
   -> Bật cờ isCheckoutModalOpen.set(true)
               │
               ▼
[3. CheckoutModalComponent hiển thị trên giao diện (Dialog)]
   -> User nhập: Địa chỉ, Số điện thoại, Chọn phương thức "COD"
   -> Click nút "Xác nhận thanh toán"
               │
               ▼
[4. onSubmit() trong CheckoutModalComponent]
   -> Kiểm tra checkoutForm.valid === true
   -> Bắn Event @Output() submitCheckout.emit(formData) lên Component Cha
               │
               ▼
[5. handleCheckoutSubmit(payload) trong WonAuctionsComponent]
   -> Gọi OrderService.checkout(bidderId, orderId, payload)
               │
               ▼
[6. OrderService.checkout()]
   -> Convert payload từ camelCase sang snake_case qua camelToSnakeKeys()
   -> Gọi HttpClient.post('/v1/bidders/3/orders/10/checkout', payload)
               │
               ▼
[7. apiHeaderInterceptor]
   -> Đính kèm Header 'x-user-id': '3'
               │
               ▼
[8. Backend Spring Boot xử lý -> Trả về HTTP 200 JSON]
               │
               ▼
[9. Pipe snakeToCamelKeys()]
   -> Tự động convert JSON response trả về dạng camelCase
               │
               ▼
[10. WonAuctionsComponent nhận Response thành công trong .subscribe()]
   -> Đóng Modal: isCheckoutModalOpen.set(false)
   -> Phát Toast: toastService.showSuccess('Thanh toán thành công!')
   -> Cập nhật lại danh sách: loadWonAuctions() -> UI tự làm mới hiển thị trạng thái "PROCESSING"
```

---

### 📦 LUỒNG 2: SELLER XUẤT HÀNG / GIAO HÀNG (SHIP ORDER)

```text
[1. Seller mở trang SellerOrdersComponent]
   -> Chọn Tab "Đang xử lý (PROCESSING)"
   -> Thấy đơn hàng vừa được Bidder thanh toán. Click nút "Giao hàng"]
               │
               ▼
[2. openShipModal(order)]
   -> Gán selectedOrder.set(order)
   -> Bật isShipModalOpen.set(true)
               │
               ▼
[3. ShipModalComponent mở ra]
   -> Seller nhập Mã vận đơn: "VN12345678" & Chọn Đơn vị: "Giao Hàng Nhanh"
   -> Click "Xác nhận xuất hàng"
               │
               ▼
[4. ShipModalComponent bắn Event submitShip.emit(request) lên SellerOrdersComponent]
               │
               ▼
[5. SellerOrdersComponent gọi OrderService.shipOrder(sellerId, orderId, request)]
               │
               ▼
[6. HTTP PUT /v1/sellers/2/orders/10/ship sang Backend]
               │
               ▼
[7. Nhận HTTP 200 -> Cập nhật trạng thái đơn hàng sang "SHIPPED"]
   -> Toast thông báo "Đã cập nhật mã vận đơn thành công!"
   -> Đơn hàng tự động chuyển từ Tab "Đang xử lý" sang Tab "Đang giao"
```

---

## PHẦN 11 — QUẢN LÝ FORM, VALIDATION, LOADING & ERROR HANDLING

### 1. Xử lý Reactive Form trong Angular
Tất cả các form nhập liệu phức tạp (như Form tạo sản phẩm, Form Checkout, Form Giao hàng) đều sử dụng **Reactive Forms** của Angular.

* **Cách khai báo**:
  ```typescript
  checkoutForm = new FormGroup({
    recipientName: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^(0|\+84)[0-9]{9}$/)]),
    shippingAddress: new FormControl('', [Validators.required, Validators.minLength(10)]),
    paymentMethod: new FormControl('COD', [Validators.required])
  });
  ```
* **Hiển thị lỗi Validation trên Template**:
  ```html
  @if (checkoutForm.get('phoneNumber')?.invalid && checkoutForm.get('phoneNumber')?.touched) {
    <small class="p-error">Số điện thoại không hợp lệ (phải đủ 10 số)</small>
  }
  ```

---

### 2. Cơ Chế Bắt Lỗi & Hiển Thị Thông Báo (Error & Toast System)

Khi Backend trả về lỗi (ví dụ HTTP 400 Bad Request do giá đặt thấp hơn giá hiện tại):
1. `errorInterceptor` ngăn chặn ứng dụng bị crash.
2. Bóc tách chuỗi thông điệp từ `error.error.message` (hoặc `error.message`).
3. Gọi `toastService.showError(message)`.
4. `ToastContainerComponent` trên góc phải màn hình lập tức nổi thông báo màu đỏ hiển thị chính xác lý do lỗi từ Backend cho người dùng.

---

## PHẦN 12 — TỔ CHỨC STYLING & DEPENDENCY MANAGEMENT

### 1. Quản lý Styling (SCSS + PrimeFlex)
* **Global Style**: Khai báo tại `src/styles.scss`, import các theme màu chuẩn của PrimeNG (`primeng/resources/themes/lara-light-blue/theme.css`).
* **Component Style**: Mỗi Component có file `.scss` riêng biệt (như `home.component.scss`). SCSS này có phạm vi đóng gói **Emulated View Encapsulation** (nghĩa là style của Component nào chỉ có hiệu lực bên trong Component đó, không bị lem ra ngoài!).

### 2. Danh Sách Dependencies Quan Trọng (`package.json`)

| Package Name | Loại | Mục Đích Sử Dụng |
| :--- | :--- | :--- |
| `@angular/core` | Core | Framework Angular chính (Version 18) |
| `@angular/router` | Library | Bộ điều hướng URL & Routing |
| `@angular/forms` | Library | Quản lý Reactive Form & Form Control Validation |
| `primeng` | UI Lib | Cung cấp bảng dữ liệu, Dialog modal, Button, Input UI |
| `primeicons` | Icons | Bộ icon đồ họa (Ví dụ: `pi pi-check`, `pi pi-truck`) |
| `rxjs` | Async | Thư viện xử lý HTTP Request dòng chảy bất đồng bộ |

---

## PHẦN 13 — CÁC DESIGN PATTERNS ĐANG ĐƯỢC ÁP DỤNG

1. **Singleton Service Pattern**: Tất cả Service trong `core` và `features` đều khai báo `@Injectable({ providedIn: 'root' })`, đảm bảo chỉ có duy nhất 1 instance chạy trong suốt chu kỳ ứng dụng.
2. **Adapter / Data Converter Pattern**: Sử dụng `case-converter.util.ts` làm lớp đệm chuyển đổi định dạng tên thuộc tính JSON giữa Backend (`snake_case`) và Frontend (`camelCase`).
3. **Chain of Responsibility Pattern**: Chuỗi 3 HTTP Interceptors (`apiHeaderInterceptor` -> `errorInterceptor` -> `loadingInterceptor`) xử lý Request/Response nối tiếp nhau.
4. **Observer / Reactive Pattern**: Sử dụng Angular Signals và RxJS Observables để giao diện tự động cập nhật phản ứng mỗi khi dữ liệu thay đổi.
5. **Container / Presentational Component Pattern**: Phân chia rõ ràng giữa Component trang chính (chứa logic gọi API) và Component giao diện thuần túy (chỉ nhận `@Input` để vẽ giao diện và phát `@Output`).

---

## PHẦN 14 — HƯỚNG DẪN TỰ SỬA CODE / THÊM TÍNH NĂNG MỚI (CHECKLIST)

Khi một Backend Developer cần **thêm một tính năng mới** hoặc **sửa một chức năng có sẵn**, hãy làm theo đúng quy trình 6 bước sau:

### 📝 Checklist 6 Bước Chỉnh Sửa / Thêm Mới Feature:

- [ ] **Bước 1 — Cập nhật Model / Interface**: 
  - Thêm / Sửa Interface trong `src/app/shared/models/` (Ví dụ: [product.model.ts](file:///home/duong/Projects/Frontend/AuctionSystemUI/src/app/shared/models/product.model.ts) hoặc [order.model.ts](file:///home/duong/Projects/Frontend/AuctionSystemUI/src/app/shared/models/order.model.ts)).
- [ ] **Bước 2 — Khai báo API Endpoint**:
  - Mở [api-endpoints.config.ts](file:///home/duong/Projects/Frontend/AuctionSystemUI/src/app/core/config/api-endpoints.config.ts) và thêm URL endpoint mới.
- [ ] **Bước 3 — Thêm Method vào Service**:
  - Mở Service tương ứng (Ví dụ: [order.service.ts](file:///home/duong/Projects/Frontend/AuctionSystemUI/src/app/core/services/order.service.ts) hoặc `seller-api.service.ts`).
  - Viết method gọi `this.http.get/post/put()` nhớ dùng `.pipe(map(res => snakeToCamelKeys(res)))`.
- [ ] **Bước 4 — Viết Logic trên Component (.ts)**:
  - Mở Component tương ứng trong `features/.../pages/`.
  - Tạo Signal lưu dữ liệu và hàm xử lý (Event handler) gọi tới Method Service vừa tạo ở Bước 3.
- [ ] **Bước 5 — Cập nhật Template HTML (.html)**:
  - Mở file `.html` tương ứng, dùng cú pháp `@if`, `@for`, hoặc gắn sự kiện click `(click)="myFunction()"`.
- [ ] **Bước 6 — Kiểm tra Phân Quyền & Route**:
  - Nếu tạo trang mới hoàn toàn, khai báo Path mới vào file `.routes.ts` của Feature đó và cấu hình `roleGuard` nếu cần.

---

## PHẦN 15 — ROADMAP HỌC FRONTEND CHO BACKEND DEVELOPER

Dưới đây là lộ trình 6 cấp độ giúp Backend Developer làm chủ hoàn toàn codebase này trong vòng 1-2 tuần:

```text
 [ LEVEL 1: Cấu tạo Component & HTML Template ]
   - Học cách đọc file .component.ts và .component.html
   - Nắm được cú pháp @if, @for, và bắt sự kiện (click), (submit)
                       │
                       ▼
 [ LEVEL 2: Angular Signals & State ]
   - Hiểu cách dùng signal(), set(), và computed() để lưu dữ liệu màn hình
                       │
                       ▼
 [ LEVEL 3: TypeScript Interfaces & Models ]
   - Đọc hiểu các file model.ts trong shared/models/ để biết cấu trúc dữ liệu
                       │
                       ▼
 [ LEVEL 4: Angular Services & HttpClient Call ]
   - Xem các file Service để biết cách Frontend gọi API và pipe(snakeToCamelKeys)
                       │
                       ▼
 [ LEVEL 5: Reactive Forms & Validation ]
   - Đọc các Component có form (như checkout-modal) để biết cách validate số điện thoại, địa chỉ
                       │
                       ▼
 [ LEVEL 6: Trace Luồng Đấu Giá & Đơn Hàng End-to-End ]
   - Thực hành trace luồng từ Nút bấm trên UI -> Component -> Service -> Interceptor -> Backend API
```

---

## PHẦN 16 — PHÂN TÍCH TỪNG FILE / CLASS / COMPONENT CHI TIẾT 100%

Dưới đây là bảng phân tích toàn bộ **54 file TypeScript** trong codebase, liệt kê đầy đủ vai trò, quan hệ phụ thuộc, input/output, state, API và các function.

---

### A. TẬP TỆP KHỞI TẠO NỀN TẢNG (ENTRY & BOOTSTRAP)

#### 1. `src/main.ts`
* **Vai trò**: Entrypoint chính của ứng dụng Single Page Application.
* **Được sử dụng bởi**: Angular Builder (`angular.json`).
* **Sử dụng**: `bootstrapApplication`, `AppComponent`, `appConfig`.
* **Luồng hoạt động**: Khởi chạy ứng dụng Angular 18 dưới dạng Standalone Application với file cấu hình `appConfig`.

#### 2. `src/app/app.config.ts`
* **Vai trò**: Cấu hình Dependency Injection (DI) toàn cục.
* **Sử dụng**: `provideZoneChangeDetection`, `provideRouter`, `provideHttpClient`, `withInterceptors`.
* **Cấu hình quan trọng**: 
  - `provideRouter(routes, withComponentInputBinding(), withViewTransitions())`: Kích hoạt tự động bind URL params vào Component `@Input()` và hiệu ứng chuyển trang mượt.
  - `provideHttpClient(withInterceptors([apiHeaderInterceptor, errorInterceptor, loadingInterceptor]))`: Đăng ký chuỗi 3 interceptor xử lý HTTP.

#### 3. `src/app/app.routes.ts`
* **Vai trò**: Bảng định tuyến gốc (Root Router Configuration).
* **Đường dẫn**:
  - `/auth` ➔ `AUTH_ROUTES`
  - `/` (Layout: `MainLayoutComponent`) ➔ `PUBLIC_MARKETPLACE_ROUTES` & `BIDDER_PORTAL_ROUTES`
  - `/seller` (Layout: `SellerLayoutComponent`, Guard: `roleGuard(['USER', 'ADMIN'])`) ➔ `SELLER_ROUTES`
  - `/admin` (Layout: `AdminLayoutComponent`, Guard: `roleGuard(['ADMIN'])`) ➔ `ADMIN_ROUTES`

#### 4. `src/app/app.component.ts`
* **Vai trò**: Root Component cao nhất chứa `<router-outlet></router-outlet>`.
* **Template**: Render thẻ `<router-outlet />` chính.

---

### B. THƯ MỤC CORE — AUTHENTICATION & USER SESSION

#### 5. `src/app/core/auth/user-session.service.ts`
* **Class**: `UserSessionService` (`@Injectable({ providedIn: 'root' })`)
* **Vai trò**: State Management toàn cục lưu trữ thông tin tài khoản người dùng đang hoạt động.
* **State**: `currentUser = signal<UserSession>(loadInitialSession())`.
* **Hằng số**: `TEST_USERS`: Chứa 6 tài khoản mẫu (`ADMIN`, `SELLER Thanh Trúc`, 4 Bidders `Hoàng Minh`, `Khánh Linh`, `Quốc Anh`, `T Dương`).
* **Functions**:
  1. `setSession(session)`: Lưu session vào `localStorage` và phát signal `currentUser.set()`.
  2. `switchToRole(role)`: Chuyển nhanh giữa Role ADMIN và USER.
  3. `switchToUser(user)`: Chuyển sang bất kỳ user nào trong `TEST_USERS`.
  4. `hasRole(role)`: Kiểm tra user hiện tại có role mong muốn hay không.

#### 6. `src/app/core/auth/auth.service.ts`
* **Class**: `AuthService`
* **Vai trò**: Quản lý giả lập login/logout.
* **Functions**: `login()`, `logout()`, `isLoggedIn()`.

#### 7. `src/app/core/auth/token.service.ts`
* **Class**: `TokenService`
* **Vai trò**: Thao tác đọc/ghi JWT Token từ `localStorage`.

#### 8. `src/app/core/auth/permission.service.ts`
* **Class**: `PermissionService`
* **Vai trò**: Kiểm tra quyền chi tiết của User.

---

### C. THƯ MỤC CORE — GUARDS, INTERCEPTORS & CONFIG

#### 9. `src/app/core/config/api-endpoints.config.ts`
* **Hằng số**: `API_BASE_URL` (`http://localhost:8080`), `API_ENDPOINTS` (Tập hợp toàn bộ hàm tạo URL API).

#### 10. `src/app/core/guards/role.guard.ts`
* **Function**: `roleGuard(allowedRoles: UserRole[]): CanActivateFn`
* **Vai trò**: Kiểm tra `UserSessionService.getCurrentUser().role`. Nếu hợp lệ trả về `true`, nếu không trả về `false`, hiển thị Toast lỗi và redirect về `/`.

#### 11. `src/app/core/guards/auth.guard.ts`
* **Function**: `authGuard(): CanActivateFn`
* **Vai trò**: Kiểm tra user đã đăng nhập chưa.

#### 12. `src/app/core/interceptors/api-header.interceptor.ts`
* **Function**: `apiHeaderInterceptor(req, next)`
* **Vai trò**: Đính kèm Header `x-user-id` (lấy từ `UserSessionService.currentUser().id`) và Header `Accept-Language` vào mọi HTTP Request.

#### 13. `src/app/core/interceptors/error.interceptor.ts`
* **Function**: `errorInterceptor(req, next)`
* **Vai trò**: Catch lỗi HTTP Response `HttpErrorResponse`. Đọc thông điệp lỗi và gọi `ToastService.showError()`.

#### 14. `src/app/core/interceptors/loading.interceptor.ts`
* **Function**: `loadingInterceptor(req, next)`
* **Vai trò**: Bật `LoadingService.show()` khi request đi, và gọi `.pipe(finalize(() => loadingService.hide()))` khi xong.

---

### D. THƯ MỤC CORE — SERVICES & UTILS

#### 15. `src/app/core/services/order.service.ts`
* **Class**: `OrderService`
* **Vai trò**: Gọi API quản lý đơn hàng & hậu đấu giá.
* **Functions**:
  1. `getWonAuctions(bidderId)`: GET `/v1/bidders/{id}/won-auctions` ➔ Map `snakeToCamelKeys`.
  2. `checkout(bidderId, orderId, request)`: POST `/v1/bidders/{id}/orders/{orderId}/checkout` với payload `camelToSnakeKeys`.
  3. `confirmReceived(bidderId, orderId)`: PUT `/v1/bidders/{id}/orders/{orderId}/confirm-received`.
  4. `getSellerOrders(sellerId, status)`: GET `/v1/sellers/{id}/orders?status=...`.
  5. `shipOrder(sellerId, orderId, request)`: PUT `/v1/sellers/{id}/orders/{orderId}/ship`.

#### 16. `src/app/core/services/toast.service.ts`
* **Class**: `ToastService`
* **State**: `toasts = signal<ToastMessage[]>([])`.
* **Functions**: `showSuccess()`, `showError()`, `showInfo()`, `removeToast()`.

#### 17. `src/app/core/services/loading.service.ts`
* **Class**: `LoadingService`
* **State**: `isLoading = signal<boolean>(false)`.

#### 18. `src/app/core/services/language.service.ts`
* **Class**: `LanguageService`
* **State**: `currentLang = signal<LanguageCode>('vi')`.
* **Functions**: `setLanguage(lang)`, `translate(key)` (Hỗ trợ đa ngôn ngữ i18n VN/EN).

#### 19. `src/app/core/services/category.service.ts`
* **Class**: `CategoryService`
* **API**: `getCategories()` ➔ GET `/v1/categories`.

#### 20. `src/app/core/utils/case-converter.util.ts`
* **Functions**: `snakeToCamelKeys(obj)`, `camelToSnakeKeys(obj)` (Chuyển đổi đệ quy key JSON).

---

### E. THƯ MỤC LAYOUTS (MASTER LAYOUTS)

#### 21. `src/app/layout/main-layout/main-layout.component.ts`
* **Component**: `MainLayoutComponent`
* **Vai trò**: Top Header Bar + Search/Category Nav + Tester User Dropdown + i18n Toggle + `<router-outlet />`.
* **Method**: `onUserSelectChange(event)` ➔ Chuyển đổi tài khoản test và tự động điều hướng nếu là ADMIN.

#### 22. `src/app/layout/seller-layout/seller-layout.component.ts`
* **Component**: `SellerLayoutComponent`
* **Vai trò**: Sidebar menu chuyên biệt Seller (Danh sách SP, Đơn đã bán, Tạo bài mới) + Profile Seller + `<router-outlet />`.

#### 23. `src/app/layout/admin-layout/admin-layout.component.ts`
* **Component**: `AdminLayoutComponent`
* **Vai trò**: Sidebar menu Admin (Duyệt bài đăng) + Profile Admin + `<router-outlet />`.

---

### F. THƯ MỤC SHARED — COMPONENTS, MODELS & PIPES

#### 24. `src/app/shared/models/product.model.ts`
* **Interfaces**: `ProductResponse`, `ProductCreateRequest`, `ProductRejectRequest`.

#### 25. `src/app/shared/models/order.model.ts`
* **Interfaces**: `WonAuctionResponse`, `SellerOrderResponse`, `CheckoutRequest`, `CheckoutResponse`, `ShipOrderRequest`.

#### 26. `src/app/shared/models/bid.model.ts`
* **Interfaces**: `BidRequest`, `BidResponse`, `BidHistoryResponse`.

#### 27. `src/app/shared/models/enums.model.ts`
* **Enums/Types**: `AuctionStatus`, `OrderStatus`, `UserRole`, `UserSession`.

#### 28. `src/app/shared/components/status-badge/status-badge.component.ts`
* **Component**: `StatusBadgeComponent`
* **Input**: `@Input({ required: true }) status!: AuctionStatus | OrderStatus | string`.
* **Vai trò**: Hiển thị Badge màu sắc động theo đúng trạng thái sản phẩm hoặc đơn hàng.

#### 29. `src/app/shared/components/toast-container/toast-container.component.ts`
* **Component**: `ToastContainerComponent`
* **Vai trò**: Lắng nghe `ToastService.toasts()` và render các hộp popup thông báo ở góc màn hình.

#### 30. `src/app/shared/components/product-detail-modal/product-detail-modal.component.ts`
* **Component**: `ProductDetailModalComponent`
* **Input/Output**: `@Input() product`, `@Input() isOpen`, `@Output() close`.

#### 31. `src/app/shared/pipes/currency-format.pipe.ts`
* **Pipe**: `CurrencyFormatPipe` (`transform(value: number)`) ➔ Định dạng số tiền sang `1.000.000 ₫`.

#### 32. `src/app/shared/pipes/time-remaining.pipe.ts`
* **Pipe**: `TimeRemainingPipe` (`transform(endTime: string)`) ➔ Tính số giờ/phút còn lại của phiên đấu giá.

#### 33. `src/app/shared/pipes/auction-status-badge.pipe.ts`
* **Pipe**: `AuctionStatusBadgePipe` ➔ Format nhãn hiển thị trạng thái tiếng Việt.

---

### G. FEATURES — PUBLIC MARKETPLACE

#### 34. `src/app/features/public-marketplace/public-marketplace.routes.ts`
* **Routes**: `/` (HomeComponent), `/product/:id` (ProductDetailComponent).

#### 35. `src/app/features/public-marketplace/services/public-marketplace.service.ts`
* **Class**: `PublicMarketplaceService`
* **Functions**: `getPublicProducts()`, `getProductById(id)`.

#### 36. `src/app/features/public-marketplace/pages/home/home.component.ts`
* **Component**: `HomeComponent`
* **State**: `products = signal([])`, `searchQuery = signal('')`, `selectedCategory = signal('')`, `selectedStatus = signal('')`.
* **Computed**: `filteredProducts = computed(...)` ➔ Tự động lọc sản phẩm phản ứng khi ô tìm kiếm hoặc dropdown thay đổi.

#### 37. `src/app/features/public-marketplace/pages/product-detail/product-detail.component.ts`
* **Component**: `ProductDetailComponent`
* **Input**: `@Input() id!: string` (Nhận từ URL `/product/:id`).
* **State**: `product = signal<ProductResponse | null>(null)`, `bidHistory = signal<BidHistoryResponse[]>([])`, `isUserEditingBid: boolean`.
* **Nghiệp vụ nổi bật**:
  - Polling Realtime `1500ms` kéo giá mới liên tục.
  - Cờ `isUserEditingBid` bảo vệ ô gõ phím không bị đợt Polling ngầm ghi đè khi người dùng đang gõ giá đặt tự do (`4.000.000.000 đ`, `5.000.000.000 đ`).
  - Hàm `effectiveCurrentPrice()` tính giá cao nhất chính xác giữa `currentPrice` và lịch sử đấu giá `highestBid`.
* **Functions**: `handleBidAction()`, `submitBid()`, `submitBuyNow()`, `fetchBidHistory()`.

---

### H. FEATURES — BIDDER PORTAL

#### 38. `src/app/features/bidder-portal/bidder-portal.routes.ts`
* **Routes**: `/my-bids` (WonAuctionsComponent & MyBidsComponent).

#### 39. `src/app/features/bidder-portal/services/bidding.service.ts`
* **Class**: `BiddingService`
* **Functions**: `placeBid(auctionId, bidderId, req)`, `buyNow(auctionId, bidderId)`, `getBidHistory(auctionId)`.

#### 40. `src/app/features/bidder-portal/components/checkout-modal/checkout-modal.component.ts`
* **Component**: `CheckoutModalComponent`
* **Input/Output**: `@Input() isOpen`, `@Input() order`, `@Output() close`, `@Output() submitCheckout`.
* **Form**: `checkoutForm` (ReactiveForm có `recipientName`, `phoneNumber`, `shippingAddress`, `paymentMethod`).

#### 41. `src/app/features/bidder-portal/pages/won-auctions/won-auctions.component.ts`
* **Component**: `WonAuctionsComponent`
* **State**: `wonAuctions = signal<WonAuctionResponse[]>([])`, `selectedOrder = signal(...)`.
* **Functions**: `openCheckoutModal(order)`, `handleCheckoutSubmit(payload)`, `confirmReceived(order)`.

#### 42. `src/app/features/bidder-portal/pages/my-bids/my-bids.component.ts`
* **Component**: `MyBidsComponent`
* **Vai trò**: Quản lý lịch sử các bài ra giá của Bidder.

---

### I. FEATURES — SELLER STUDIO

#### 43. `src/app/features/seller-studio/seller.routes.ts`
* **Routes**: `/seller` (ProductListComponent), `/seller/create` (CreateProductComponent), `/seller/edit/:id` (EditProductComponent), `/seller/orders` (SellerOrdersComponent).

#### 44. `src/app/features/seller-studio/services/seller-api.service.ts`
* **Class**: `SellerApiService`
* **Functions**: `getSellerProducts(sellerId)`, `createProduct(sellerId, formData)`, `updateProduct(sellerId, id, formData)`, `deleteProduct(sellerId, id)`, `cancelAuction(sellerId, id)`, `relistAuction(sellerId, auctionId)`.

#### 45. `src/app/features/seller-studio/components/ship-modal/ship-modal.component.ts`
* **Component**: `ShipModalComponent`
* **Input/Output**: `@Input() isOpen`, `@Input() order`, `@Output() close`, `@Output() submitShip`.
* **Form**: `shipForm` (`trackingNumber`, `shippingCarrier`).

#### 46. `src/app/features/seller-studio/pages/seller-orders/seller-orders.component.ts`
* **Component**: `SellerOrdersComponent`
* **State**: `orders = signal<SellerOrderResponse[]>([])`, `selectedTab = signal<OrderStatus | 'ALL'>('ALL')`.
* **Functions**: `openShipModal(order)`, `handleShipSubmit(payload)`.

#### 47. `src/app/features/seller-studio/pages/product-list/product-list.component.ts`
* **Component**: `ProductListComponent`
* **Functions**: `cancelAuction(id)`, `relistAuction(id)`, `deleteProduct(id)`.

#### 48. `src/app/features/seller-studio/pages/create-product/create-product.component.ts`
* **Component**: `CreateProductComponent`
* **Form & Cấu hình Động**:
  - Tự động ẩn/hiện trường theo `auctionType`:
    - `ENGLISH`: Hiện **Giá khởi điểm** & **Bước giá**. Ẩn Giá mua ngay & Giá bảo lưu (giá ẩn).
    - `RESERVE`: Hiện **Giá khởi điểm**, **Bước giá**, **Giá Bảo Lưu** (Bắt buộc $\ge$ Giá khởi điểm). Ẩn Giá mua ngay.
    - `BUY_NOW`: Hiện **Giá Mua Ngay Niêm Yết** (Bắt buộc). Ẩn Bước giá & Giá bảo lưu. Tự đồng bộ `startPrice = buyNowPrice`.
  - Hỗ trợ tải lên danh sách ảnh sản phẩm (1 - 20 ảnh).

#### 49. `src/app/features/seller-studio/pages/edit-product/edit-product.component.ts`
* **Component**: `EditProductComponent`
* **Input**: `@Input() id!: string` (Lấy ID sản phẩm từ URL).
* **Nghiệp vụ**:
  - Áp dụng Cấu hình Form Đấu giá Động theo `auctionType` tương tự trang Tạo mới.
  - Quản lý danh sách hình ảnh: Hỗ trợ chọn xóa ảnh cũ (`deletedImageIds`) và bổ sung ảnh mới (`newImages`).

---

### J. FEATURES — ADMIN MODERATION & AUTH

#### 50. `src/app/features/admin-moderation/admin.routes.ts`
* **Routes (Guard: `roleGuard(['ADMIN'])`)**:
  - `/admin`: `PendingApprovalComponent` (Kiểm duyệt bài đăng)
  - `/admin/finance`: `FinancialDashboardComponent` (Két Escrow Sàn & Dòng tiền)
  - `/admin/categories`: `CategoryManagementComponent` (Quản lý danh mục)
  - `/admin/users`: `UserManagementComponent` (Quản lý người dùng)

#### 51. `src/app/features/admin-moderation/services/admin-api.service.ts` & `OrderService.java`
* **Class**: `AdminApiService` & `OrderService`
* **Functions**: `getPendingProducts()`, `approveProduct(id)`, `rejectProduct(id, rejectDTO)`, `getAllCategories()`, `createCategory(request)`, `updateCategory(id, request)`, `deleteCategory(id)`, `getAllUsers()`, `updateUserStatus(id, request)`, `getAdminOrders(status)`.

#### 52. `src/app/features/admin-moderation/pages/pending-approval/pending-approval.component.ts`
* **Component**: `PendingApprovalComponent`
* **Functions**: `approve(id)`, `openRejectModal(id)`, `confirmReject()`.

#### 52b. `src/app/features/admin-moderation/pages/financial-dashboard/financial-dashboard.component.ts`
* **Component**: `FinancialDashboardComponent`
* **Vai trò**: Quản lý Két Escrow Sàn đấu giá, theo dõi dòng tiền giữ hộ, giải ngân cho Seller và lịch sử đơn hàng theo múi giờ UTC+7.

#### 52c. `src/app/core/services/wallet.service.ts` & `WalletComponent`
* **Class & Component**: `WalletService` & `WalletComponent` (`/wallet`)
* **Functions**: `getWallet()`, `deposit()`, `withdraw()`, `getTransactions()`. Dành cho người dùng nạp, rút tiền ảo và xem nhật ký giao dịch.

#### 53. `src/app/features/auth/auth.routes.ts`
* **Routes**: `/login` (LoginComponent), `/register` (RegisterComponent).

#### 54. `src/app/features/auth/pages/login/login.component.ts`
* **Component**: `LoginComponent`
* **Vai trò**: Màn hình đăng nhập tài khoản chính thức bằng JWT. Tự động kiểm tra `registeredEmail` từ queryParam (chuyển sang từ trang Đăng ký) và patchValue tự điền sẵn Email.

#### 55. `src/app/features/auth/pages/register/register.component.ts`
* **Component**: `RegisterComponent`
* **Vai trò**: Màn hình Đăng ký tài khoản thành viên mới (Validate username, email, password & confirmPassword). Khi đăng ký thành công, hiển thị Toast và tự động chuyển sang `/login?registeredEmail=...`.

---

> 💡 **Mẹo dành cho Backend Developer**: Mỗi khi gặp sự cố giao diện không chạy như ý, hãy ấn `F12` trên trình duyệt Chrome, chuyển sang Tab **Console** (xem log lỗi TypeScript) và Tab **Network** (xem Request URL, Header `x-user-id` và Response JSON trả về). Hầu hết 90% nguyên nhân sẽ được phát hiện ngay tại tab Network này!
