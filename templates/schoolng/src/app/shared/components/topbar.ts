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
      [class]="state.isDark() ? 'bg-zinc-950/40 border-zinc-900' : 'bg-white/40 border-zinc-200'" 
      class="backdrop-blur-md border-b px-6 py-3 flex items-center justify-between h-16 font-sans">
      
      @if (isSearchExpanded() && isMobileSearch()) {
        <!-- Mobile Expanded Search Bar -->
        <div class="flex items-center gap-3 w-full animate-blur-slide">
          <div 
            [class]="state.isDark() ? 'bg-zinc-900 border-zinc-805' : 'bg-white border-zinc-200'" 
            class="flex items-center gap-2 px-3 h-9 rounded-xl border grow">
            <!-- Lucide: search -->
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400 shrink-0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input 
              type="text" 
              [ngModel]="state.searchQuery()" 
              (ngModelChange)="state.searchQuery.set($event)" 
              placeholder="Search..." 
              class="bg-transparent border-none outline-none text-xs w-full placeholder-zinc-400 dark:placeholder-zinc-500 text-zinc-800 dark:text-zinc-200"
              autofocus>
          </div>
          <button 
            (click)="closeMobileSearch()" 
            [class]="state.isDark() ? 'text-zinc-400 hover:text-zinc-50' : 'text-zinc-600 hover:text-zinc-950'"
            class="text-xs font-medium px-2 py-2 cursor-pointer select-none shrink-0 clickable-scale">
            Cancel
          </button>
        </div>
      } @else {
        <!-- Normal Topbar -->
        <div class="flex items-center justify-between w-full gap-4">
          <!-- Left: Toggle Sidebar + Title -->
          <div class="flex items-center gap-3 shrink-0">
            <button 
              (click)="state.toggleSidebar()" 
              [class]="state.isDark() ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-850' : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'"
              class="w-9 h-9 flex items-center justify-center rounded-xl border transition-colors cursor-pointer select-none shrink-0 clickable-scale">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v18" />
              </svg>
            </button>

            <h1 class="font-display font-medium text-sm text-zinc-900 dark:text-zinc-100 select-none">
              {{ activeNavName() }}
            </h1>
          </div>

          <!-- Right: Search, Notifications, Mode Toggle -->
          <div class="flex items-center gap-2 shrink-0">
            
            <!-- Desktop Search Bar -->
            <div 
              [class]="state.isDark() ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'" 
              class="hidden sm:flex items-center gap-2 px-3 h-9 rounded-xl border w-48 md:w-64">
              <!-- Lucide: search -->
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400 shrink-0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input 
                type="text" 
                [ngModel]="state.searchQuery()" 
                (ngModelChange)="state.searchQuery.set($event)" 
                placeholder="Search cohorts or alerts..." 
                class="bg-transparent border-none outline-none text-xs w-full placeholder-zinc-400 dark:placeholder-zinc-500 text-zinc-800 dark:text-zinc-200 font-normal">
              <kbd class="text-[8px] bg-zinc-100 dark:bg-zinc-850 text-zinc-400 px-1.5 py-0.5 rounded font-mono font-normal shrink-0">⌘ K</kbd>
            </div>

            <!-- Mobile Search Toggler -->
            <button 
              (click)="openMobileSearch()" 
              [class]="state.isDark() ? 'bg-zinc-900 border-zinc-800 text-zinc-350 hover:bg-zinc-850' : 'bg-white border-zinc-200 text-zinc-850 hover:bg-zinc-50'" 
              class="w-9 h-9 flex sm:hidden items-center justify-center rounded-xl border cursor-pointer select-none clickable-scale">
              <!-- Lucide: search -->
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>

            <!-- Notifications -->
            <div class="relative shrink-0" id="notification-container">
              <button 
                (click)="toggleNotifications()" 
                [class]="state.isDark() ? 'bg-zinc-900 border-zinc-800 text-zinc-350 hover:bg-zinc-850' : 'bg-white border-zinc-200 text-zinc-850 hover:bg-zinc-50'" 
                class="w-9 h-9 flex items-center justify-center rounded-xl border cursor-pointer select-none relative clickable-scale">
                <!-- Lucide: bell -->
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                <span class="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-zinc-950 dark:bg-white border border-zinc-200 dark:border-zinc-800"></span>
              </button>

              @if (isNotificationsOpen()) {
                <div 
                  [class]="state.isDark() ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-800'"
                  class="absolute right-0 mt-2 w-80 border rounded-xl overflow-hidden py-1 z-50 shadow-lg">
                  <div class="px-4 py-2.5 border-b font-display font-medium text-xs text-zinc-500 flex justify-between items-center" [class]="state.isDark() ? 'border-zinc-800' : 'border-zinc-100'">
                    <span>Notifications</span>
                    <span class="text-[9px] bg-zinc-100 dark:bg-zinc-850 text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded font-medium border border-zinc-200 dark:border-zinc-700/50">2 Alerts</span>
                  </div>
                  
                  <div class="divide-y text-xs font-normal" [class]="state.isDark() ? 'divide-zinc-800' : 'divide-zinc-100'">
                    <div class="px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-850/60 transition-colors cursor-default">
                      <p class="leading-normal"><span class="font-medium text-zinc-900 dark:text-zinc-50">Notice:</span> Emergency weather evacuation drill scheduled for Wednesday morning.</p>
                      <p class="text-[9px] text-zinc-400 mt-1">1 hour ago</p>
                    </div>
                    <div class="px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-850/60 transition-colors cursor-default">
                      <p class="leading-normal"><span class="font-medium text-zinc-900 dark:text-zinc-50">Dr. Vance</span> updated roster for <span class="font-medium text-zinc-900 dark:text-zinc-50">AP Calculus BC</span>.</p>
                      <p class="text-[9px] text-zinc-400 mt-1">2 hours ago</p>
                    </div>
                  </div>

                  <div class="p-2 border-t text-center" [class]="state.isDark() ? 'border-zinc-800' : 'border-zinc-100'">
                    <button (click)="markAllRead()" class="w-full py-1 text-[10px] font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer select-none clickable-scale">
                      Close Alerts Panel
                    </button>
                  </div>
                </div>
              }
            </div>

            <!-- Mode Toggle -->
            <button 
              (click)="state.toggleTheme()" 
              [class]="state.isDark() ? 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-850' : 'bg-white border-zinc-200 text-zinc-800 hover:bg-zinc-50'" 
              class="w-9 h-9 flex items-center justify-center rounded-xl border cursor-pointer select-none shrink-0 clickable-scale">
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
