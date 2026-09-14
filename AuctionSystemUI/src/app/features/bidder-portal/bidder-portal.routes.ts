import { Routes } from '@angular/router';
import { WonAuctionsComponent } from './pages/won-auctions/won-auctions.component';
import { WalletComponent } from '../wallet-portal/pages/wallet/wallet.component';

export const BIDDER_PORTAL_ROUTES: Routes = [
  { path: 'won', component: WonAuctionsComponent },
  { path: 'wallet', component: WalletComponent },
  { path: '', redirectTo: 'won', pathMatch: 'full' }
];

