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
      [class]="(state.isDark() ? 'bg-zinc-950 border-zinc-900' : 'bg-white border-zinc-200') + (state.isCollapsed() ? ' -translate-x-full md:translate-x-0 md:w-14 md:p-2' : ' translate-x-0 md:w-52 md:p-4')" 
      class="fixed md:sticky left-0 top-0 bottom-0 z-50 md:z-45 h-screen border-r flex flex-col justify-between shrink-0 transition-all duration-200 w-52 p-4 font-sans select-none">
      
      <div>
        <!-- Top Branding -->
        <div class="flex items-center gap-2.5 overflow-hidden h-10 mb-8" [class.justify-center]="state.isCollapsed()">
          <!-- Vercel-style clean geometric school logo (Triangle) -->
          <svg class="shrink-0 w-6 h-6" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="50,15 90,85 10,85" class="stroke-zinc-950 dark:stroke-zinc-50 stroke-[6]" fill="none"/>
            <polygon points="50,38 75,80 25,80" class="fill-zinc-950 dark:fill-zinc-50"/>
          </svg>
          @if (!state.isCollapsed()) {
            <div class="animate-fade-in shrink-0 leading-none">
              <h2 class="font-medium text-sm tracking-tight text-zinc-900 dark:text-zinc-50">schoolNG</h2>
              <p class="text-[9px] text-zinc-400 font-normal tracking-wide mt-0.5">Console</p>
            </div>
          }
        </div>
        
        <!-- Navigation Section -->
        <div class="mb-6">
          <p class="text-[9px] font-medium text-zinc-400 dark:text-zinc-500 mb-3 px-3 overflow-hidden text-ellipsis whitespace-nowrap uppercase tracking-wider">
            {{ state.isCollapsed() ? '•••' : 'Main Menu' }}
          </p>
          <nav class="space-y-1">
            
            <!-- Dashboard -->
            <button 
              routerLink="/dashboard"
              [class]="isActive('/dashboard') ? (state.isDark() ? 'bg-zinc-900 text-zinc-50 font-medium' : 'bg-zinc-100 text-zinc-950 font-medium') : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'" 
              class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden font-normal clickable-scale"
              [class.justify-center]="state.isCollapsed()"
              [class.gap-3]="!state.isCollapsed()"
              [class.px-2]="state.isCollapsed()"
              [class.px-3]="!state.isCollapsed()">
              <!-- Lucide: layout-dashboard -->
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400 shrink-0"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="10" rx="1"/><rect width="7" height="5" x="3" y="14" rx="1"/></svg>
              @if (!state.isCollapsed()) {
                <span class="animate-fade-in whitespace-nowrap">Dashboard</span>
              }
            </button>

            <!-- Classes -->
            <button 
              routerLink="/classes"
              [class]="isActive('/classes') ? (state.isDark() ? 'bg-zinc-900 text-zinc-50 font-medium' : 'bg-zinc-100 text-zinc-955 font-medium') : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'" 
              class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden font-normal clickable-scale"
              [class.justify-center]="state.isCollapsed()"
              [class.gap-3]="!state.isCollapsed()"
              [class.px-2]="state.isCollapsed()"
              [class.px-3]="!state.isCollapsed()">
              <!-- Lucide: school -->
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400 shrink-0"><path d="m4 6 8-4 8 4M18 10v7M6 10v7m3-7v7m6-7v7M2 22h20M12 22v-4M8 12h8"/></svg>
              @if (!state.isCollapsed()) {
                <span class="animate-fade-in whitespace-nowrap">Classes</span>
              }
            </button>

            <!-- Students -->
            <button 
              routerLink="/students"
              [class]="isActive('/students') ? (state.isDark() ? 'bg-zinc-900 text-zinc-50 font-medium' : 'bg-zinc-100 text-zinc-955 font-medium') : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'" 
              class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden font-normal clickable-scale"
              [class.justify-center]="state.isCollapsed()"
              [class.gap-3]="!state.isCollapsed()"
              [class.px-2]="state.isCollapsed()"
              [class.px-3]="!state.isCollapsed()">
              <!-- Lucide: users -->
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400 shrink-0"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              @if (!state.isCollapsed()) {
                <span class="animate-fade-in whitespace-nowrap">Students</span>
              }
            </button>

            <!-- Teachers -->
            <button 
              routerLink="/teachers"
              [class]="isActive('/teachers') ? (state.isDark() ? 'bg-zinc-900 text-zinc-50 font-medium' : 'bg-zinc-100 text-zinc-955 font-medium') : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'" 
              class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden font-normal clickable-scale"
              [class.justify-center]="state.isCollapsed()"
              [class.gap-3]="!state.isCollapsed()"
              [class.px-2]="state.isCollapsed()"
              [class.px-3]="!state.isCollapsed()">
              <!-- Lucide: graduation-cap -->
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400 shrink-0"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
              @if (!state.isCollapsed()) {
                <span class="animate-fade-in whitespace-nowrap">Teachers</span>
              }
            </button>

            <!-- Settings -->
            <button 
              routerLink="/settings"
              [class]="isActive('/settings') ? (state.isDark() ? 'bg-zinc-900 text-zinc-50 font-medium' : 'bg-zinc-100 text-zinc-955 font-medium') : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'" 
              class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden font-normal clickable-scale"
              [class.justify-center]="state.isCollapsed()"
              [class.gap-3]="!state.isCollapsed()"
              [class.px-2]="state.isCollapsed()"
              [class.px-3]="!state.isCollapsed()">
              <!-- Lucide: settings -->
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400 shrink-0"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
              @if (!state.isCollapsed()) {
                <span class="animate-fade-in whitespace-nowrap">Settings</span>
              }
            </button>

          </nav>
        </div>

        <!-- Grade Groups / Cohorts List -->
        <div>
          <p class="text-[9px] font-medium text-zinc-400 dark:text-zinc-500 mb-3 px-3 overflow-hidden text-ellipsis whitespace-nowrap uppercase tracking-wider">
            {{ state.isCollapsed() ? '•••' : 'Active Cohorts' }}
          </p>
          <div class="space-y-1 px-1">
            @for (cohort of cohorts; track cohort.name) {
              <button class="w-full flex items-center py-1.5 rounded-lg text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-all text-left overflow-hidden clickable-scale"
                [class.justify-center]="state.isCollapsed()"
                [class.gap-3]="!state.isCollapsed()"
                [class.px-2]="state.isCollapsed()"
                [class.px-3]="!state.isCollapsed()">
                <!-- Monochrome clean grey indicators instead of bright gradients -->
                <span class="w-2 h-2 rounded-full shrink-0 bg-zinc-300 dark:bg-zinc-800 border border-zinc-400/20 dark:border-zinc-700/30"></span>
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
            [class]="state.isDark() ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-800'"
            class="absolute bottom-full left-0 mb-2 w-64 border rounded-xl p-1.5 z-50 shadow-md animate-fade-in select-none">
            
            <!-- User Profile Header -->
            <div class="flex items-center gap-2.5 p-2.5 pb-3 border-b" [class]="state.isDark() ? 'border-zinc-800' : 'border-zinc-100'">
              <div class="w-8 h-8 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shrink-0 flex items-center justify-center text-zinc-800 dark:text-zinc-200 text-xs font-medium">
                AD
              </div>
              <div class="text-left overflow-hidden">
                <p class="text-xs font-medium leading-tight text-zinc-900 dark:text-zinc-50 truncate">admin_schoolng</p>
                <p class="text-[9px] text-zinc-400 truncate mt-0.5">registrar&#64;schoolng.edu</p>
              </div>
            </div>

            <!-- Options Group -->
            <div class="py-1">
              <!-- Settings Link -->
              <button routerLink="/settings" (click)="isUserDropdownOpen.set(false)" class="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-normal hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer text-left clickable-scale">
                <div class="flex items-center gap-2.5">
                  <!-- Lucide: settings -->
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400 shrink-0"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                  <span>Global Settings</span>
                </div>
                <span class="text-[9px] text-zinc-400 font-mono tracking-wider">⇧⌘,</span>
              </button>
            </div>

            <!-- Divider -->
            <div class="h-px my-1" [class]="state.isDark() ? 'bg-zinc-800' : 'bg-zinc-100'"></div>

            <!-- Appearance options -->
            <div class="py-1">
              <div class="relative group/appearance w-full">
                <button class="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-normal hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer text-left clickable-scale">
                  <div class="flex items-center gap-2.5">
                    <!-- Lucide: sun -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400 shrink-0"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
                    <div class="flex flex-col text-left">
                      <span>Appearance</span>
                      <span class="text-[9px] text-zinc-400 font-normal mt-0.5">{{ getActiveThemeName() }}</span>
                    </div>
                  </div>
                  <!-- Lucide: chevron-right -->
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400"><path d="m9 18 6-6-6-6"/></svg>
                </button>

                <!-- Flyout Menu container -->
                <div class="absolute left-full bottom-0 pl-2 w-32 z-55 opacity-0 pointer-events-none group-hover/appearance:opacity-100 group-hover/appearance:pointer-events-auto transition-all duration-150">
                  <div [class]="state.isDark() ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-800'" class="border rounded-xl p-1.5 shadow-lg flex flex-col gap-1">
                    <button (click)="selectTheme('light')" class="w-full text-left px-2 py-1.5 rounded-lg text-xs font-normal cursor-pointer hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 transition-all clickable-scale">Light</button>
                    <button (click)="selectTheme('dark')" class="w-full text-left px-2 py-1.5 rounded-lg text-xs font-normal cursor-pointer hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 transition-all clickable-scale">Dark</button>
                    <button (click)="selectTheme('system')" class="w-full text-left px-2 py-1.5 rounded-lg text-xs font-normal cursor-pointer hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 transition-all clickable-scale">System</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Divider -->
            <div class="h-px my-1" [class]="state.isDark() ? 'bg-zinc-800' : 'bg-zinc-100'"></div>

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
          [class]="state.isDark() ? 'hover:bg-zinc-900 hover:border-zinc-800 text-zinc-200' : 'hover:bg-zinc-50 hover:border-zinc-200 text-zinc-800'"
          class="w-full flex items-center p-2 rounded-xl border border-transparent transition-all cursor-pointer select-none clickable-scale"
          [class.justify-center]="state.isCollapsed()"
          [class.justify-between]="!state.isCollapsed()"
          [class.p-1]="state.isCollapsed()"
          [class.p-2]="!state.isCollapsed()">
          <div class="flex items-center overflow-hidden shrink-0" [class.gap-2]="!state.isCollapsed()">
            <div class="w-7 h-7 rounded-full overflow-hidden border border-zinc-250 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 shrink-0 relative flex items-center justify-center text-[10px] font-medium uppercase">
              AD
            </div>
            @if (!state.isCollapsed()) {
              <div class="text-left animate-fade-in shrink-0">
                <p class="text-[10px] font-medium leading-tight truncate max-w-30">admin_schoolng</p>
                <p class="text-[8px] text-zinc-400 font-normal truncate max-w-30">registrar&#64;schoolng.edu</p>
              </div>
            }
          </div>
          @if (!state.isCollapsed()) {
            <!-- Lucide: chevron-right (rotated to top/down icon indicator) -->
            <svg class="w-3.5 h-3.5 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
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
    { name: 'Grade 9 (Freshmen)' },
    { name: 'Grade 10 (Sophomores)' },
    { name: 'Grade 11 (Juniors)' },
    { name: 'Grade 12 (Seniors)' }
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
