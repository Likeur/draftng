import { Component, HostListener, ElementRef, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { WorkspaceService } from '../services/workspace.service';

@Component({
  selector: 'app-topbar',
  imports: [CommonModule, FormsModule],
  host: {
    'class': 'block sticky top-0 z-30'
  },
  template: `
    <header 
      [class]="state.isDark() ? 'bg-zinc-950/40' : 'bg-white/40'" 
      class="backdrop-blur-md px-6 py-3 flex items-center justify-between h-16 font-sans">
      
      @if (isSearchExpanded() && isMobileSearch()) {
        <!-- Mobile Expanded Search Bar -->
        <div class="flex items-center gap-3 w-full animate-blur-slide">
          <div 
            [class]="state.isDark() ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-zinc-200'" 
            class="flex items-center gap-2 px-3 h-9 rounded-xl border flex-grow">
            <svg class="w-3.5 h-3.5 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
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
            [class]="state.isDark() ? 'text-zinc-400 hover:text-zinc-50' : 'text-zinc-650 hover:text-zinc-950'"
            class="text-xs font-bold px-2 py-2 cursor-pointer select-none shrink-0 clickable-scale">
            Cancel
          </button>
        </div>
      } @else {
        <!-- Normal Topbar (Single line) -->
        <div class="flex items-center justify-between w-full gap-4">
          <!-- Left side: Collapse Sidebar + Active Nav View name -->
          <div class="flex items-center gap-3 shrink-0">
            <button 
              (click)="state.toggleSidebar()" 
              [class]="state.isDark() ? 'bg-zinc-900 border-zinc-850 text-zinc-300 hover:bg-zinc-800' : 'bg-white border-zinc-200 text-zinc-755 hover:bg-zinc-50'"
              class="w-9 h-9 flex items-center justify-center rounded-xl border transition-colors cursor-pointer select-none shrink-0 clickable-scale">
              <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v18" />
              </svg>
            </button>

            <h1 class="font-display font-bold text-sm text-zinc-900 dark:text-zinc-100 select-none">
              {{ activeNavName() }}
            </h1>
          </div>

          <!-- Right side: Search and Controls -->
          <div class="flex items-center gap-2 shrink-0">
            
            <!-- Search Text Input (hidden on mobile, flex on desktop) -->
            <div 
              [class]="state.isDark() ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-zinc-200'" 
              class="hidden sm:flex items-center gap-2 px-3 h-9 rounded-xl border w-48 md:w-64">
              <svg class="w-3.5 h-3.5 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                [ngModel]="state.searchQuery()" 
                (ngModelChange)="state.searchQuery.set($event)" 
                placeholder="Search tasks..." 
                class="bg-transparent border-none outline-none text-xs w-full placeholder-zinc-400 dark:placeholder-zinc-500 text-zinc-800 dark:text-zinc-200">
              <kbd class="text-[8px] bg-zinc-100 dark:bg-zinc-850 text-zinc-400 px-1.5 py-0.5 rounded font-mono font-bold shrink-0">⌘ K</kbd>
            </div>

            <!-- Search Icon Toggle Button (visible only on mobile) -->
            <button 
              (click)="openMobileSearch()" 
              [class]="state.isDark() ? 'bg-zinc-900 border-zinc-850 text-zinc-350 hover:bg-zinc-800' : 'bg-white border-zinc-200 text-zinc-800 hover:bg-zinc-50'" 
              class="w-9 h-9 flex sm:hidden items-center justify-center rounded-xl border cursor-pointer select-none clickable-scale">
              <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <!-- Notification Bell Button -->
            <div class="relative shrink-0 font-sans" id="notification-container">
              <button 
                (click)="toggleNotifications()" 
                [class]="state.isDark() ? 'bg-zinc-900 border-zinc-850 text-zinc-350 hover:bg-zinc-800' : 'bg-white border-zinc-200 text-zinc-800 hover:bg-zinc-50'" 
                class="w-9 h-9 flex items-center justify-center rounded-xl border cursor-pointer select-none relative clickable-scale">
                <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span class="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-teal-500"></span>
              </button>

              <!-- Notifications dropdown -->
              @if (isNotificationsOpen()) {
                <div 
                  [class]="state.isDark() ? 'bg-zinc-900 border-zinc-850 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-800'"
                  class="absolute right-0 mt-2 w-80 border rounded-xl overflow-hidden py-1 z-50 shadow-lg">
                  <div class="px-4 py-2.5 border-b font-display font-bold text-xs text-zinc-550 flex justify-between items-center" [class]="state.isDark() ? 'border-zinc-800' : 'border-zinc-100'">
                    <span>Notifications</span>
                    <span class="text-[9px] bg-teal-500/10 text-teal-500 px-1.5 py-0.5 rounded font-bold">3 New</span>
                  </div>
                  
                  <div class="divide-y text-xs font-medium" [class]="state.isDark() ? 'divide-zinc-800' : 'divide-zinc-100'">
                    <div class="px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-850/60 transition-colors cursor-default">
                      <p class="leading-normal"><span class="font-bold text-teal-500">DK</span> completed <span class="font-semibold text-zinc-800 dark:text-zinc-50">Gantt Timeline Engine</span></p>
                      <p class="text-[9px] text-zinc-450 mt-1">10 minutes ago</p>
                    </div>
                    <div class="px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-850/60 transition-colors cursor-default">
                      <p class="leading-normal"><span class="font-bold text-teal-500">LN</span> bumped priority of <span class="font-semibold text-zinc-800 dark:text-zinc-50">Core API Auth</span> to High</p>
                      <p class="text-[9px] text-zinc-450 mt-1">2 hours ago</p>
                    </div>
                    <div class="px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-850/60 transition-colors cursor-default">
                      <p class="leading-normal">System migration started by <span class="font-bold text-teal-500">AN</span></p>
                      <p class="text-[9px] text-zinc-450 mt-1">Yesterday</p>
                    </div>
                  </div>

                  <div class="p-2 border-t text-center" [class]="state.isDark() ? 'border-zinc-800' : 'border-zinc-100'">
                    <button (click)="markAllRead()" class="w-full py-1 text-[10px] font-bold text-teal-500 hover:text-teal-400 transition-colors cursor-pointer select-none clickable-scale">
                      Mark all as read
                    </button>
                  </div>
                </div>
              }
            </div>

            <!-- Mode Toggle Trigger -->
            <button 
              (click)="state.toggleTheme()" 
              [class]="state.isDark() ? 'bg-zinc-900 border-zinc-850 text-amber-400 hover:bg-zinc-800' : 'bg-white border-zinc-200 text-zinc-800 hover:bg-zinc-50'" 
              class="w-9 h-9 flex items-center justify-center rounded-xl border cursor-pointer select-none shrink-0 clickable-scale">
              @if (state.isDark()) {
                <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707-.707m11.314 11.314l.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z" /></svg>
              } @else {
                <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              }
            </button>

          </div>
        </div>
      }

    </header>
  `
})
export class TopbarComponent {
  protected readonly state = inject(WorkspaceService);
  private readonly router = inject(Router);

  protected readonly isNotificationsOpen = signal(false);
  protected readonly isSearchExpanded = signal(false);

  protected readonly activeNavName = computed(() => {
    const url = this.router.url;
    if (url.startsWith('/dashboard')) return 'Dashboard';
    if (url.startsWith('/projects')) return 'Projects';
    if (url.startsWith('/calendar')) return 'Calendar';
    if (url.startsWith('/employee')) return 'Employee';
    if (url.startsWith('/team')) return 'Team';
    if (url.startsWith('/inbox')) return 'Inbox';
    if (url.startsWith('/todos')) return 'Todos';
    return 'Projects';
  });

  constructor(private elementRef: ElementRef) {}

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

  @HostListener('document:click', ['$event'])
  protected onClickOutside(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isNotificationsOpen.set(false);
    }
  }
}
