import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { WalletService } from '../../../../core/services/wallet.service';
import { UserSessionService } from '../../../../core/auth/user-session.service';
import { ToastService } from '../../../../core/services/toast.service';
import {
  WalletResponse,
  WalletTransaction,
  DepositRequest,
  WithdrawRequest,
  TransactionType
} from '../../../../shared/models/wallet.model';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, FormsModule, RouterLink],
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
  private walletService = inject(WalletService);
  userSession = inject(UserSessionService);
  private toastService = inject(ToastService);

  walletData = signal<WalletResponse | null>(null);
  transactions = signal<WalletTransaction[]>([]);
  isLoading = signal<boolean>(false);
  activeFilter = signal<string>('ALL');

  // Modals visibility state
  showDepositModal = signal<boolean>(false);
  showWithdrawModal = signal<boolean>(false);

  // Form Models
  depositForm: DepositRequest = {
    amount: 1000000,
    paymentMethod: 'VNPAY',
    bankCode: 'NCB'
  };

  withdrawForm: WithdrawRequest = {
    amount: 500000,
    bankName: 'MBBank',
    bankAccountNumber: '',
    bankAccountHolder: ''
  };

  isSubmitting = signal<boolean>(false);

  ngOnInit(): void {
    this.loadWalletData();
    this.loadTransactions();
  }

  loadWalletData(): void {
    this.isLoading.set(true);
    this.walletService.getWallet().subscribe({
      next: (res) => {
        this.walletData.set(res);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.toastService.error('Không thể tải thông tin ví ảo');
        this.isLoading.set(false);
      }
    });
  }

  loadTransactions(): void {
    this.walletService.getTransactions().subscribe({
      next: (res) => {
        this.transactions.set(res);
      },
      error: () => {}
    });
  }

  openDepositModal(): void {
    this.showDepositModal.set(true);
  }

  closeDepositModal(): void {
    this.showDepositModal.set(false);
  }

  selectPresetAmount(amount: number): void {
    this.depositForm.amount = amount;
  }

  submitDeposit(): void {
    if (this.depositForm.amount <= 0) {
      this.toastService.warning('Vui lòng nhập số tiền nạp hợp lệ');
      return;
    }
    this.isSubmitting.set(true);
    this.walletService.deposit(this.depositForm).subscribe({
      next: (res) => {
        this.toastService.success(`Nạp thành công ${this.depositForm.amount.toLocaleString()} VNĐ vào ví ảo!`);
        this.walletData.set(res);
        this.isSubmitting.set(false);
        this.closeDepositModal();
        this.loadTransactions();
      },
      error: (err) => {
        this.toastService.error('Giao dịch nạp tiền thất bại. Vui lòng thử lại.');
        this.isSubmitting.set(false);
      }
    });
  }

  openWithdrawModal(): void {
    this.showWithdrawModal.set(true);
  }

  closeWithdrawModal(): void {
    this.showWithdrawModal.set(false);
  }

  submitWithdraw(): void {
    if (this.withdrawForm.amount <= 0) {
      this.toastService.warning('Vui lòng nhập số tiền rút hợp lệ');
      return;
    }
    const currentAvail = this.walletData()?.availableBalance || 0;
    if (this.withdrawForm.amount > currentAvail) {
      this.toastService.error('Số tiền rút vượt quá số dư khả dụng');
      return;
    }
    if (!this.withdrawForm.bankAccountNumber || !this.withdrawForm.bankAccountHolder) {
      this.toastService.warning('Vui lòng điền đầy đủ thông tin tài khoản nhận tiền');
      return;
    }
    this.isSubmitting.set(true);
    this.walletService.withdraw(this.withdrawForm).subscribe({
      next: (res) => {
        this.toastService.success(`Yêu cầu rút ${this.withdrawForm.amount.toLocaleString()} VNĐ thành công!`);
        this.walletData.set(res);
        this.isSubmitting.set(false);
        this.closeWithdrawModal();
        this.loadTransactions();
      },
      error: (err) => {
        this.toastService.error('Rút tiền thất bại. Vui lòng thử lại.');
        this.isSubmitting.set(false);
      }
    });
  }

  filteredTransactions(): WalletTransaction[] {
    const list = this.transactions();
    const filter = this.activeFilter();
    if (filter === 'ALL') return list;
    return list.filter((t) => t.type === filter);
  }

  setFilter(filter: string): void {
    this.activeFilter.set(filter);
  }

  getTransactionBadgeClass(type: TransactionType): string {
    switch (type) {
      case 'DEPOSIT':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'WITHDRAW':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'ESCROW_HOLD':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'ESCROW_RELEASE':
        return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
      case 'REFUND':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-slate-700 text-slate-300';
    }
  }

  getTransactionTypeName(type: TransactionType): string {
    switch (type) {
      case 'DEPOSIT':
        return 'Nạp tiền vào ví';
      case 'WITHDRAW':
        return 'Rút tiền về ngân hàng';
      case 'ESCROW_HOLD':
        return 'Tạm giữ Escrow đấu giá';
      case 'ESCROW_RELEASE':
        return 'Giải ngân Escrow hoàn tất';
      case 'REFUND':
        return 'Hoàn tiền đấu giá';
      default:
        return type;
    }
  }
}

