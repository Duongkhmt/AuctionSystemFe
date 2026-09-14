import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../../core/services/order.service';
import { ToastService } from '../../../../core/services/toast.service';
import { SellerOrderResponse, WonAuctionResponse } from '../../../../shared/models/order.model';
import { CurrencyVndPipe } from '../../../../shared/pipes/currency-vnd.pipe';

/**
 * ====================================================================================
 * 🔒 FINANCIAL & ESCROW DASHBOARD COMPONENT (Ban Quản Trị - Quản Lý Két Escrow Sàn)
 * ====================================================================================
 * Dành riêng cho Admin theo dõi Dòng tiền Trung gian Escrow toàn hệ thống:
 * 1. Tổng tiền Sàn đang Tạm Giữ Escrow (các đơn PAID & SHIPPING chờ người mua nhận hàng).
 * 2. Tổng doanh thu giải ngân hoàn tất (COMPLETED).
 * 3. Danh sách dòng tiền các đơn hàng chi tiết.
 */
@Component({
  selector: 'app-financial-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, CurrencyVndPipe],
  templateUrl: './financial-dashboard.component.html',
  styleUrls: ['./financial-dashboard.component.scss']
})
export class FinancialDashboardComponent implements OnInit {
  private orderService = inject(OrderService);
  private toastService = inject(ToastService);

  orders = signal<SellerOrderResponse[]>([]);
  isLoading = signal<boolean>(true);
  activeTab = signal<string>('ESCROW_HOLD');

  // Thống kê 1: Dòng tiền Escrow Sàn đang tạm giữ (Trạng thái PAID hoặc SHIPPING)
  totalEscrowHeld = computed(() => {
    return this.orders()
      .filter(o => o.status === 'PAID' || o.status === 'SHIPPING')
      .reduce((sum, o) => sum + (o.winningPrice || 0), 0);
  });

  // Thống kê 2: Doanh thu đã giải ngân hoàn tất cho Người bán (Trạng thái COMPLETED)
  totalDisbursed = computed(() => {
    return this.orders()
      .filter(o => o.status === 'COMPLETED')
      .reduce((sum, o) => sum + (o.winningPrice || 0), 0);
  });

  // Thống kê 3: Đơn hàng chờ thanh toán (Trạng thái UNPAID)
  totalUnpaidPending = computed(() => {
    return this.orders()
      .filter(o => o.status === 'UNPAID')
      .reduce((sum, o) => sum + (o.winningPrice || 0), 0);
  });

  // Đơn hàng hiển thị theo Filter Tab
  filteredOrders = computed(() => {
    const tab = this.activeTab();
    if (tab === 'ESCROW_HOLD') {
      return this.orders().filter(o => o.status === 'PAID' || o.status === 'SHIPPING');
    }
    if (tab === 'COMPLETED') {
      return this.orders().filter(o => o.status === 'COMPLETED');
    }
    if (tab === 'UNPAID') {
      return this.orders().filter(o => o.status === 'UNPAID');
    }
    return this.orders();
  });

  ngOnInit(): void {
    this.fetchSystemFinancialData();
  }

  fetchSystemFinancialData(): void {
    this.isLoading.set(true);
    this.orderService.getAdminOrders().subscribe({
      next: (res) => {
        this.orders.set(res || []);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PAID':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'SHIPPING':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'COMPLETED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'UNPAID':
        return 'bg-slate-700/50 text-slate-400 border-slate-600/30';
      case 'CANCELLED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  }

  getStatusName(status: string): string {
    switch (status) {
      case 'PAID':
        return '🔒 Đã nộp cọc / Giữ Escrow';
      case 'SHIPPING':
        return '🚚 Đang vận chuyển';
      case 'COMPLETED':
        return '✅ Giải ngân hoàn tất';
      case 'UNPAID':
        return '⏳ Chờ thanh toán';
      case 'CANCELLED':
        return '❌ Đã hủy';
      default:
        return status;
    }
  }
}
