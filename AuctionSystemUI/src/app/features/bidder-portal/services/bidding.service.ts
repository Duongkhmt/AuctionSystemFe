import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/config/api-endpoints.config';
import { BidHistoryResponse, BidRequest, BidResponse } from '../../../shared/models/bid.model';
import { snakeToCamelKeys } from '../../../core/utils/case-converter.util';

@Injectable({
  providedIn: 'root'
})
export class BiddingService {
  private http = inject(HttpClient);

  placeBid(auctionId: number, bidderId: number, request: BidRequest): Observable<BidResponse> {
    const payload = {
      bid_amount: request.bidAmount,
      max_auto_bid_amount: request.maxAutoBidAmount || null
    };

    return this.http.post<any>(
      API_ENDPOINTS.BIDDING_PLACE_BID(auctionId, bidderId),
      payload
    ).pipe(
      map((res) => snakeToCamelKeys<BidResponse>(res))
    );
  }

  buyNow(auctionId: number, bidderId: number): Observable<BidResponse> {
    return this.http.post<any>(
      API_ENDPOINTS.BIDDING_BUY_NOW(auctionId, bidderId),
      {}
    ).pipe(
      map((res) => snakeToCamelKeys<BidResponse>(res))
    );
  }

  getBidHistory(auctionId: number): Observable<BidHistoryResponse[]> {
    return this.http.get<any[]>(
      API_ENDPOINTS.BIDDING_HISTORY(auctionId)
    ).pipe(
      map((res) => snakeToCamelKeys<BidHistoryResponse[]>(res))
    );
  }
}
