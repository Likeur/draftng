import { Component, inject, signal, ElementRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SchoolService } from '../services/school.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  host: {
    '(document:click)': 'onClickOutside($event)'
  },
  template: `
    <aside 
      [class.w-14]="state.isCollapsed()"
      [class.p-2]="state.isCollapsed()"
      [class.w-52]="!state.isCollapsed()"
      [class.p-4]="!state.isCollapsed()"
      class="fixed md:sticky left-0 top-0 bottom-0 z-50 md:z-45 h-screen bg-zinc-955 border-r border-zinc-200 dark:border-zinc-800/60 flex flex-col justify-between shrink-0 transition-all duration-200 font-sans select-none -translate-x-full md:translate-x-0">
      
      <div>
        <!-- Top Branding -->
        <div class="flex items-center gap-2.5 overflow-hidden h-10 mb-6" [class.justify-center]="state.isCollapsed()">
          <!-- schoolNG geometric logo -->
          <svg class="shrink-0 w-6 h-7" viewBox="0 0 35 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="logomark">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M29.4554 2.43478V0H35V22.4348C35 32.1358 27.165 40 17.5 40C8.24271 40 0.664262 32.7853 0.0413736 23.6522H0V0H5.54455V2.43478H14.901V0H20.4455V2.43478H29.4554ZM29.4554 22.4348V19.0202C28.8318 19.6656 28.1633 20.2785 27.4539 20.8558C25.1121 22.7615 22.3612 24.2503 19.369 25.2589C16.3764 26.2677 13.1833 26.7826 9.96797 26.7826H6.35343C8.08848 31.2608 12.425 34.4348 17.5 34.4348C24.1028 34.4348 29.4554 29.0622 29.4554 22.4348ZM15.4269 18.2435C14.3706 19.3674 13.18 20.3419 11.8852 21.1425C13.8545 20.9882 15.7827 20.5971 17.6038 19.9833C20.013 19.1712 22.1698 17.9913 23.9621 16.5329C25.7535 15.075 27.136 13.3757 28.0645 11.5515C28.6507 10.3998 29.0518 9.20727 29.2674 8H20.2671C20.0641 9.47968 19.6891 10.9319 19.1475 12.3231C18.2893 14.5274 17.0275 16.5405 15.4269 18.2435ZM5.54455 17.8146V8H14.6483C14.4948 8.78546 14.2724 9.55482 13.9832 10.2975C13.3786 11.8506 12.4962 13.2517 11.3938 14.4246C10.2918 15.5971 8.99228 16.518 7.57404 17.143C6.91535 17.4333 6.23601 17.6576 5.54455 17.8146Z" [class]="state.isDark() ? 'fill-zinc-50' : 'fill-zinc-950'"/>
            </g>
          </svg>
          @if (!state.isCollapsed()) {
            <div class="animate-fade-in shrink-0 leading-none">
              <h2 class="font-medium text-sm tracking-tight text-zinc-900 dark:text-zinc-50">schoolNG</h2>
            </div>
          }
        </div>
        
        <!-- Navigation Section -->
        <div class="mb-5">
          <p class="text-[9px] font-medium text-zinc-400 dark:text-zinc-500 mb-2 px-3 overflow-hidden text-ellipsis whitespace-nowrap capitalize tracking-wider">
            {{ state.isCollapsed() ? '•••' : 'Main menu' }}
          </p>
          <nav class="space-y-0.5">
            
            <!-- Dashboard -->
            <button 
              routerLink="/dashboard"
              [class]="isActive('/dashboard') ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-955 dark:text-zinc-50 font-medium' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'" 
              class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden font-normal clickable-scale"
              [class.justify-center]="state.isCollapsed()"
              [class.gap-3]="!state.isCollapsed()"
              [class.px-2]="state.isCollapsed()"
              [class.px-3]="!state.isCollapsed()">
              <!-- Lucide: layout-dashboard -->
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="10" rx="1"/><rect width="7" height="5" x="3" y="14" rx="1"/></svg>
              @if (!state.isCollapsed()) {
                <span class="animate-fade-in whitespace-nowrap">Dashboard</span>
              }
            </button>

            <!-- Classes -->
            <button 
              routerLink="/classes"
              [class]="isActive('/classes') ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-955 dark:text-zinc-50 font-medium' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'" 
              class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden font-normal clickable-scale"
              [class.justify-center]="state.isCollapsed()"
              [class.gap-3]="!state.isCollapsed()"
              [class.px-2]="state.isCollapsed()"
              [class.px-3]="!state.isCollapsed()">
              <!-- Lucide: school -->
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="m4 6 8-4 8 4M18 10v7M6 10v7m3-7v7m6-7v7M2 22h20M12 22v-4M8 12h8"/></svg>
              @if (!state.isCollapsed()) {
                <span class="animate-fade-in whitespace-nowrap">Classes</span>
              }
            </button>

            <!-- Students -->
            <button 
              routerLink="/students"
              [class]="isActive('/students') ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-955 dark:text-zinc-50 font-medium' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'" 
              class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden font-normal clickable-scale"
              [class.justify-center]="state.isCollapsed()"
              [class.gap-3]="!state.isCollapsed()"
              [class.px-2]="state.isCollapsed()"
              [class.px-3]="!state.isCollapsed()">
              <!-- Lucide: users -->
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              @if (!state.isCollapsed()) {
                <span class="animate-fade-in whitespace-nowrap">Students</span>
              }
            </button>

            <!-- Teachers -->
            <button 
              routerLink="/teachers"
              [class]="isActive('/teachers') ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-955 dark:text-zinc-50 font-medium' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'" 
              class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden font-normal clickable-scale"
              [class.justify-center]="state.isCollapsed()"
              [class.gap-3]="!state.isCollapsed()"
              [class.px-2]="state.isCollapsed()"
              [class.px-3]="!state.isCollapsed()">
              <!-- Lucide: graduation-cap -->
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
              @if (!state.isCollapsed()) {
                <span class="animate-fade-in whitespace-nowrap">Teachers</span>
              }
            </button>

            <!-- Settings -->
            <button 
              routerLink="/settings"
              [class]="isActive('/settings') ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-955 dark:text-zinc-50 font-medium' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'" 
              class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden font-normal clickable-scale"
              [class.justify-center]="state.isCollapsed()"
              [class.gap-3]="!state.isCollapsed()"
              [class.px-2]="state.isCollapsed()"
              [class.px-3]="!state.isCollapsed()">
              <!-- Lucide: settings -->
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
              @if (!state.isCollapsed()) {
                <span class="animate-fade-in whitespace-nowrap">Settings</span>
              }
            </button>

          </nav>
        </div>

        <!-- Grade Groups / Cohorts List -->
        <div>
          <p class="text-[9px] font-medium text-zinc-400 dark:text-zinc-500 mb-2 px-3 overflow-hidden text-ellipsis whitespace-nowrap capitalize tracking-wider">
            {{ state.isCollapsed() ? '•••' : 'Active cohorts' }}
          </p>
          <div class="space-y-0.5 px-1">
            @for (cohort of cohorts; track cohort.name) {
              <button class="w-full flex items-center py-1.5 rounded-lg text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-all text-left overflow-hidden clickable-scale"
                [class.justify-center]="state.isCollapsed()"
                [class.gap-3]="!state.isCollapsed()"
                [class.px-2]="state.isCollapsed()"
                [class.px-3]="!state.isCollapsed()">
                <span [class]="cohort.color" class="w-2 h-2 rounded-full shrink-0 border border-zinc-200/50 dark:border-zinc-800/30"></span>
                @if (!state.isCollapsed()) {
                  <span class="animate-fade-in truncate font-normal text-zinc-500 dark:text-zinc-400">{{ cohort.name }}</span>
                }
              </button>
            }
          </div>
        </div>

      </div>

      <!-- User Options Bottom Section -->
      <div class="relative" id="user-menu-container">
        <!-- Dropdown Menu -->
        @if (isUserDropdownOpen()) {
          <div 
            class="absolute bottom-full left-0 mb-2 w-64 bg-zinc-955 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-250 rounded-xl p-1.5 z-50 shadow-md animate-fade-in select-none">
            
            <!-- User Profile Header -->
            <div class="flex items-center gap-2.5 p-2.5 pb-3 border-b border-zinc-100 dark:border-zinc-900">
              <div class="profile-mesh-avatar w-8 h-8 rounded-full border border-zinc-200/50 dark:border-zinc-800 shrink-0"></div>
              <div class="text-left overflow-hidden">
                <p class="text-xs font-medium leading-tight text-zinc-900 dark:text-zinc-50 truncate">admin_schoolng</p>
                <p class="text-[9px] text-zinc-400 truncate mt-0.5">registrar&#64;schoolng.edu</p>
              </div>
            </div>

            <!-- Options Group -->
            <div class="py-1">
              <!-- Settings Link -->
              <button routerLink="/settings" (click)="isUserDropdownOpen.set(false)" class="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-all cursor-pointer text-left clickable-scale">
                <div class="flex items-center gap-2.5">
                  <!-- Lucide: settings -->
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                  <span>Global Settings</span>
                </div>
                <span class="text-[9px] text-zinc-400 font-mono tracking-wider">⇧⌘,</span>
              </button>
            </div>

            <!-- Divider -->
            <div class="h-px my-1 bg-zinc-100 dark:bg-zinc-900"></div>

            <!-- Appearance options -->
            <div class="py-1">
              <div class="relative group/appearance w-full">
                <button class="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-all cursor-pointer text-left clickable-scale">
                  <div class="flex items-center gap-2.5">
                    <!-- Lucide: sun -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
                    <div class="flex flex-col text-left">
                      <span>Appearance</span>
                      <span class="text-[9px] text-zinc-400 font-normal mt-0.5">{{ getActiveThemeName() }}</span>
                    </div>
                  </div>
                  <!-- Lucide: chevron-right -->
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="m9 18 6-6-6-6"/></svg>
                </button>

                <!-- Flyout Menu container -->
                <div class="absolute left-full bottom-0 pl-2 w-32 z-55 opacity-0 pointer-events-none group-hover/appearance:opacity-100 group-hover/appearance:pointer-events-auto transition-all duration-150">
                  <div class="bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-xl p-1.5 shadow-lg flex flex-col gap-1 text-zinc-800 dark:text-zinc-200">
                    <button (click)="selectTheme('light')" class="w-full text-left px-2 py-1.5 rounded-lg text-xs font-normal cursor-pointer hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 transition-all clickable-scale font-medium">Light</button>
                    <button (click)="selectTheme('dark')" class="w-full text-left px-2 py-1.5 rounded-lg text-xs font-normal cursor-pointer hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 transition-all clickable-scale font-medium">Dark</button>
                    <button (click)="selectTheme('system')" class="w-full text-left px-2 py-1.5 rounded-lg text-xs font-normal cursor-pointer hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 transition-all clickable-scale font-medium">System</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Divider -->
            <div class="h-px my-1 bg-zinc-100 dark:bg-zinc-900"></div>

            <div class="py-1">
              <button (click)="onOption('Log Out')" class="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-normal transition-all cursor-pointer text-left clickable-scale text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20">
                <!-- Lucide: log-out -->
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-400 shrink-0"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/></svg>
                <span>Log Out</span>
              </button>
            </div>

          </div>
        }

        <!-- Toggle Button -->
        <button 
          (click)="toggleUserDropdown()"
          class="w-full flex items-center bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-850 rounded-xl transition-all cursor-pointer select-none clickable-scale"
          [class.justify-center]="state.isCollapsed()"
          [class.justify-between]="!state.isCollapsed()"
          [class.p-1]="state.isCollapsed()"
          [class.p-2]="!state.isCollapsed()">
          <div class="flex items-center overflow-hidden shrink-0" [class.gap-2]="!state.isCollapsed()">
            <div class="profile-mesh-avatar w-7 h-7 rounded-full border border-zinc-200/50 dark:border-zinc-800 shrink-0"></div>
            @if (!state.isCollapsed()) {
              <div class="text-left animate-fade-in shrink-0">
                <p class="text-[10px] font-medium leading-tight text-zinc-900 dark:text-zinc-50 truncate max-w-30">admin_schoolng</p>
                <p class="text-[8px] text-zinc-400 font-normal truncate max-w-30">registrar&#64;schoolng.edu</p>
              </div>
            }
          </div>
          @if (!state.isCollapsed()) {
            <!-- Lucide: chevron-right -->
            <svg class="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          }
        </button>
      </div>

    </aside>
  `
})
export class SidebarComponent {
  protected readonly state = inject(SchoolService);
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef);

  protected readonly isUserDropdownOpen = signal(false);

  protected readonly cohorts = [
    { name: 'Grade 9 (Freshmen)', color: 'bg-emerald-500' },
    { name: 'Grade 10 (Sophomores)', color: 'bg-amber-500' },
    { name: 'Grade 11 (Juniors)', color: 'bg-indigo-500' },
    { name: 'Grade 12 (Seniors)', color: 'bg-pink-500' }
  ];

  protected isActive(path: string): boolean {
    const url = this.state.currentUrl();
    if (path === '/dashboard') {
      return url === '/dashboard';
    }
    return url.startsWith(path);
  }

  protected toggleUserDropdown(): void {
    this.isUserDropdownOpen.update(d => !d);
  }

  protected getActiveThemeName(): string {
    const t = this.state.currentTheme();
    return t.charAt(0).toUpperCase() + t.slice(1);
  }

  protected selectTheme(theme: 'dark' | 'light' | 'system'): void {
    this.state.selectTheme(theme);
    this.isUserDropdownOpen.set(false);
  }

  protected onOption(option: string): void {
    console.log('Selected option:', option);
    this.isUserDropdownOpen.set(false);
  }

  protected onClickOutside(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isUserDropdownOpen.set(false);
    }
  }
}
