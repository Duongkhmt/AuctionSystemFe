import { AuctionStatus, AuctionType, ProductStatus } from './enums.model';

export interface ProductImageResponse {
  id: number;
  imageUrl: string;
  publicId: string;
  displayOrder: number;
}

export interface ProductResponse {
  productId: number;
  sellerId: number;
  categoryId: number;
  title: string;
  description: string;
  attributes: Record<string, any>;
  status: ProductStatus;
  rejectionReason?: string;
  images: ProductImageResponse[];
  createdAt: string;

  // Auction Details
  auctionId: number;
  auctionType: AuctionType;
  startPrice: number;
  currentPrice: number;
  bidStep: number;
  reservePrice?: number;
  buyNowPrice?: number;
  winnerId?: number;
  maskedWinnerName?: string;
  startTime: string;
  endTime: string;
  auctionStatus: AuctionStatus;
}

export interface ProductRejectRequest {
  rejectionReason: string;
}

export interface ProductRequestForm {
  categoryId: number;
  title: string;
  description: string;
  auctionType: AuctionType;
  startPrice: number;
  bidStep: number;
  startTime: string;
  endTime: string;
  reservePrice?: number;
  buyNowPrice?: number;
  attributes?: Record<string, any>;
  images?: File[];
}
