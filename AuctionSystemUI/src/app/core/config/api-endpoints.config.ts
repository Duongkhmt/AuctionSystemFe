export const API_BASE_URL = 'http://localhost:8080';

export const API_ENDPOINTS = {
  PUBLIC_PRODUCTS: `${API_BASE_URL}/v1/products`,
  PUBLIC_PRODUCT_DETAIL: (id: number) => `${API_BASE_URL}/v1/products/${id}`,

  SELLER_PRODUCTS: (sellerId: number) => `${API_BASE_URL}/v1/sellers/${sellerId}/products`,
  SELLER_PRODUCT_BY_ID: (sellerId: number, id: number) => `${API_BASE_URL}/v1/sellers/${sellerId}/products/${id}`,
  SELLER_CANCEL_AUCTION: (sellerId: number, id: number) => `${API_BASE_URL}/v1/sellers/${sellerId}/products/${id}/cancel`,
  SELLER_RELIST_AUCTION: (sellerId: number, auctionId: number) => `${API_BASE_URL}/v1/sellers/${sellerId}/products/${auctionId}/relist`,

  ADMIN_PENDING_PRODUCTS: `${API_BASE_URL}/v1/admin/products/pending`,
  ADMIN_APPROVE_PRODUCT: (id: number) => `${API_BASE_URL}/v1/admin/products/${id}/approve`,
  ADMIN_REJECT_PRODUCT: (id: number) => `${API_BASE_URL}/v1/admin/products/${id}/reject`,

  CATEGORIES: `${API_BASE_URL}/v1/categories`,

  BIDDING_PLACE_BID: (auctionId: number, bidderId: number) => `${API_BASE_URL}/v1/auctions/${auctionId}/bids?bidderId=${bidderId}`,
  BIDDING_BUY_NOW: (auctionId: number, bidderId: number) => `${API_BASE_URL}/v1/auctions/${auctionId}/bids/buy-now?bidderId=${bidderId}`,
  BIDDING_HISTORY: (auctionId: number) => `${API_BASE_URL}/v1/auctions/${auctionId}/bids`,
};

