import { Routes } from '@angular/router';
import { WonAuctionsComponent } from './pages/won-auctions/won-auctions.component';

export const BIDDER_PORTAL_ROUTES: Routes = [
  { path: 'won', component: WonAuctionsComponent },
  { path: '', redirectTo: 'won', pathMatch: 'full' }
];
