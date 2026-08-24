import { Routes } from '@angular/router';
import { SellerProductListComponent } from './pages/product-list/product-list.component';
import { CreateProductComponent } from './pages/create-product/create-product.component';
import { EditProductComponent } from './pages/edit-product/edit-product.component';
import { SellerOrdersComponent } from './pages/seller-orders/seller-orders.component';

export const SELLER_ROUTES: Routes = [
  { path: '', component: SellerProductListComponent },
  { path: 'orders', component: SellerOrdersComponent },
  { path: 'create', component: CreateProductComponent },
  { path: 'edit/:id', component: EditProductComponent }
];
