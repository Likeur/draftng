import { Component, inject, signal, ElementRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ClinicService } from '../services/clinic.service';

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
      [class.-translate-x-full]="state.isCollapsed()"
      [class.translate-x-0]="!state.isCollapsed()"
      class="fixed md:sticky left-0 top-0 bottom-0 z-50 md:z-45 h-screen bg-theme-panel border-r border-theme-border flex flex-col justify-between shrink-0 transition-all duration-200 font-sans select-none md:translate-x-0">
      
      <div>
        <!-- Top Branding -->
        <div class="flex items-center gap-2.5 overflow-hidden h-10 mb-6" [class.justify-center]="state.isCollapsed()">
          <!-- Medical cross logo -->
          <svg class="shrink-0 w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="2" width="8" height="20" rx="2" class="fill-emerald-500"/>
            <rect x="2" y="8" width="20" height="8" rx="2" class="fill-emerald-500"/>
          </svg>
          @if (!state.isCollapsed()) {
            <div class="animate-fade-in shrink-0 leading-none">
              <h2 class="font-medium text-sm tracking-tight text-theme-text-main">clinicNG</h2>
            </div>
          }
        </div>
        
        <!-- Navigation Section -->
        <div class="mb-5">
          <p class="text-[9px] font-medium text-theme-text-muted mb-2 px-3 overflow-hidden text-ellipsis whitespace-nowrap capitalize tracking-wider">
            {{ state.isCollapsed() ? '•••' : 'Main menu' }}
          </p>
          <nav class="space-y-0.5">
            
            <!-- Dashboard -->
            <button 
              routerLink="/dashboard"
              [class]="isActive('/dashboard') ? 'bg-theme-hover text-theme-text-main font-medium' : 'text-theme-text-muted hover:text-theme-text-main hover:bg-theme-hover'" 
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

            <!-- Patients -->
            <button 
              routerLink="/patients"
              [class]="isActive('/patients') ? 'bg-theme-hover text-theme-text-main font-medium' : 'text-theme-text-muted hover:text-theme-text-main hover:bg-theme-hover'" 
              class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden font-normal clickable-scale"
              [class.justify-center]="state.isCollapsed()"
              [class.gap-3]="!state.isCollapsed()"
              [class.px-2]="state.isCollapsed()"
              [class.px-3]="!state.isCollapsed()">
              <!-- Lucide: users -->
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              @if (!state.isCollapsed()) {
                <span class="animate-fade-in whitespace-nowrap">Patients</span>
              }
            </button>

            <!-- Appointments -->
            <button 
              routerLink="/appointments"
              [class]="isActive('/appointments') ? 'bg-theme-hover text-theme-text-main font-medium' : 'text-theme-text-muted hover:text-theme-text-main hover:bg-theme-hover'" 
              class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden font-normal clickable-scale"
              [class.justify-center]="state.isCollapsed()"
              [class.gap-3]="!state.isCollapsed()"
              [class.px-2]="state.isCollapsed()"
              [class.px-3]="!state.isCollapsed()">
              <!-- Lucide: calendar-clock -->
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h5"/><path d="M17.5 17.5 16 16.3V14"/><circle cx="16" cy="16" r="6"/></svg>
              @if (!state.isCollapsed()) {
                <span class="animate-fade-in whitespace-nowrap">Appointments</span>
              }
            </button>

            <!-- Settings (placeholder) -->
            <button 
              [class]="'text-theme-text-muted hover:text-theme-text-main hover:bg-theme-hover'" 
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

        <!-- Departments -->
        <div>
          <p class="text-[9px] font-medium text-theme-text-muted mb-2 px-3 overflow-hidden text-ellipsis whitespace-nowrap capitalize tracking-wider">
            {{ state.isCollapsed() ? '•••' : 'Departments' }}
          </p>
          <div class="space-y-0.5 px-1">
            @for (dept of departments; track dept.name) {
              <button class="w-full flex items-center py-1.5 rounded-lg text-xs text-theme-text-muted hover:text-theme-text-main hover:bg-theme-hover transition-all text-left overflow-hidden clickable-scale"
                [class.justify-center]="state.isCollapsed()"
                [class.gap-3]="!state.isCollapsed()"
                [class.px-2]="state.isCollapsed()"
                [class.px-3]="!state.isCollapsed()">
                <span [class]="dept.color" class="w-2 h-2 rounded-full shrink-0 border border-theme-border"></span>
                @if (!state.isCollapsed()) {
                  <span class="animate-fade-in truncate font-normal text-theme-text-muted">{{ dept.name }}</span>
                }
              </button>
            }
          </div>
        </div>

      </div>

      <!-- User Options Bottom Section -->
      <div class="relative" id="user-menu-container">
        <!-- Dropdown Menu -->
        <div 
          [class.opacity-100]="isUserDropdownOpen()"
          [class.pointer-events-auto]="isUserDropdownOpen()"
          [class.scale-100]="isUserDropdownOpen()"
          [class.translate-y-0]="isUserDropdownOpen()"
          [class.opacity-0]="!isUserDropdownOpen()"
          [class.pointer-events-none]="!isUserDropdownOpen()"
          [class.scale-95]="!isUserDropdownOpen()"
          [class.translate-y-2]="!isUserDropdownOpen()"
          class="absolute bottom-full left-0 mb-2 w-64 bg-theme-panel border border-theme-border text-theme-text-main rounded-xl p-1.5 z-50 shadow-md transition-all duration-200 ease-out origin-bottom-left transform select-none">
          
          <!-- User Profile Header -->
          <div class="flex items-center gap-2.5 p-2.5 pb-3 border-b border-theme-border">
            <div class="profile-mesh-avatar w-8 h-8 rounded-full border border-theme-border shrink-0"></div>
            <div class="text-left overflow-hidden">
              <p class="text-xs font-medium leading-tight text-theme-text-main truncate">Dr. Sarah Chen</p>
              <p class="text-[9px] text-theme-text-muted truncate mt-0.5">admin&#64;clinicng.health</p>
            </div>
          </div>

          <!-- Appearance Options -->
          <div class="py-1">
            <div class="relative group/appearance w-full">
              <button class="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-theme-text-muted hover:text-theme-text-main transition-all cursor-pointer text-left clickable-scale">
                <div class="flex items-center gap-2.5">
                  <!-- Lucide: sun -->
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
                  <div class="flex flex-col text-left">
                    <span>Appearance</span>
                    <span class="text-[9px] text-theme-text-muted font-normal mt-0.5">{{ getActiveThemeName() }}</span>
                  </div>
                </div>
                <!-- Lucide: chevron-right -->
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 text-theme-text-muted"><path d="m9 18 6-6-6-6"/></svg>
              </button>

              <!-- Flyout Menu -->
              <div class="absolute left-full bottom-0 pl-2 w-32 z-55 opacity-0 pointer-events-none group-hover/appearance:opacity-100 group-hover/appearance:pointer-events-auto transition-all duration-150">
                <div class="bg-theme-panel border border-theme-border rounded-xl p-1.5 shadow-lg flex flex-col gap-1 text-theme-text-main animate-fade-in">
                  <button (click)="selectTheme('light')" class="w-full text-left px-2 py-1.5 rounded-lg text-xs font-normal cursor-pointer hover:bg-theme-hover transition-all clickable-scale font-medium">Light</button>
                  <button (click)="selectTheme('dark')" class="w-full text-left px-2 py-1.5 rounded-lg text-xs font-normal cursor-pointer hover:bg-theme-hover transition-all clickable-scale font-medium">Dark</button>
                  <button (click)="selectTheme('system')" class="w-full text-left px-2 py-1.5 rounded-lg text-xs font-normal cursor-pointer hover:bg-theme-hover transition-all clickable-scale font-medium">System</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="h-px my-1 bg-theme-border"></div>

          <div class="py-1">
            <button (click)="onOption('Log Out')" class="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-normal transition-all cursor-pointer text-left clickable-scale text-red-500 hover:bg-red-500/10">
              <!-- Lucide: log-out -->
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-400 shrink-0"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/></svg>
              <span>Log Out</span>
            </button>
          </div>

        </div>

        <!-- Toggle Button -->
        <button 
          (click)="toggleUserDropdown()"
          class="w-full flex items-center bg-transparent hover:bg-theme-hover border border-transparent hover:border-theme-border rounded-xl transition-all cursor-pointer select-none clickable-scale"
          [class.justify-center]="state.isCollapsed()"
          [class.justify-between]="!state.isCollapsed()"
          [class.p-1]="state.isCollapsed()"
          [class.p-2]="!state.isCollapsed()">
          <div class="flex items-center overflow-hidden shrink-0" [class.gap-2]="!state.isCollapsed()">
            <div class="profile-mesh-avatar w-7 h-7 rounded-full border border-theme-border shrink-0"></div>
            @if (!state.isCollapsed()) {
              <div class="text-left animate-fade-in shrink-0">
                <p class="text-[10px] font-medium leading-tight text-theme-text-main truncate max-w-30">Dr. Sarah Chen</p>
                <p class="text-[8px] text-theme-text-muted font-normal truncate max-w-30">admin&#64;clinicng.health</p>
              </div>
            }
          </div>
          @if (!state.isCollapsed()) {
            <svg class="w-3.5 h-3.5 text-theme-text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          }
        </button>
      </div>

    </aside>
  `
})
export class SidebarComponent {
  protected readonly state = inject(ClinicService);
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef);

  protected readonly isUserDropdownOpen = signal(false);

  protected readonly departments = [
    { name: 'Cardiology', color: 'bg-rose-500' },
    { name: 'Neurology', color: 'bg-indigo-500' },
    { name: 'Orthopedics', color: 'bg-amber-500' },
    { name: 'Pediatrics', color: 'bg-emerald-500' }
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
      if (window.innerWidth < 768 && !this.state.isCollapsed()) {
        this.state.setSidebarCollapsed(true);
      }
    }
  }
}
