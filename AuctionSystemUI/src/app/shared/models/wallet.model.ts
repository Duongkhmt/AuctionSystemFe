export type TransactionType = 'DEPOSIT' | 'WITHDRAW' | 'ESCROW_HOLD' | 'ESCROW_RELEASE' | 'REFUND';
export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface WalletResponse {
  id: number;
  userId: number;
  balance: number;
  escrowBalance: number;
  availableBalance?: number;
  currency: string;
  updatedAt: string;
}

export interface WalletTransaction {
  id: number;
  walletId: number;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  description: string;
  referenceId?: string;
  createdAt: string;
}

export interface DepositRequest {
  amount: number;
  paymentMethod?: string;
  bankCode?: string;
}

export interface WithdrawRequest {
  amount: number;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
}
