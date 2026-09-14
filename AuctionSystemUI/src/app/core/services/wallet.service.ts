import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map, catchError, of } from 'rxjs';
import { API_ENDPOINTS } from '../config/api-endpoints.config';
import { snakeToCamelKeys, camelToSnakeKeys } from '../utils/case-converter.util';
import {
  WalletResponse,
  WalletTransaction,
  DepositRequest,
  WithdrawRequest
} from '../../shared/models/wallet.model';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private http = inject(HttpClient);

  // Signal cho số dư ví hiện tại để các component UI (Navbar, Modal) dùng chung
  wallet = signal<WalletResponse | null>(null);

  // 1. Lấy thông tin Ví của user hiện tại
  getWallet(): Observable<WalletResponse> {
    return this.http.get<any>(API_ENDPOINTS.WALLET_ME).pipe(
      map((res) => {
        const data = snakeToCamelKeys<WalletResponse>(res);
        data.availableBalance = Math.max(0, (data.balance || 0) - (data.escrowBalance || 0));
        return data;
      }),
      tap((w) => this.wallet.set(w)),
      catchError(() => {
        const fallback: WalletResponse = {
          id: 0,
          userId: 0,
          balance: 0,
          escrowBalance: 0,
          availableBalance: 0,
          currency: 'VND',
          updatedAt: ''
        };
        this.wallet.set(fallback);
        return of(fallback);
      })
    );
  }

  // 2. Nạp tiền vào Ví
  deposit(request: DepositRequest): Observable<WalletResponse> {
    const payload = camelToSnakeKeys(request);
    return this.http.post<any>(API_ENDPOINTS.WALLET_DEPOSIT, payload).pipe(
      map((res) => {
        const data = snakeToCamelKeys<WalletResponse>(res);
        data.availableBalance = Math.max(0, (data.balance || 0) - (data.escrowBalance || 0));
        return data;
      }),
      tap((w) => this.wallet.set(w))
    );
  }

  // 3. Rút tiền từ Ví
  withdraw(request: WithdrawRequest): Observable<WalletResponse> {
    const payload = camelToSnakeKeys(request);
    return this.http.post<any>(API_ENDPOINTS.WALLET_WITHDRAW, payload).pipe(
      map((res) => {
        const data = snakeToCamelKeys<WalletResponse>(res);
        data.availableBalance = Math.max(0, (data.balance || 0) - (data.escrowBalance || 0));
        return data;
      }),
      tap((w) => this.wallet.set(w))
    );
  }

  // 4. Lấy lịch sử giao dịch Ví
  getTransactions(): Observable<WalletTransaction[]> {
    return this.http.get<any[]>(API_ENDPOINTS.WALLET_TRANSACTIONS).pipe(
      map((res) => snakeToCamelKeys<WalletTransaction[]>(res))
    );
  }
}
