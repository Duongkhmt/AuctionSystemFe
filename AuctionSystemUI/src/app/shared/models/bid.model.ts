export interface BidRequest {
  bidAmount: number;
  maxAutoBidAmount?: number;
}

export interface BidResponse {
  bidId: number;
  auctionId: number;
  maskedBidderName: string;
  bidAmount: number;
  newCurrentPrice: number;
  nextMinBidAmount: number;
  timeExtended: boolean;
  newEndTime?: string;
  createdAt: string;
}

export interface BidHistoryResponse {
  bidId: number;
  maskedBidderName: string;
  bidAmount: number;
  autoBid: boolean;
  createdAt: string;
}
