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
      [class]="(state.isDark() ? 'bg-zinc-950 border-zinc-900' : 'bg-zinc-100 border-zinc-200') + (state.isCollapsed() ? ' -translate-x-full md:translate-x-0 md:w-14 md:p-2' : ' translate-x-0 md:w-52 md:p-4')" 
      class="fixed md:sticky left-0 top-0 bottom-0 z-50 md:z-45 h-screen border-r flex flex-col justify-between shrink-0 transition-all duration-300 w-52 p-4 font-sans">
      
      <div>
        <!-- Top Branding -->
        <div class="flex items-center gap-2.5 overflow-hidden h-10 mb-8 select-none" [class.justify-center]="state.isCollapsed()">
          <!-- Vercel-style clean geometric school logo -->
          <svg class="shrink-0 select-none w-7 h-7" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="50,10 90,80 10,80" [class]="state.isDark() ? 'fill-zinc-50' : 'fill-zinc-955'"/>
            <polygon points="50,40 70,80 30,80" class="fill-zinc-950 dark:fill-zinc-900"/>
          </svg>
          @if (!state.isCollapsed()) {
            <div class="animate-fade-in shrink-0 select-none leading-none">
              <h2 class="font-display font-black text-sm tracking-tight leading-none text-zinc-950 dark:text-zinc-50">schoolNG</h2>
              <p class="text-[8px] text-zinc-400 font-semibold tracking-wider uppercase mt-1">Management</p>
            </div>
          }
        </div>
        
        <!-- Navigation Section -->
        <div class="mb-6">
          <p class="text-[9px] font-bold text-zinc-400 mb-3 px-3 overflow-hidden text-ellipsis whitespace-nowrap select-none">
            {{ state.isCollapsed() ? '•••' : 'Main Menu' }}
          </p>
          <nav class="space-y-1">
            
            <!-- Dashboard -->
            <button 
              routerLink="/dashboard"
              [class]="isActive('/dashboard') ? (state.isDark() ? 'bg-zinc-900 text-zinc-50 font-bold' : 'bg-zinc-200 text-zinc-900 font-bold') : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-150/40 dark:hover:bg-zinc-900/50'" 
              class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden clickable-scale"
              [class.justify-center]="state.isCollapsed()"
              [class.gap-3]="!state.isCollapsed()"
              [class.px-2]="state.isCollapsed()"
              [class.px-3]="!state.isCollapsed()">
              <svg class="w-4 h-4 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
              </svg>
              @if (!state.isCollapsed()) {
                <span class="animate-fade-in whitespace-nowrap">Dashboard</span>
              }
            </button>

            <!-- Classes -->
            <button 
              routerLink="/classes"
              [class]="isActive('/classes') ? (state.isDark() ? 'bg-zinc-900 text-zinc-50 font-bold' : 'bg-zinc-200 text-zinc-900 font-bold') : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-155/40 dark:hover:bg-zinc-900/50'" 
              class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden clickable-scale"
              [class.justify-center]="state.isCollapsed()"
              [class.gap-3]="!state.isCollapsed()"
              [class.px-2]="state.isCollapsed()"
              [class.px-3]="!state.isCollapsed()">
              <svg class="w-4 h-4 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.33l-7.5-5-7.5 5V21" />
              </svg>
              @if (!state.isCollapsed()) {
                <span class="animate-fade-in whitespace-nowrap">Classes</span>
              }
            </button>

            <!-- Students -->
            <button 
              routerLink="/students"
              [class]="isActive('/students') ? (state.isDark() ? 'bg-zinc-900 text-zinc-50 font-bold' : 'bg-zinc-200 text-zinc-900 font-bold') : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-155/40 dark:hover:bg-zinc-900/50'" 
              class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden clickable-scale"
              [class.justify-center]="state.isCollapsed()"
              [class.gap-3]="!state.isCollapsed()"
              [class.px-2]="state.isCollapsed()"
              [class.px-3]="!state.isCollapsed()">
              <svg class="w-4 h-4 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              @if (!state.isCollapsed()) {
                <span class="animate-fade-in whitespace-nowrap">Students</span>
              }
            </button>

            <!-- Teachers -->
            <button 
              routerLink="/teachers"
              [class]="isActive('/teachers') ? (state.isDark() ? 'bg-zinc-900 text-zinc-50 font-bold' : 'bg-zinc-200 text-zinc-900 font-bold') : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-155/40 dark:hover:bg-zinc-900/50'" 
              class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden clickable-scale"
              [class.justify-center]="state.isCollapsed()"
              [class.gap-3]="!state.isCollapsed()"
              [class.px-2]="state.isCollapsed()"
              [class.px-3]="!state.isCollapsed()">
              <svg class="w-4 h-4 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M12 13.489v6.528m-6.42-6.528A47.95 47.95 0 0 0 12 20.06a47.948 47.948 0 0 0 6.42-6.571M12 3.493v.01" />
              </svg>
              @if (!state.isCollapsed()) {
                <span class="animate-fade-in whitespace-nowrap">Teachers</span>
              }
            </button>

            <!-- Settings -->
            <button 
              routerLink="/settings"
              [class]="isActive('/settings') ? (state.isDark() ? 'bg-zinc-900 text-zinc-50 font-bold' : 'bg-zinc-200 text-zinc-900 font-bold') : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-155/40 dark:hover:bg-zinc-900/50'" 
              class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden clickable-scale"
              [class.justify-center]="state.isCollapsed()"
              [class.gap-3]="!state.isCollapsed()"
              [class.px-2]="state.isCollapsed()"
              [class.px-3]="!state.isCollapsed()">
              <svg class="w-4 h-4 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              @if (!state.isCollapsed()) {
                <span class="animate-fade-in whitespace-nowrap">Settings</span>
              }
            </button>

          </nav>
        </div>

        <!-- Grade Groups / Cohorts List -->
        <div>
          <p class="text-[9px] font-bold text-zinc-400 mb-3 px-3 overflow-hidden text-ellipsis whitespace-nowrap select-none">
            {{ state.isCollapsed() ? '•••' : 'Active Cohorts' }}
          </p>
          <div class="space-y-1 px-1">
            @for (cohort of cohorts; track cohort.name) {
              <button class="w-full flex items-center py-2 rounded-lg text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-150/40 dark:hover:bg-zinc-900/50 transition-all text-left overflow-hidden clickable-scale"
                [class.justify-center]="state.isCollapsed()"
                [class.gap-3]="!state.isCollapsed()"
                [class.px-2]="state.isCollapsed()"
                [class.px-3]="!state.isCollapsed()">
                <span [class]="cohort.gradient" class="w-2.5 h-2.5 rounded-full shrink-0 border border-zinc-200/50 dark:border-zinc-800/50 shadow-none"></span>
                @if (!state.isCollapsed()) {
                  <span class="animate-fade-in truncate font-medium">{{ cohort.name }}</span>
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
            class="absolute bottom-full left-0 mb-2 w-64 border rounded-2xl p-1.5 z-50 shadow-lg animate-fade-in select-none">
            
            <!-- User Profile Header -->
            <div class="flex items-center gap-2.5 p-2.5 pb-3 border-b" [class]="state.isDark() ? 'border-zinc-800' : 'border-zinc-100'">
              <div class="w-9 h-9 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 shrink-0 flex items-center justify-center avatar-grad-1">
                <span class="text-xs font-bold text-white uppercase select-none">AD</span>
              </div>
              <div class="text-left overflow-hidden">
                <p class="text-xs font-bold leading-tight text-zinc-900 dark:text-zinc-50 truncate">admin_schoolng</p>
                <p class="text-[9px] text-zinc-400 truncate mt-0.5">registrar&#64;schoolng.edu</p>
              </div>
            </div>

            <!-- Options Group -->
            <div class="py-1">
              <!-- Settings Link -->
              <button routerLink="/settings" (click)="isUserDropdownOpen.set(false)" class="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer text-left clickable-scale">
                <div class="flex items-center gap-2.5">
                  <svg class="w-4 h-4 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                  </svg>
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
                <button class="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer text-left clickable-scale">
                  <div class="flex items-center gap-2.5">
                    <svg class="w-4 h-4 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m0 13.5V21m8.94-8.94h-2.25M4.122 12h-2.25m15.364-6.364-1.591 1.591M6.346 17.654l-1.591 1.591m0-12.728 1.591 1.591m12.728 12.728-1.591-1.591M12 18.75a6.75 6.75 0 1 0 0-13.5 6.75 6.75 0 0 0 0 13.5Z" />
                    </svg>
                    <div class="flex flex-col text-left">
                      <span>Appearance</span>
                      <span class="text-[9px] text-zinc-400 font-semibold mt-0.5">{{ getActiveThemeName() }}</span>
                    </div>
                  </div>
                  <svg class="w-3 h-3 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <!-- Flyout Menu container -->
                <div class="absolute left-full bottom-0 pl-2 w-32 z-55 opacity-0 pointer-events-none group-hover/appearance:opacity-100 group-hover/appearance:pointer-events-auto transition-all duration-200">
                  <div [class]="state.isDark() ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-800'" class="border rounded-xl p-1.5 shadow-lg flex flex-col gap-1">
                    <button (click)="selectTheme('light')" class="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold cursor-pointer hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 transition-all clickable-scale">Light</button>
                    <button (click)="selectTheme('dark')" class="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold cursor-pointer hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 transition-all clickable-scale">Dark</button>
                    <button (click)="selectTheme('system')" class="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold cursor-pointer hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 transition-all clickable-scale">System</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Divider -->
            <div class="h-px my-1" [class]="state.isDark() ? 'bg-zinc-800' : 'bg-zinc-100'"></div>

            <div class="py-1">
              <button (click)="onOption('Log Out')" class="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer text-left clickable-scale text-red-500 hover:bg-red-50 dark:hover:bg-red-955/20">
                <svg class="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                </svg>
                <span>Log Out</span>
              </button>
            </div>

          </div>
        }

        <!-- Toggle Button -->
        <button 
          (click)="toggleUserDropdown()"
          [class]="state.isDark() ? 'hover:bg-zinc-900 hover:border-zinc-850 text-zinc-200' : 'hover:bg-zinc-50 hover:border-zinc-200 text-zinc-800'"
          class="w-full flex items-center p-2 rounded-xl border border-transparent transition-all cursor-pointer select-none clickable-scale"
          [class.justify-center]="state.isCollapsed()"
          [class.justify-between]="!state.isCollapsed()"
          [class.p-1]="state.isCollapsed()"
          [class.p-2]="!state.isCollapsed()">
          <div class="flex items-center overflow-hidden shrink-0" [class.gap-2]="!state.isCollapsed()">
            <div class="w-7 h-7 rounded-full overflow-hidden border border-zinc-300 dark:border-zinc-700 bg-zinc-200 shrink-0 relative flex items-center justify-center avatar-grad-1 text-white text-[9px] font-extrabold uppercase">
              AD
            </div>
            @if (!state.isCollapsed()) {
              <div class="text-left animate-fade-in shrink-0">
                <p class="text-[10px] font-bold leading-tight truncate max-w-30">admin_schoolng</p>
                <p class="text-[8px] text-zinc-400 font-semibold truncate max-w-30">registrar&#64;schoolng.edu</p>
              </div>
            }
          </div>
          @if (!state.isCollapsed()) {
            <svg class="w-3.5 h-3.5 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
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
    { name: 'Grade 9 (Freshmen)', gradient: 'avatar-grad-1' },
    { name: 'Grade 10 (Sophomores)', gradient: 'avatar-grad-2' },
    { name: 'Grade 11 (Juniors)', gradient: 'avatar-grad-3' },
    { name: 'Grade 12 (Seniors)', gradient: 'avatar-grad-4' }
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
