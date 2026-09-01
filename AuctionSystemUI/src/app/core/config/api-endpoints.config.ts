export const API_BASE_URL = 'http://localhost:8080';

export const API_ENDPOINTS = {
  // Auth Endpoints
  AUTH_REGISTER: `${API_BASE_URL}/v1/auth/register`,
  AUTH_LOGIN: `${API_BASE_URL}/v1/auth/login`,
  AUTH_REFRESH: `${API_BASE_URL}/v1/auth/refresh`,
  AUTH_LOGOUT: `${API_BASE_URL}/v1/auth/logout`,

  // Public Marketplace Endpoints
  PUBLIC_PRODUCTS: `${API_BASE_URL}/v1/products`,
  PUBLIC_PRODUCT_DETAIL: (id: number) => `${API_BASE_URL}/v1/products/${id}`,

  // Seller Studio Endpoints (Chuẩn /v1/sellers/me/...)
  SELLER_PRODUCTS: `${API_BASE_URL}/v1/sellers/me/products`,
  SELLER_PRODUCT_BY_ID: (id: number) => `${API_BASE_URL}/v1/sellers/me/products/${id}`,
  SELLER_CANCEL_AUCTION: (id: number) => `${API_BASE_URL}/v1/sellers/me/products/${id}/cancel`,
  SELLER_RELIST_AUCTION: (auctionId: number) => `${API_BASE_URL}/v1/sellers/me/products/${auctionId}/relist`,

  // Admin Moderation & Management Endpoints
  ADMIN_PENDING_PRODUCTS: `${API_BASE_URL}/v1/admin/products/pending`,
  ADMIN_APPROVE_PRODUCT: (id: number) => `${API_BASE_URL}/v1/admin/products/${id}/approve`,
  ADMIN_REJECT_PRODUCT: (id: number) => `${API_BASE_URL}/v1/admin/products/${id}/reject`,

  // Admin Category Management Endpoints
  ADMIN_CATEGORIES: `${API_BASE_URL}/v1/admin/products/categories`,
  ADMIN_CATEGORY_BY_ID: (id: number) => `${API_BASE_URL}/v1/admin/products/categories/${id}`,

  // Admin User Management Endpoints
  ADMIN_USERS: `${API_BASE_URL}/v1/admin/products/users`,
  ADMIN_USER_STATUS: (id: number) => `${API_BASE_URL}/v1/admin/products/users/${id}/status`,

  // Categories
  CATEGORIES: `${API_BASE_URL}/v1/categories`,

  // Bidding Engine Endpoints
  BIDDING_PLACE_BID: (auctionId: number, bidderId: number) => `${API_BASE_URL}/v1/auctions/${auctionId}/bids?bidderId=${bidderId}`,
  BIDDING_BUY_NOW: (auctionId: number, bidderId: number) => `${API_BASE_URL}/v1/auctions/${auctionId}/bids/buy-now?bidderId=${bidderId}`,
  BIDDING_HISTORY: (auctionId: number) => `${API_BASE_URL}/v1/auctions/${auctionId}/bids`,
};
