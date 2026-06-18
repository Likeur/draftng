import { Component, input, output, signal, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  template: `
    <aside 
      [class]="(isDark() ? 'bg-zinc-900 border-zinc-850' : 'bg-zinc-100 border-zinc-200') + (isCollapsed() ? ' -translate-x-full md:translate-x-0 md:w-14 md:p-2' : ' translate-x-0 md:w-52 md:p-4')" 
      class="fixed md:sticky left-0 top-0 bottom-0 z-50 md:z-45 h-screen border-r flex flex-col justify-between shrink-0 transition-all duration-300 w-52 p-4">
      
      <!-- Top Branding (SVG Logo) -->
      <div>
        <div class="flex items-center gap-3 overflow-hidden h-10 mb-8 select-none" [class.justify-center]="isCollapsed()">
          <!-- Provided platform logo with dynamic fill -->
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 80 80" fill="none" id="Logo" class="shrink-0 select-none">
            <g id="logomark" [class]="isDark() ? 'fill-zinc-50' : 'fill-zinc-950'">
              <path d="M44.0502 64.2231C44.122 56.8802 42.2604 50.909 39.8924 50.8858C37.5243 50.8628 35.5463 56.7965 35.4747 64.1393C35.4028 71.4821 37.2644 77.4535 39.6324 77.4765C42.0006 77.4997 43.9785 71.566 44.0502 64.2231Z"/>
              <path d="M30.3144 62.5555C34.345 56.4173 36.0075 50.3875 34.028 49.0877C32.0483 47.7878 27.1762 51.7101 23.1458 57.8483C19.1152 63.9865 17.4526 70.0161 19.4322 71.3161C21.4118 72.616 26.2838 68.6937 30.3144 62.5555Z"/>
              <path d="M19.6459 53.7487C26.3554 50.7644 31.0141 46.591 30.0515 44.4271C29.0891 42.2633 22.8699 42.9286 16.1605 45.913C9.45113 48.8974 4.79236 53.0708 5.75484 55.2346C6.71731 57.3985 12.9366 56.7332 19.6459 53.7487Z"/>
              <path d="M29.2462 38.359C29.6065 36.0183 24.015 33.2153 16.7574 32.0982C9.49958 30.9811 3.324 31.9731 2.96374 34.3137C2.60348 36.6543 8.19497 39.4572 15.4527 40.5743C22.7103 41.6915 28.886 40.6995 29.2462 38.359Z"/>
              <path d="M31.8522 32.7834C33.4205 31.009 30.2314 25.6283 24.7291 20.7655C19.2269 15.9026 13.4951 13.399 11.9268 15.1735C10.3585 16.948 13.5476 22.3287 19.0499 27.1915C24.5522 32.0544 30.284 34.5579 31.8522 32.7834Z"/>
              <path d="M37.043 29.5246C39.3217 28.8798 39.5481 22.6291 37.5487 15.5634C35.5494 8.49766 32.0812 3.29248 29.8025 3.93729C27.5238 4.58211 27.2974 10.8327 29.2967 17.8985C31.2961 24.9641 34.7642 30.1694 37.043 29.5246Z"/>
              <path d="M51.1336 18.1184C53.272 11.0935 53.1689 4.83958 50.9033 4.14996C48.6377 3.46033 45.0676 8.59611 42.9292 15.6211C40.791 22.6459 40.894 28.8999 43.1596 29.5895C45.4252 30.2791 48.9953 25.1434 51.1336 18.1184Z"/>
              <path d="M61.2032 27.6106C66.7995 22.8562 70.0933 17.539 68.5598 15.7342C67.0265 13.9294 61.2469 16.3206 55.6507 21.0748C50.0544 25.8292 46.7608 31.1465 48.2941 32.9513C49.8273 34.7561 55.607 32.365 61.2032 27.6106Z"/>
              <path d="M64.5312 41.0431C71.8096 40.0693 77.4552 37.3772 77.1411 35.0298C76.8272 32.6826 70.6723 31.5692 63.3939 32.5428C56.1157 33.5165 50.4699 36.2087 50.784 38.556C51.0981 40.9032 57.2528 42.0168 64.5312 41.0431Z"/>
              <path d="M73.9204 55.9056C74.9254 53.7612 70.3499 49.4968 63.7006 46.3806C57.0515 43.2644 50.8465 42.4768 49.8415 44.6211C48.8366 46.7656 53.4121 51.03 60.0614 54.1462C66.7105 57.2622 72.9155 58.05 73.9204 55.9056Z"/>
              <path d="M59.9333 71.728C61.9381 70.4675 60.3947 64.4061 56.4861 58.1896C52.5774 51.9731 47.7835 47.9557 45.7787 49.2162C43.7739 50.4767 45.3173 56.5381 49.2259 62.7546C53.1346 68.9711 57.9285 72.9887 59.9333 71.728Z"/>
            </g>
          </svg>
          @if (!isCollapsed()) {
            <div class="animate-fade-in shrink-0 select-none">
              <h2 class="font-display font-black text-sm tracking-tight leading-none">projectNG</h2>
              <p class="text-[9px] text-zinc-400 mt-1 font-semibold">Workspace Console</p>
            </div>
          }
        </div>
        
        <!-- Navigation Section -->
        <div class="mb-6">
          <p class="text-[9px] font-bold text-zinc-400 mb-3 px-3 overflow-hidden text-ellipsis whitespace-nowrap select-none">
            {{ isCollapsed() ? '•••' : 'Main Menu' }}
          </p>
          <nav class="space-y-1">
            
            <!-- Dashboard -->
            <button 
              (click)="selectNav('Dashboard')" 
              [class]="activeNav() === 'Dashboard' ? (isDark() ? 'bg-zinc-800/60 text-zinc-50 font-bold' : 'bg-zinc-200 text-zinc-900 font-bold') : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30'" 
              class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden clickable-scale"
              [class.justify-center]="isCollapsed()"
              [class.gap-3]="!isCollapsed()"
              [class.px-2]="isCollapsed()"
              [class.px-3]="!isCollapsed()">
              <svg class="w-4 h-4 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
              </svg>
              @if (!isCollapsed()) {
                <span class="animate-fade-in whitespace-nowrap">Dashboard</span>
              }
            </button>

            <!-- Inbox Route with Badge -->
            <button 
              (click)="selectNav('Inbox')" 
              [class]="activeNav() === 'Inbox' ? (isDark() ? 'bg-zinc-800/60 text-zinc-50 font-bold' : 'bg-zinc-200 text-zinc-900 font-bold') : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30'" 
              class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer overflow-hidden clickable-scale relative"
              [class.justify-center]="isCollapsed()"
              [class.justify-between]="!isCollapsed()"
              [class.px-2]="isCollapsed()"
              [class.px-3]="!isCollapsed()">
              <div class="flex items-center animate-fade-in" [class.gap-3]="!isCollapsed()">
                <svg class="w-4 h-4 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
                </svg>
                @if (!isCollapsed()) {
                  <span class="animate-fade-in whitespace-nowrap font-semibold">Inbox</span>
                }
              </div>
              @if (!isCollapsed()) {
                <span class="text-[9px] bg-teal-500/10 text-teal-500 px-1.5 py-0.5 rounded-full font-bold">3</span>
              } @else {
                <span class="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
              }
            </button>

            <!-- Projects -->
            <button 
              (click)="selectNav('Projects')" 
              [class]="activeNav() === 'Projects' ? (isDark() ? 'bg-zinc-800/60 text-zinc-50 font-bold' : 'bg-zinc-200 text-zinc-900 font-bold') : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30'" 
              class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden clickable-scale"
              [class.justify-center]="isCollapsed()"
              [class.gap-3]="!isCollapsed()"
              [class.px-2]="isCollapsed()"
              [class.px-3]="!isCollapsed()">
              <svg class="w-4 h-4 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
              </svg>
              @if (!isCollapsed()) {
                <span class="animate-fade-in whitespace-nowrap">Projects</span>
              }
            </button>

            <!-- Todos Route -->
            <button 
              (click)="selectNav('Todos')" 
              [class]="activeNav() === 'Todos' ? (isDark() ? 'bg-zinc-800/60 text-zinc-50 font-bold' : 'bg-zinc-200 text-zinc-900 font-bold') : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30'" 
              class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden clickable-scale"
              [class.justify-center]="isCollapsed()"
              [class.gap-3]="!isCollapsed()"
              [class.px-2]="isCollapsed()"
              [class.px-3]="!isCollapsed()">
              <svg class="w-4 h-4 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              @if (!isCollapsed()) {
                <span class="animate-fade-in whitespace-nowrap">Todos</span>
              }
            </button>

            <!-- Calendar -->
            <button 
              (click)="selectNav('Calendar')" 
              [class]="activeNav() === 'Calendar' ? (isDark() ? 'bg-zinc-800/60 text-zinc-50 font-bold' : 'bg-zinc-200 text-zinc-900 font-bold') : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30'" 
              class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden clickable-scale"
              [class.justify-center]="isCollapsed()"
              [class.gap-3]="!isCollapsed()"
              [class.px-2]="isCollapsed()"
              [class.px-3]="!isCollapsed()">
              <svg class="w-4 h-4 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
              </svg>
              @if (!isCollapsed()) {
                <span class="animate-fade-in whitespace-nowrap">Calendar</span>
              }
            </button>

            <!-- Employee -->
            <button 
              (click)="selectNav('Employee')" 
              [class]="activeNav() === 'Employee' ? (isDark() ? 'bg-zinc-800/60 text-zinc-50 font-bold' : 'bg-zinc-200 text-zinc-900 font-bold') : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30'" 
              class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden clickable-scale"
              [class.justify-center]="isCollapsed()"
              [class.gap-3]="!isCollapsed()"
              [class.px-2]="isCollapsed()"
              [class.px-3]="!isCollapsed()">
              <svg class="w-4 h-4 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
              @if (!isCollapsed()) {
                <span class="animate-fade-in whitespace-nowrap">Employee</span>
              }
            </button>

            <!-- Team Member -->
            <button 
              (click)="selectNav('Team')" 
              [class]="activeNav() === 'Team' ? (isDark() ? 'bg-zinc-800/60 text-zinc-50 font-bold' : 'bg-zinc-200 text-zinc-900 font-bold') : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30'" 
              class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden clickable-scale"
              [class.justify-center]="isCollapsed()"
              [class.gap-3]="!isCollapsed()"
              [class.px-2]="isCollapsed()"
              [class.px-3]="!isCollapsed()">
              <svg class="w-4 h-4 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
              </svg>
              @if (!isCollapsed()) {
                <span class="animate-fade-in whitespace-nowrap">Team Member</span>
              }
            </button>

          </nav>
        </div>

        <!-- Your Teams Section (shows 3 teams) -->
        <div>
          <p class="text-[9px] font-bold text-zinc-400 mb-3 px-3 overflow-hidden text-ellipsis whitespace-nowrap select-none">
            {{ isCollapsed() ? '•••' : 'Your Teams' }}
          </p>
          <div class="space-y-1 px-1">
            @for (team of activeTeams; track team.name) {
              <button class="w-full flex items-center py-2 rounded-lg text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30 transition-all text-left overflow-hidden clickable-scale"
                [class.justify-center]="isCollapsed()"
                [class.gap-3]="!isCollapsed()"
                [class.px-2]="isCollapsed()"
                [class.px-3]="!isCollapsed()">
                <span [class]="team.gradient" class="w-2.5 h-2.5 rounded-full shrink-0 border border-zinc-200/50 dark:border-zinc-800/50 shadow-none"></span>
                @if (!isCollapsed()) {
                  <span class="animate-fade-in truncate font-medium">{{ team.name }}</span>
                }
              </button>
            }
          </div>
        </div>

      </div>

      <!-- User Options Bottom Section -->
      <div class="relative font-sans" id="user-menu-container">
        <!-- Dropdown Menu (Full Actions Mockup) -->
        @if (isUserDropdownOpen()) {
          <div 
            [class]="isDark() ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-800'"
            class="absolute bottom-full left-0 mb-2 w-64 border rounded-2xl p-1.5 z-50 shadow-lg animate-fade-in select-none">
            
            <!-- User Profile Header -->
            <div class="flex items-center gap-2.5 p-2.5 pb-3 border-b" [class]="isDark() ? 'border-zinc-800' : 'border-zinc-100'">
              <div class="w-9 h-9 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 shrink-0 flex items-center justify-center avatar-grad-3">
                <span class="text-xs font-bold text-white uppercase select-none">JS</span>
              </div>
              <div class="text-left overflow-hidden">
                <p class="text-xs font-bold leading-tight text-zinc-900 dark:text-zinc-50 truncate">jacksimba218269</p>
                <p class="text-[9px] text-zinc-400 truncate mt-0.5">jacksimba28&#64;gmail.com</p>
              </div>
            </div>

            <!-- Group 1: General Options -->
            <div class="py-1">
              <!-- Parameters -->
              <button (click)="onOption('Settings')" class="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer text-left clickable-scale">
                <div class="flex items-center gap-2.5">
                  <svg class="w-4 h-4 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  <span>All Settings</span>
                </div>
                <span class="text-[9px] text-zinc-400 font-mono tracking-wider">⇧⌘,</span>
              </button>

              <!-- Upgrade plan -->
              <button (click)="onOption('Upgrade')" class="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer text-left clickable-scale">
                <svg class="w-4 h-4 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 12 9.75m0 0 3 3m-3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span>Upgrade Plan</span>
              </button>

              <!-- Install apps -->
              <button (click)="onOption('Install')" class="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer text-left clickable-scale">
                <svg class="w-4 h-4 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                <span>Install Apps</span>
              </button>
            </div>

            <!-- Divider -->
            <div class="h-px my-1" [class]="isDark() ? 'bg-zinc-800' : 'bg-zinc-100'"></div>

            <!-- Group 2: Sub-labeled Options -->
            <div class="py-1">
              <!-- Appearance (with hover flyout menu) -->
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

                <!-- Sub-menu / Flyout Menu Container (bridges hover gap via pl-2) -->
                <div 
                  class="absolute left-full bottom-0 pl-2 w-34 z-55 opacity-0 pointer-events-none group-hover/appearance:opacity-100 group-hover/appearance:pointer-events-auto transition-all duration-200 font-sans">
                  <!-- Styled Flyout Wrapper -->
                  <div 
                    [class]="isDark() ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-800'"
                    class="border rounded-xl p-1.5 shadow-lg flex flex-col gap-1">
                    
                    <button (click)="selectTheme('light')" [class]="currentTheme() === 'light' ? (isDark() ? 'bg-zinc-850 text-zinc-50 font-bold' : 'bg-zinc-100 text-zinc-900 font-bold') : 'hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'" class="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all clickable-scale">
                      Light
                    </button>
                    <button (click)="selectTheme('dark')" [class]="currentTheme() === 'dark' ? (isDark() ? 'bg-zinc-850 text-zinc-50 font-bold' : 'bg-zinc-100 text-zinc-900 font-bold') : 'hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'" class="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all clickable-scale">
                      Dark
                    </button>
                    <button (click)="selectTheme('system')" [class]="currentTheme() === 'system' ? (isDark() ? 'bg-zinc-850 text-zinc-50 font-bold' : 'bg-zinc-100 text-zinc-900 font-bold') : 'hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'" class="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all clickable-scale">
                      System
                    </button>
                  </div>
                </div>
              </div>

              <!-- Language -->
              <button (click)="onOption('Language')" class="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer text-left clickable-scale">
                <div class="flex items-center gap-2.5">
                  <svg class="w-4 h-4 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
                  </svg>
                  <div class="flex flex-col text-left">
                    <span>Language</span>
                    <span class="text-[9px] text-zinc-400 font-semibold mt-0.5">Default</span>
                  </div>
                </div>
                <svg class="w-3 h-3 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <!-- Help -->
              <button (click)="onOption('Help')" class="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer text-left clickable-scale">
                <div class="flex items-center gap-2.5">
                  <svg class="w-4 h-4 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                  </svg>
                  <span>Help</span>
                </div>
                <svg class="w-3 h-3 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <!-- Divider -->
            <div class="h-px my-1" [class]="isDark() ? 'bg-zinc-800' : 'bg-zinc-100'"></div>

            <!-- Group 3: Danger / Sign Out -->
            <div class="py-1">
              <button (click)="onOption('Log Out')" class="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer text-left clickable-scale text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20">
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
          [class]="isDark() ? 'hover:bg-zinc-800/60 hover:border-zinc-850 text-zinc-200' : 'hover:bg-zinc-50 hover:border-zinc-200 text-zinc-855'"
          class="w-full flex items-center p-2 rounded-xl border border-transparent transition-all cursor-pointer select-none clickable-scale"
          [class.justify-center]="isCollapsed()"
          [class.justify-between]="!isCollapsed()"
          [class.p-1]="isCollapsed()"
          [class.p-2]="!isCollapsed()">
          <div class="flex items-center overflow-hidden shrink-0 font-sans" [class.gap-2]="!isCollapsed()">
            <!-- Dynamic profile gradient background -->
            <div class="w-7 h-7 rounded-full overflow-hidden border border-zinc-300 dark:border-zinc-700 bg-zinc-200 shrink-0 relative flex items-center justify-center avatar-grad-3">
              <span class="text-[8px] font-extrabold text-white uppercase select-none">JS</span>
            </div>
            @if (!isCollapsed()) {
              <div class="text-left animate-fade-in shrink-0">
                <p class="text-[10px] font-bold leading-tight truncate max-w-[120px]">jacksimba218269</p>
                <p class="text-[8px] text-zinc-400 font-semibold truncate max-w-[120px]">jacksimba28&#64;gmail.com</p>
              </div>
            }
          </div>
          
          @if (!isCollapsed()) {
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
  public readonly isDark = input<boolean>(false);
  public readonly currentTheme = input<'dark' | 'light' | 'system'>('dark');
  public readonly isCollapsed = input<boolean>(false);
  public readonly activeNav = input<string>('Projects');
  
  public readonly navChange = output<string>();
  public readonly themeSelect = output<'dark' | 'light' | 'system'>();

  protected readonly isUserDropdownOpen = signal(false);

  protected readonly activeTeams = [
    { name: 'Core Dev Group', gradient: 'avatar-grad-1' },
    { name: 'Design Systems', gradient: 'avatar-grad-2' },
    { name: 'Integrations API', gradient: 'avatar-grad-3' }
  ];

  constructor(private elementRef: ElementRef) {}

  protected selectNav(nav: string): void {
    this.navChange.emit(nav);
  }

  protected toggleUserDropdown(): void {
    this.isUserDropdownOpen.update(d => !d);
  }

  protected getActiveThemeName(): string {
    const t = this.currentTheme();
    return t.charAt(0).toUpperCase() + t.slice(1);
  }

  protected selectTheme(theme: 'dark' | 'light' | 'system'): void {
    this.themeSelect.emit(theme);
    this.isUserDropdownOpen.set(false);
  }

  protected onOption(option: string): void {
    console.log('Selected option:', option);
    this.isUserDropdownOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  protected onClickOutside(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isUserDropdownOpen.set(false);
    }
  }
}
