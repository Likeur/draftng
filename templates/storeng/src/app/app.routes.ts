import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard').then(m => m.DashboardComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products').then(m => m.ProductsComponent)
  },
  {
    path: 'orders',
    loadComponent: () => import('./features/orders').then(m => m.OrdersComponent)
  }
];
