export type OrderStatus = 'UNPAID' | 'PAID' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';
export type PaymentMethod = 'VNPAY' | 'WALLET' | 'BANK_TRANSFER';

export interface WonAuctionResponse {
  orderId: number;
  auctionId: number;
  productId: number;
  productTitle: string;
  productImage?: string;
  winningPrice: number;
  status: OrderStatus;
  shippingAddress?: string;
  phoneNumber?: string;
  courierName?: string;
  trackingNumber?: string;
  createdAt: string;
}

export interface SellerOrderResponse {
  orderId: number;
  productId: number;
  productTitle: string;
  productImage?: string;
  winningPrice: number;
  buyerName?: string;
  buyerPhone?: string;
  shippingAddress?: string;
  status: OrderStatus;
  courierName?: string;
  trackingNumber?: string;
  createdAt: string;
}

export interface CheckoutRequest {
  shippingAddress: string;
  phoneNumber: string;
  paymentMethod: PaymentMethod;
}

export interface CheckoutResponse {
  orderId: number;
  status: OrderStatus;
  winningPrice: number;
  transactionCode: string;
  message: string;
}

export interface ShipOrderRequest {
  courierName: string;
  trackingNumber: string;
}
