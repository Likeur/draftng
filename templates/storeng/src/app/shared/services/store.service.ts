import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  sold: number;
  status: 'Active' | 'Draft' | 'Out of Stock';
  sku: string;
  image: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  customer: string;
  email: string;
  date: string;
  total: number;
  items: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  avatar: string;
}

export interface ActivityLog {
  id: number;
  message: string;
  time: string;
  category: 'order' | 'product' | 'system';
}

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  public readonly isDark = signal(false);
  public readonly currentTheme = signal<'dark' | 'light' | 'system'>('light');
  public readonly searchQuery = signal('');
  public readonly isSidebarCollapsed = signal(true);
  public readonly isCollapsed = this.isSidebarCollapsed;
  public readonly currentUrl = signal<string>('');

  // Dashboard KPIs
  public readonly totalRevenue = signal({ value: '$48,392', change: '+14.2%' });
  public readonly totalOrders = signal({ value: '1,284', change: '+9.7%' });
  public readonly totalProducts = signal({ value: '342', change: '+5.1%' });
  public readonly conversionRate = signal({ value: '3.64%', status: 'Good' });

  // Recent Activity
  public readonly activityLogs = signal<ActivityLog[]>([
    { id: 1, message: 'New order #ORD-1042 placed by Marcus Green — $284.00', time: '5 minutes ago', category: 'order' },
    { id: 2, message: 'Product "Wireless Headphones Pro" restocked — 120 units added', time: '1 hour ago', category: 'product' },
    { id: 3, message: 'Order #ORD-1038 shipped via FedEx — tracking #FX928374', time: '2 hours ago', category: 'order' },
    { id: 4, message: 'New product draft created: "Smart Watch Series 4"', time: '3 hours ago', category: 'product' },
    { id: 5, message: 'Order #ORD-1031 cancelled by customer — refund initiated', time: '5 hours ago', category: 'order' }
  ]);

  // Products
  public readonly products = signal<Product[]>([
    { id: 1, name: 'Wireless Headphones Pro', category: 'Electronics', price: 149.99, stock: 84, sold: 312, status: 'Active', sku: 'EL-WHP-001', image: 'avatar-grad-1' },
    { id: 2, name: 'Minimalist Leather Wallet', category: 'Accessories', price: 49.99, stock: 156, sold: 540, status: 'Active', sku: 'AC-MLW-002', image: 'avatar-grad-2' },
    { id: 3, name: 'Portable Charger 20000mAh', category: 'Electronics', price: 59.99, stock: 0, sold: 278, status: 'Out of Stock', sku: 'EL-PCH-003', image: 'avatar-grad-3' },
    { id: 4, name: 'Ceramic Coffee Mug Set', category: 'Home & Kitchen', price: 34.99, stock: 210, sold: 94, status: 'Active', sku: 'HK-CCM-004', image: 'avatar-grad-4' },
    { id: 5, name: 'Running Shoes Ultralight', category: 'Sports', price: 119.99, stock: 47, sold: 183, status: 'Active', sku: 'SP-RSU-005', image: 'avatar-grad-5' },
    { id: 6, name: 'Smart Watch Series 4', category: 'Electronics', price: 299.99, stock: 0, sold: 0, status: 'Draft', sku: 'EL-SWS-006', image: 'avatar-grad-1' },
    { id: 7, name: 'Bamboo Cutting Board XL', category: 'Home & Kitchen', price: 29.99, stock: 88, sold: 122, status: 'Active', sku: 'HK-BCB-007', image: 'avatar-grad-2' },
    { id: 8, name: 'Yoga Mat Premium', category: 'Sports', price: 64.99, stock: 31, sold: 207, status: 'Active', sku: 'SP-YMP-008', image: 'avatar-grad-3' },
    { id: 9, name: 'Noise-Cancel Earbuds', category: 'Electronics', price: 89.99, stock: 62, sold: 451, status: 'Active', sku: 'EL-NCE-009', image: 'avatar-grad-4' },
    { id: 10, name: 'Stainless Water Bottle', category: 'Sports', price: 24.99, stock: 334, sold: 689, status: 'Active', sku: 'SP-SWB-010', image: 'avatar-grad-5' },
    { id: 11, name: 'Mechanical Keyboard TKL', category: 'Electronics', price: 189.99, stock: 18, sold: 97, status: 'Active', sku: 'EL-MKT-011', image: 'avatar-grad-1' },
    { id: 12, name: 'Linen Throw Blanket', category: 'Home & Kitchen', price: 44.99, stock: 0, sold: 58, status: 'Out of Stock', sku: 'HK-LTB-012', image: 'avatar-grad-2' }
  ]);

  // Orders
  public readonly orders = signal<Order[]>([
    { id: 1, orderNumber: 'ORD-1042', customer: 'Marcus Green', email: 'marcus@email.com', date: 'Jul 01, 2026', total: 284.00, items: 3, status: 'Pending', avatar: 'avatar-grad-1' },
    { id: 2, orderNumber: 'ORD-1041', customer: 'Priya Sharma', email: 'priya@email.com', date: 'Jul 01, 2026', total: 149.99, items: 1, status: 'Processing', avatar: 'avatar-grad-2' },
    { id: 3, orderNumber: 'ORD-1040', customer: 'Tyler Brooks', email: 'tyler@email.com', date: 'Jun 30, 2026', total: 74.98, items: 2, status: 'Shipped', avatar: 'avatar-grad-3' },
    { id: 4, orderNumber: 'ORD-1039', customer: 'Amara Diallo', email: 'amara@email.com', date: 'Jun 30, 2026', total: 419.97, items: 4, status: 'Delivered', avatar: 'avatar-grad-4' },
    { id: 5, orderNumber: 'ORD-1038', customer: 'Noah Kim', email: 'noah@email.com', date: 'Jun 29, 2026', total: 299.99, items: 1, status: 'Shipped', avatar: 'avatar-grad-5' },
    { id: 6, orderNumber: 'ORD-1037', customer: 'Sophie Chen', email: 'sophie@email.com', date: 'Jun 29, 2026', total: 54.98, items: 2, status: 'Delivered', avatar: 'avatar-grad-1' },
    { id: 7, orderNumber: 'ORD-1036', customer: 'Carlos Mendez', email: 'carlos@email.com', date: 'Jun 28, 2026', total: 189.99, items: 1, status: 'Delivered', avatar: 'avatar-grad-2' },
    { id: 8, orderNumber: 'ORD-1035', customer: 'Fatima Al-Hassan', email: 'fatima@email.com', date: 'Jun 28, 2026', total: 134.97, items: 3, status: 'Cancelled', avatar: 'avatar-grad-3' },
    { id: 9, orderNumber: 'ORD-1034', customer: 'James Okafor', email: 'james@email.com', date: 'Jun 27, 2026', total: 89.99, items: 1, status: 'Delivered', avatar: 'avatar-grad-4' },
    { id: 10, orderNumber: 'ORD-1033', customer: 'Yuki Tanaka', email: 'yuki@email.com', date: 'Jun 27, 2026', total: 364.96, items: 5, status: 'Delivered', avatar: 'avatar-grad-5' },
    { id: 11, orderNumber: 'ORD-1032', customer: 'Lena Mueller', email: 'lena@email.com', date: 'Jun 26, 2026', total: 49.99, items: 1, status: 'Delivered', avatar: 'avatar-grad-1' },
    { id: 12, orderNumber: 'ORD-1031', customer: 'Raj Patel', email: 'raj@email.com', date: 'Jun 26, 2026', total: 239.98, items: 2, status: 'Cancelled', avatar: 'avatar-grad-2' }
  ]);

  constructor() {
    const router = inject(Router);
    this.currentUrl.set(router.url);
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.set(event.urlAfterRedirects);
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('storeng-theme') as 'dark' | 'light' | 'system' || 'light';
      this.currentTheme.set(savedTheme);
      this.applyTheme(savedTheme);

      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (this.currentTheme() === 'system') {
          this.isDark.set(e.matches);
          this.updateDocumentClass(e.matches);
        }
      });

      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        this.isSidebarCollapsed.set(true);
      } else {
        const savedCollapsed = localStorage.getItem('storeng-sidebarCollapsed');
        if (savedCollapsed !== null) {
          this.isSidebarCollapsed.set(savedCollapsed === 'true');
        } else {
          this.isSidebarCollapsed.set(false);
        }
      }

      let lastWidth = window.innerWidth;
      window.addEventListener('resize', () => {
        const currentWidth = window.innerWidth;
        if (currentWidth < 768 && lastWidth >= 768) {
          this.isSidebarCollapsed.set(true);
        }
        lastWidth = currentWidth;
      });

      router.events.subscribe(event => {
        if (event instanceof NavigationEnd && window.innerWidth < 768) {
          this.isSidebarCollapsed.set(true);
        }
      });
    }
  }

  public selectTheme(theme: 'dark' | 'light' | 'system'): void {
    this.currentTheme.set(theme);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('storeng-theme', theme);
    }
    this.applyTheme(theme);
  }

  public toggleTheme(): void {
    const current = this.currentTheme();
    const nextTheme = current === 'dark' ? 'light' : 'dark';
    this.selectTheme(nextTheme);
  }

  public toggleSidebar(): void {
    this.isSidebarCollapsed.update(c => {
      const next = !c;
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('storeng-sidebarCollapsed', String(next));
      }
      return next;
    });
  }

  public setSidebarCollapsed(collapsed: boolean): void {
    this.isSidebarCollapsed.set(collapsed);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('storeng-sidebarCollapsed', String(collapsed));
    }
  }

  private applyTheme(theme: 'dark' | 'light' | 'system'): void {
    let dark = false;
    if (theme === 'system') {
      if (isPlatformBrowser(this.platformId)) {
        dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    } else {
      dark = theme === 'dark';
    }
    this.isDark.set(dark);
    this.updateDocumentClass(dark);
  }

  private updateDocumentClass(dark: boolean): void {
    if (isPlatformBrowser(this.platformId)) {
      if (dark) {
        this.document.documentElement.classList.add('dark');
      } else {
        this.document.documentElement.classList.remove('dark');
      }
    }
  }
}
