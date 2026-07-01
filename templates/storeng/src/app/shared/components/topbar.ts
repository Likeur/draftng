import { Component, ElementRef, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-topbar',
  imports: [FormsModule],
  host: {
    'class': 'block sticky top-0 z-[300]',
    '(document:click)': 'onClickOutside($event)'
  },
  template: `
    <header 
      class="backdrop-blur-md bg-theme-bg/40 border-b border-theme-border px-6 py-3 flex items-center justify-between h-16 font-sans">
      
      @if (isSearchExpanded() && isMobileSearch()) {
        <!-- Mobile Expanded Search Bar -->
        <div class="flex items-center gap-3 w-full animate-blur-slide">
          <div 
            class="flex items-center gap-2 px-3 h-9 bg-theme-panel border border-theme-border rounded-xl grow">
            <!-- Lucide: search -->
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-theme-text-muted shrink-0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input 
              type="text" 
              [ngModel]="state.searchQuery()" 
              (ngModelChange)="state.searchQuery.set($event)" 
              placeholder="Search..." 
              class="bg-transparent border-none outline-none text-xs w-full placeholder-theme-text-muted text-theme-text-main"
              autofocus>
          </div>
          <button 
            (click)="closeMobileSearch()" 
            class="text-xs font-medium px-2 py-2 text-theme-text-muted hover:text-theme-text-main cursor-pointer select-none shrink-0 clickable-scale">
            Cancel
          </button>
        </div>
      } @else {
        <!-- Normal Topbar -->
        <div class="flex items-center justify-between w-full gap-4">
          <!-- Left: Toggle Sidebar + Title -->
          <div class="flex items-center gap-3 shrink-0">
            <button 
              (click)="state.toggleSidebar(); $event.stopPropagation()" 
              class="w-9 h-9 flex items-center justify-center bg-theme-panel border border-theme-border text-theme-text-muted hover:text-theme-text-main rounded-xl transition-all cursor-pointer select-none shrink-0 clickable-scale">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v18" />
              </svg>
            </button>

            <h1 class="font-display font-medium text-sm text-theme-text-main select-none">
              {{ activeNavName() }}
            </h1>
          </div>

          <!-- Right: Search, Notifications, Mode Toggle -->
          <div class="flex items-center gap-2 shrink-0">
            
            <!-- Desktop Search Bar -->
            <div 
              class="hidden sm:flex items-center gap-2 px-3 h-9 bg-theme-panel border border-theme-border rounded-xl w-48 md:w-64">
              <!-- Lucide: search -->
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-theme-text-muted shrink-0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input 
                type="text" 
                [ngModel]="state.searchQuery()" 
                (ngModelChange)="state.searchQuery.set($event)" 
                placeholder="Search products or orders..." 
                class="bg-transparent border-none outline-none text-xs w-full placeholder-theme-text-muted text-theme-text-main font-normal">
              <kbd class="text-[8px] bg-theme-bg text-theme-text-muted border border-theme-border px-1.5 py-0.5 rounded font-mono font-normal shrink-0">⌘ K</kbd>
            </div>

            <!-- Mobile Search Toggler -->
            <button 
              (click)="openMobileSearch()" 
              class="w-9 h-9 flex sm:hidden items-center justify-center bg-theme-panel border border-theme-border text-theme-text-muted hover:text-theme-text-main rounded-xl cursor-pointer select-none clickable-scale">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>

            <!-- Notifications -->
            <div class="relative z-[310] shrink-0" id="notification-container">
              <button 
                (click)="toggleNotifications()" 
                class="w-9 h-9 flex items-center justify-center bg-theme-panel border border-theme-border text-theme-text-muted hover:text-theme-text-main rounded-xl cursor-pointer select-none relative clickable-scale">
                <!-- Lucide: bell -->
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                <span class="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-sky-500 border border-theme-border"></span>
              </button>

              <!-- Notifications Dropdown -->
              <div 
                [class.opacity-100]="isNotificationsOpen()"
                [class.pointer-events-auto]="isNotificationsOpen()"
                [class.scale-100]="isNotificationsOpen()"
                [class.translate-y-0]="isNotificationsOpen()"
                [class.opacity-0]="!isNotificationsOpen()"
                [class.pointer-events-none]="!isNotificationsOpen()"
                [class.scale-95]="!isNotificationsOpen()"
                [class.translate-y-[-8px]]="!isNotificationsOpen()"
                class="absolute right-0 mt-2 w-80 bg-theme-panel border border-theme-border text-theme-text-main rounded-xl overflow-hidden py-1 z-[320] shadow-lg transition-all duration-200 ease-out origin-top-right transform">
                <div class="px-4 py-2.5 border-b border-theme-border font-display font-medium text-xs text-theme-text-muted flex justify-between items-center">
                  <span>Notifications</span>
                  <span class="text-[9px] bg-sky-500/10 text-sky-600 dark:text-sky-400 px-1.5 py-0.5 rounded font-medium border border-sky-500/20">3 New</span>
                </div>
                
                <div class="divide-y divide-theme-border text-xs font-normal">
                  <div class="px-4 py-3 hover:bg-theme-hover transition-colors cursor-default flex gap-3 items-start">
                    <div class="w-7 h-7 rounded-lg bg-sky-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-sky-500"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                    </div>
                    <div class="min-w-0">
                      <p class="leading-normal text-theme-text-muted"><span class="font-medium text-theme-text-main">New Order</span> #ORD-1042 placed by Marcus Green — $284.00.</p>
                      <p class="text-[9px] text-theme-text-muted mt-1">5 minutes ago</p>
                    </div>
                  </div>
                  <div class="px-4 py-3 hover:bg-theme-hover transition-colors cursor-default flex gap-3 items-start">
                    <div class="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-500"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/></svg>
                    </div>
                    <div class="min-w-0">
                      <p class="leading-normal text-theme-text-muted"><span class="font-medium text-theme-text-main">Low Stock</span> "Mechanical Keyboard TKL" — only 18 units remaining.</p>
                      <p class="text-[9px] text-theme-text-muted mt-1">1 hour ago</p>
                    </div>
                  </div>
                  <div class="px-4 py-3 hover:bg-theme-hover transition-colors cursor-default flex gap-3 items-start">
                    <div class="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                    </div>
                    <div class="min-w-0">
                      <p class="leading-normal text-theme-text-muted"><span class="font-medium text-theme-text-main">Shipped</span> Order #ORD-1038 dispatched via FedEx — tracking active.</p>
                      <p class="text-[9px] text-theme-text-muted mt-1">2 hours ago</p>
                    </div>
                  </div>
                </div>

                <div class="p-2 border-t border-theme-border text-center">
                  <button (click)="markAllRead()" class="w-full py-1 text-[10px] font-medium text-theme-text-muted hover:text-theme-text-main transition-colors cursor-pointer select-none clickable-scale">
                    Dismiss All
                  </button>
                </div>
              </div>
            </div>

            <!-- Mode Toggle -->
            <button 
              (click)="state.toggleTheme()" 
              class="w-9 h-9 flex items-center justify-center bg-theme-panel border border-theme-border text-theme-text-muted hover:text-theme-text-main rounded-xl cursor-pointer select-none shrink-0 clickable-scale">
              @if (state.isDark()) {
                <!-- Lucide: sun -->
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
              } @else {
                <!-- Lucide: moon -->
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              }
            </button>

          </div>
        </div>
      }

    </header>
  `
})
export class TopbarComponent {
  protected readonly state = inject(StoreService);
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef);

  protected readonly isNotificationsOpen = signal(false);
  protected readonly isSearchExpanded = signal(false);

  protected readonly activeNavName = computed(() => {
    const url = this.state.currentUrl();
    if (url.startsWith('/dashboard')) return 'Dashboard';
    if (url.startsWith('/products')) return 'Products';
    if (url.startsWith('/orders')) return 'Orders';
    return 'Dashboard';
  });

  protected toggleNotifications(): void {
    this.isNotificationsOpen.update(n => !n);
  }

  protected markAllRead(): void {
    this.isNotificationsOpen.set(false);
  }

  protected openMobileSearch(): void {
    this.isSearchExpanded.set(true);
  }

  protected closeMobileSearch(): void {
    this.isSearchExpanded.set(false);
    this.state.searchQuery.set('');
  }

  protected isMobileSearch(): boolean {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640;
    }
    return false;
  }

  protected onClickOutside(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isNotificationsOpen.set(false);
    }
  }
}
