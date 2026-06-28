import { Component, ElementRef, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SchoolService } from '../services/school.service';

@Component({
  selector: 'app-topbar',
  imports: [FormsModule],
  host: {
    'class': 'block sticky top-0 z-30',
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
                placeholder="Search cohorts or alerts..." 
                class="bg-transparent border-none outline-none text-xs w-full placeholder-theme-text-muted text-theme-text-main font-normal">
              <kbd class="text-[8px] bg-theme-bg text-theme-text-muted border border-theme-border px-1.5 py-0.5 rounded font-mono font-normal shrink-0">⌘ K</kbd>
            </div>

            <!-- Mobile Search Toggler -->
            <button 
              (click)="openMobileSearch()" 
              class="w-9 h-9 flex sm:hidden items-center justify-center bg-theme-panel border border-theme-border text-theme-text-muted hover:text-theme-text-main rounded-xl cursor-pointer select-none clickable-scale">
              <!-- Lucide: search -->
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>

            <!-- Notifications -->
            <div class="relative shrink-0" id="notification-container">
              <button 
                (click)="toggleNotifications()" 
                class="w-9 h-9 flex items-center justify-center bg-theme-panel border border-theme-border text-theme-text-muted hover:text-theme-text-main rounded-xl cursor-pointer select-none relative clickable-scale">
                <!-- Lucide: bell -->
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                <span class="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-theme-text-main border border-theme-border"></span>
              </button>

              <!-- Notifications Dropdown Panel -->
              <div 
                [class.opacity-100]="isNotificationsOpen()"
                [class.pointer-events-auto]="isNotificationsOpen()"
                [class.scale-100]="isNotificationsOpen()"
                [class.translate-y-0]="isNotificationsOpen()"
                [class.opacity-0]="!isNotificationsOpen()"
                [class.pointer-events-none]="!isNotificationsOpen()"
                [class.scale-95]="!isNotificationsOpen()"
                [class.translate-y-[-8px]]="!isNotificationsOpen()"
                class="absolute right-0 mt-2 w-80 bg-theme-panel border border-theme-border text-theme-text-main rounded-xl overflow-hidden py-1 z-50 shadow-lg transition-all duration-200 ease-out origin-top-right transform">
                <div class="px-4 py-2.5 border-b border-theme-border font-display font-medium text-xs text-theme-text-muted flex justify-between items-center">
                  <span>Notifications</span>
                  <span class="text-[9px] bg-theme-bg text-theme-text-muted px-1.5 py-0.5 rounded font-medium border border-theme-border">2 Alerts</span>
                </div>
                
                <div class="divide-y divide-theme-border text-xs font-normal">
                  <div class="px-4 py-3 hover:bg-theme-hover transition-colors cursor-default">
                    <p class="leading-normal"><span class="font-medium text-theme-text-main">Notice:</span> Emergency weather evacuation drill scheduled for Wednesday morning.</p>
                    <p class="text-[9px] text-theme-text-muted mt-1">1 hour ago</p>
                  </div>
                  <div class="px-4 py-3 hover:bg-theme-hover transition-colors cursor-default">
                    <p class="leading-normal"><span class="font-medium text-theme-text-main">Dr. Vance</span> updated roster for <span class="font-medium text-theme-text-main">AP Calculus BC</span>.</p>
                    <p class="text-[9px] text-theme-text-muted mt-1">2 hours ago</p>
                  </div>
                </div>

                <div class="p-2 border-t border-theme-border text-center">
                  <button (click)="markAllRead()" class="w-full py-1 text-[10px] font-medium text-theme-text-muted hover:text-theme-text-main transition-colors cursor-pointer select-none clickable-scale">
                    Close Alerts Panel
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
  protected readonly state = inject(SchoolService);
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef);

  protected readonly isNotificationsOpen = signal(false);
  protected readonly isSearchExpanded = signal(false);

  protected readonly activeNavName = computed(() => {
    const url = this.router.url;
    if (url.startsWith('/dashboard')) return 'Dashboard';
    if (url.startsWith('/classes')) return 'Classes';
    if (url.startsWith('/students')) return 'Students';
    if (url.startsWith('/teachers')) return 'Teachers';
    if (url.startsWith('/settings')) return 'Settings';
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
