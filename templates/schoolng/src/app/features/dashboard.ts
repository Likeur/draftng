import { Component, inject, computed, PLATFORM_ID, signal, ElementRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SchoolService } from '../shared/services/school.service';
import { NgApexchartsModule } from 'ng-apexcharts';

interface ClassGroup {
  id: number;
  subject: string;
  code: string;
  teacher: string;
  room: string;
  pax: number;
  maxPax: number;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, NgApexchartsModule],
  host: {
    '(document:click)': 'onClickOutside($event)'
  },
  template: `
    <div class="space-y-6 animate-blur-slide font-sans select-none">
      
      <!-- Welcome Header -->
      <section class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 class="font-medium text-lg tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">Academic Dashboard</h2>
          <p class="text-xs text-zinc-400 font-normal mt-1.5">Registrar overview for the Summer Term 2026. All systems operational.</p>
        </div>
        
        <!-- Header Actions replacing Live Sync -->
        <div class="flex items-center gap-2 shrink-0">
          <button class="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 text-[11px] font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 rounded-lg transition-all clickable-scale">
            <!-- Lucide: download -->
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-450 dark:text-zinc-500 shrink-0"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            <span>Export</span>
          </button>
          <button class="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 dark:bg-zinc-50 border border-zinc-950 dark:border-zinc-50 text-[11px] font-medium text-white dark:text-zinc-950 hover:bg-zinc-900 dark:hover:bg-zinc-100 rounded-lg transition-all clickable-scale">
            <span>Actions</span>
          </button>
        </div>
      </section>

      <!-- KPI Metrics Grid -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <!-- Total Students -->
        <div 
          class="p-4.5 rounded-xl border bg-white dark:bg-zinc-955 border-zinc-200 dark:border-zinc-800/80 flex flex-col justify-between min-h-28 transition-colors duration-250 clickable-scale">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 tracking-wider capitalize">Total Students</span>
            <div class="text-zinc-400 dark:text-zinc-500">
              <!-- Lucide: users -->
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
          </div>
          <div class="mt-3">
            <h3 class="text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
              {{ state.totalStudents().value }}
            </h3>
            <span class="text-[9px] font-normal text-zinc-400 mt-1.5 block">
              <span class="text-emerald-500 font-medium">{{ state.totalStudents().change }}</span> from last term
            </span>
          </div>
        </div>

        <!-- Active Classes -->
        <div 
          class="p-4.5 rounded-xl border bg-white dark:bg-zinc-955 border-zinc-200 dark:border-zinc-800/80 flex flex-col justify-between min-h-28 transition-colors duration-250 clickable-scale">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 tracking-wider capitalize">Active Classes</span>
            <div class="text-zinc-400 dark:text-zinc-500">
              <!-- Lucide: school -->
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="m4 6 8-4 8 4M18 10v7M6 10v7m3-7v7m6-7v7M2 22h20M12 22v-4M8 12h8"/></svg>
            </div>
          </div>
          <div class="mt-3">
            <h3 class="text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
              {{ state.activeClasses().value }}
            </h3>
            <span class="text-[9px] font-normal text-zinc-400 mt-1.5 block">
              <span class="text-indigo-500 font-medium">{{ state.activeClasses().capacity }}</span> room capacity
            </span>
          </div>
        </div>

        <!-- Teachers on Shift -->
        <div 
          class="p-4.5 rounded-xl border bg-white dark:bg-zinc-955 border-zinc-200 dark:border-zinc-800/80 flex flex-col justify-between min-h-28 transition-colors duration-250 clickable-scale">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 tracking-wider capitalize">Teachers on Shift</span>
            <div class="text-zinc-400 dark:text-zinc-500">
              <!-- Lucide: user-check -->
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
            </div>
          </div>
          <div class="mt-3">
            <h3 class="text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
              {{ state.teachersOnDuty().value }}
            </h3>
            <span class="text-[9px] font-normal text-zinc-450 mt-1.5 block">
              {{ state.teachersOnDuty().roster }}
            </span>
          </div>
        </div>

        <!-- Attendance Rate -->
        <div 
          class="p-4.5 rounded-xl border bg-white dark:bg-zinc-955 border-zinc-200 dark:border-zinc-800/80 flex flex-col justify-between min-h-28 transition-colors duration-250 clickable-scale">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 tracking-wider capitalize">Attendance Rate</span>
            <div class="text-zinc-400 dark:text-zinc-500">
              <!-- Lucide: activity -->
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
          </div>
          <div class="mt-3">
            <h3 class="text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
              {{ state.attendanceRate().value }}
            </h3>
            <span class="text-[9px] font-normal text-zinc-455 mt-1.5 block">
              {{ state.attendanceRate().status }}
            </span>
          </div>
        </div>

      </section>

      <!-- Analytics Charts Row -->
      <section class="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <!-- Attendance Chart Card -->
        <div 
          class="lg:col-span-2 rounded-xl border bg-white dark:bg-zinc-955 border-zinc-200 dark:border-zinc-800/80 p-5 space-y-3">
          
          <div class="flex items-start justify-between gap-4">
            <div>
              <h3 class="font-medium text-xs text-zinc-900 dark:text-zinc-50 tracking-wider capitalize">Attendance Analytics</h3>
              <p class="text-[10px] text-zinc-400 font-normal mt-1">{{ getDescriptionText() }}</p>
            </div>
            
            <!-- Controls: Segment Selector + 3-dots config button -->
            <div class="flex items-center gap-2 relative" id="chart-controls-container">
              <!-- Segmented timeframe selector -->
              <div class="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-800 p-0.5 bg-zinc-50 dark:bg-zinc-900/50 select-none">
                <button (click)="changeTimeframe('daily')" [class]="activeTimeframe() === 'daily' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm font-medium' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'" class="px-2.5 py-1 text-[10px] rounded-md transition-all cursor-pointer">Daily</button>
                <button (click)="changeTimeframe('weekly')" [class]="activeTimeframe() === 'weekly' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm font-medium' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'" class="px-2.5 py-1 text-[10px] rounded-md transition-all cursor-pointer">Weekly</button>
                <button (click)="changeTimeframe('monthly')" [class]="activeTimeframe() === 'monthly' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm font-medium' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'" class="px-2.5 py-1 text-[10px] rounded-md transition-all cursor-pointer">Monthly</button>
              </div>

              <!-- More Config 3-Dots Button -->
              <button 
                (click)="toggleChartConfig($event)"
                class="w-7 h-7 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-250 bg-white dark:bg-zinc-950/60 transition-all cursor-pointer clickable-scale">
                <!-- Lucide: more-horizontal -->
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
              </button>

              <!-- Config Options Dropdown Menu -->
              @if (isChartConfigOpen()) {
                <div 
                  class="absolute right-0 top-full mt-1.5 w-44 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-1.5 z-40 shadow-lg animate-fade-in text-zinc-700 dark:text-zinc-300 font-sans">
                  
                  <button (click)="toggleGridLines()" class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-normal hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer text-left">
                    <span>Grid Lines</span>
                    <span class="text-[9px] font-medium" [class]="showGridLines() ? 'text-emerald-500' : 'text-zinc-400'">
                      {{ showGridLines() ? 'On' : 'Off' }}
                    </span>
                  </button>

                  <button (click)="toggleCurveType()" class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-normal hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer text-left">
                    <span>Smooth Curve</span>
                    <span class="text-[9px] font-medium" [class]="curveType() === 'smooth' ? 'text-emerald-500' : 'text-zinc-400'">
                      {{ curveType() === 'smooth' ? 'Yes' : 'No' }}
                    </span>
                  </button>

                  <div class="h-px my-1 bg-zinc-100 dark:bg-zinc-900"></div>

                  <button (click)="toggleGradientFill()" class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-normal hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer text-left">
                    <span>Gradient Fill</span>
                    <span class="text-[9px] font-medium" [class]="showGradient() ? 'text-emerald-500' : 'text-zinc-400'">
                      {{ showGradient() ? 'On' : 'Off' }}
                    </span>
                  </button>
                </div>
              }
            </div>
          </div>

          <div class="h-48 flex items-center justify-center overflow-hidden">
            @if (isBrowser()) {
              <apx-chart
                class="w-full font-sans"
                [series]="attendanceChartOptions().series"
                [chart]="attendanceChartOptions().chart"
                [colors]="attendanceChartOptions().colors"
                [stroke]="attendanceChartOptions().stroke"
                [fill]="attendanceChartOptions().fill"
                [xaxis]="attendanceChartOptions().xaxis"
                [yaxis]="attendanceChartOptions().yaxis"
                [grid]="attendanceChartOptions().grid"
                [dataLabels]="attendanceChartOptions().dataLabels"
                [tooltip]="attendanceChartOptions().tooltip"
              ></apx-chart>
            } @else {
              <span class="text-[10px] text-zinc-400 font-normal">Loading chart...</span>
            }
          </div>
        </div>

        <!-- Cohort Share Card -->
        <div 
          class="rounded-xl border bg-white dark:bg-zinc-955 border-zinc-200 dark:border-zinc-800/80 p-5 space-y-3">
          <div>
            <h3 class="font-medium text-xs text-zinc-900 dark:text-zinc-50 tracking-wider capitalize">Cohort Share</h3>
            <p class="text-[10px] text-zinc-400 font-normal mt-1">Distribution of active students per cohort</p>
          </div>
          <div class="h-48 flex items-center justify-center overflow-hidden">
            @if (isBrowser()) {
              <apx-chart
                class="w-full font-sans"
                [series]="cohortChartOptions().series"
                [chart]="cohortChartOptions().chart"
                [labels]="cohortChartOptions().labels"
                [colors]="cohortChartOptions().colors"
                [stroke]="cohortChartOptions().stroke"
                [plotOptions]="cohortChartOptions().plotOptions"
                [dataLabels]="cohortChartOptions().dataLabels"
                [legend]="cohortChartOptions().legend"
                [tooltip]="cohortChartOptions().tooltip"
              ></apx-chart>
            } @else {
              <span class="text-[10px] text-zinc-400 font-normal">Loading share data...</span>
            }
          </div>
        </div>
      </section>

      <!-- Main Layout Columns -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        <!-- Left Column: Classes and Logs -->
        <div class="lg:col-span-2 space-y-5">
          
          <!-- Class Occupancy -->
          <div 
            class="rounded-xl border bg-white dark:bg-zinc-955 border-zinc-200 dark:border-zinc-800/80 p-5 space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-xs text-zinc-900 dark:text-zinc-50 tracking-wider capitalize">Class Occupancy</h3>
                <p class="text-[10px] text-zinc-400 font-normal mt-1">Scheduled lectures for today</p>
              </div>
              <button class="text-[10px] font-medium px-2.5 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 rounded-lg transition-all clickable-scale">View All</button>
            </div>

            <!-- Subject Cards Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              @for (cls of filteredClasses(); track cls.id) {
                <div 
                  class="p-4 rounded-xl border bg-white dark:bg-zinc-955 border-zinc-200 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 animate-blur-slide clickable-scale">
                  
                  <div class="flex items-start justify-between">
                    <div>
                      <span class="text-[8px] font-mono bg-zinc-100 dark:bg-zinc-900 text-zinc-400 border border-zinc-200/60 dark:border-zinc-800 px-1.5 py-0.5 rounded font-medium select-none">{{ cls.code }}</span>
                      <h4 class="font-medium text-sm text-zinc-850 dark:text-zinc-100 mt-2 truncate max-w-40">{{ cls.subject }}</h4>
                      <p class="text-[10px] text-zinc-400 font-normal mt-1">{{ cls.teacher }}</p>
                    </div>
                  </div>

                  <div class="mt-3.5">
                    <div class="flex items-center justify-between text-[9px] text-zinc-400 font-normal mb-1 font-sans">
                      <span>Occupants</span>
                      <span>{{ cls.pax }} / {{ cls.maxPax }} ({{ getPercent(cls.pax, cls.maxPax) }}%)</span>
                    </div>
                    <!-- Colored progress bar -->
                    <div class="w-full h-1 rounded-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                      <div [class]="cls.color" class="h-full rounded-full" [style.width.%]="getPercent(cls.pax, cls.maxPax)"></div>
                    </div>
                  </div>

                </div>
              }
            </div>
          </div>

          <!-- Activity Logs Section -->
          <div 
            class="rounded-xl border bg-white dark:bg-zinc-955 border-zinc-200 dark:border-zinc-800/80 p-5 space-y-3">
            <div>
              <h3 class="font-medium text-xs text-zinc-900 dark:text-zinc-50 tracking-wider capitalize">Registrar Activity</h3>
              <p class="text-[10px] text-zinc-400 font-normal mt-1">Live audit log of registrar activity and marks entries</p>
            </div>

            <div class="divide-y divide-zinc-100 dark:divide-zinc-900 font-sans">
              @for (log of filteredLogs(); track log.id) {
                <div class="py-2.5 flex items-start justify-between gap-4 text-xs font-normal animate-blur-slide">
                  <div class="flex items-start gap-3">
                    <span [class]="getCategoryColor(log.category)" class="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"></span>
                    <p class="text-zinc-600 dark:text-zinc-300 leading-normal">{{ log.message }}</p>
                  </div>
                  <span class="text-[9px] text-zinc-455 whitespace-nowrap pt-0.5 font-mono select-none font-normal">{{ log.time }}</span>
                </div>
              }
            </div>
          </div>

        </div>

        <!-- Right Column: Events & Actions -->
        <div class="space-y-5">
          
          <!-- Upcoming Events -->
          <div 
            class="rounded-xl border bg-white dark:bg-zinc-955 border-zinc-200 dark:border-zinc-800/80 p-5 space-y-3">
            <div>
              <h3 class="font-medium text-xs text-zinc-900 dark:text-zinc-50 tracking-wider capitalize">Calendar & Events</h3>
              <p class="text-[10px] text-zinc-400 font-normal mt-1">Upcoming official assemblies and deadlines</p>
            </div>

            <div class="space-y-2.5">
              @for (evt of state.upcomingEvents(); track evt.id) {
                <div 
                  class="p-3.5 rounded-xl border bg-white dark:bg-zinc-955 border-zinc-200 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 animate-blur-slide clickable-scale font-sans">
                  
                  <div class="flex items-center justify-between gap-2">
                    <h4 class="font-medium text-xs text-zinc-900 dark:text-zinc-50 truncate">{{ evt.title }}</h4>
                    <span [class]="getEventTypeColor(evt.type)" class="text-[8px] font-normal px-1.5 py-0.5 rounded tracking-wider capitalize font-mono shrink-0">
                      {{ evt.type }}
                    </span>
                  </div>

                  <div class="flex flex-col gap-1.5 text-[10px] text-zinc-400 font-normal mt-2">
                    <div class="flex items-center gap-2">
                      <!-- Lucide: calendar -->
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400 dark:text-zinc-500 shrink-0"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                      <span>{{ evt.date }} &#64; {{ evt.time }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <!-- Lucide: map-pin -->
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400 dark:text-zinc-500 shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                      <span>{{ evt.location }}</span>
                    </div>
                  </div>

                </div>
              }
            </div>
          </div>

          <!-- Quick Actions Panel -->
          <div 
            class="rounded-xl border bg-white dark:bg-zinc-955 border-zinc-200 dark:border-zinc-800/80 p-5 space-y-3">
            <div>
              <h3 class="font-medium text-xs text-zinc-900 dark:text-zinc-50 tracking-wider capitalize">Console Shortcuts</h3>
              <p class="text-[10px] text-zinc-400 font-normal mt-1">Registrar shortcuts for swift entries</p>
            </div>

            <div class="grid grid-cols-2 gap-2 text-[11px] font-medium font-sans">
              <button class="p-3 border rounded-xl flex flex-col gap-2 items-center text-center bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors clickable-scale">
                <!-- Lucide: user-plus -->
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400 dark:text-zinc-500 shrink-0"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
                <span>Add Student</span>
              </button>
              
              <button class="p-3 border rounded-xl flex flex-col gap-2 items-center text-center bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors clickable-scale">
                <!-- Lucide: clipboard-check -->
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400 dark:text-zinc-500 shrink-0"><rect width="8" height="4" x="9" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>
                <span>Absences</span>
              </button>

              <button class="p-3 border rounded-xl flex flex-col gap-2 items-center text-center bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors clickable-scale">
                <!-- Lucide: megaphone -->
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400 dark:text-zinc-500 shrink-0"><path d="m3 11 18-5v12L3 13v-2Z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
                <span>Post Notice</span>
              </button>

              <button class="p-3 border rounded-xl flex flex-col gap-2 items-center text-center bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors clickable-scale">
                <!-- Lucide: calendar-plus -->
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400 dark:text-zinc-500 shrink-0"><path d="M8 2v4M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18M16 14h-8M12 11v6"/></svg>
                <span>Add Event</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  `
})
export class DashboardComponent {
  protected readonly state = inject(SchoolService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef);
  protected readonly isBrowser = signal(isPlatformBrowser(this.platformId));

  // Timeframe and chart config states
  protected readonly activeTimeframe = signal<'daily' | 'weekly' | 'monthly'>('weekly');
  protected readonly isChartConfigOpen = signal(false);
  protected readonly showGridLines = signal(true);
  protected readonly curveType = signal<'smooth' | 'straight'>('smooth');
  protected readonly showGradient = signal(true);

  // Timeframe datasets
  private readonly datasets = {
    daily: {
      data: [98.5, 99.2, 97.4, 98.9, 99.5],
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    },
    weekly: {
      data: [97.2, 98.1, 97.8, 98.4, 98.2],
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    },
    monthly: {
      data: [96.8, 97.5, 98.1, 97.9, 98.3],
      categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun']
    }
  };

  // Active Subject Cohorts mock data
  protected readonly classGroups: ClassGroup[] = [
    { id: 201, subject: 'AP Calculus BC', code: 'MATH-401', teacher: 'Dr. Elizabeth Vance', room: 'Gymnasium Annex 2A', pax: 28, maxPax: 30, color: 'bg-emerald-500' },
    { id: 202, subject: 'Honors Chemistry', code: 'CHEM-302', teacher: 'Prof. Julian Crane', room: 'Science Hall 3B', pax: 24, maxPax: 25, color: 'bg-blue-500' },
    { id: 203, subject: 'English Literature', code: 'LIT-201', teacher: 'Ms. Clara Oswald', room: 'Humanities Room 12', pax: 19, maxPax: 30, color: 'bg-indigo-500' },
    { id: 204, subject: 'Intro to Microeconomics', code: 'ECON-101', teacher: 'Dr. Alistair Finch', room: 'Lecture Hall C', pax: 45, maxPax: 50, color: 'bg-amber-500' }
  ];

  // Attendance Weekly Trend reactive options (Visible Emerald Green Curve Area Chart)
  protected readonly attendanceChartOptions = computed(() => {
    const isDark = this.state.isDark();
    const gridColor = isDark ? '#1f1f23' : '#eaeaea';
    const labelColor = isDark ? '#52525b' : '#a1a1aa';
    const tf = this.activeTimeframe();
    const currentDataset = this.datasets[tf];

    return {
      series: [
        {
          name: 'Attendance Rate',
          data: currentDataset.data
        }
      ],
      chart: {
        type: 'area' as any,
        height: 200,
        parentHeightOffset: 0,
        toolbar: { show: false },
        animations: { enabled: true }
      },
      colors: ['#10b981'], // Glowing Emerald
      stroke: {
        curve: this.curveType() as any,
        width: 3 // Bold, highly visible stroke
      },
      fill: {
        type: this.showGradient() ? 'gradient' : 'solid',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: this.showGradient() ? 0.35 : 0.03, // High visibility area gradient
          opacityTo: 0.01,
          stops: [0, 90, 100]
        }
      },
      xaxis: {
        categories: currentDataset.categories,
        axisBorder: { show: false },
        axisTicks: { show: true, color: gridColor },
        labels: {
          show: true,
          style: {
            colors: labelColor,
            fontFamily: 'Geist Sans, sans-serif',
            fontSize: '9px'
          }
        }
      },
      yaxis: {
        min: 95,
        max: 100,
        tickAmount: 2, // Marks at 95%, 97.5%, 100%
        labels: {
          show: true,
          style: {
            colors: labelColor,
            fontFamily: 'Geist Sans, sans-serif',
            fontSize: '9px'
          },
          formatter: (val: number) => `${val}%`
        }
      },
      grid: {
        borderColor: gridColor,
        strokeDashArray: 4,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: this.showGridLines() } },
        padding: { top: 0, right: 10, bottom: 0, left: 10 }
      },
      dataLabels: { enabled: false },
      tooltip: {
        theme: isDark ? 'dark' : 'light',
        style: {
          fontSize: '10px',
          fontFamily: 'Geist Sans, sans-serif'
        },
        y: {
          formatter: (val: number) => `${val}%`
        }
      }
    };
  });

  // Cohort Distribution Share reactive options (Colored rings)
  protected readonly cohortChartOptions = computed(() => {
    const isDark = this.state.isDark();
    const labelColor = isDark ? '#71717a' : '#a1a1aa';
    const fillColors = ['#10b981', '#3b82f6', '#6366f1', '#f59e0b']; // emerald, blue, indigo, amber

    return {
      series: [28, 24, 19, 45],
      chart: {
        type: 'donut' as any,
        height: 180,
        animations: { enabled: true }
      },
      labels: ['AP Calc BC', 'Honors Chem', 'English Lit', 'Microecon'],
      colors: fillColors,
      stroke: {
        show: true,
        width: 1,
        colors: [isDark ? '#09090b' : '#ffffff']
      },
      plotOptions: {
        pie: {
          donut: {
            size: '72%',
            background: 'transparent',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '9px',
                fontFamily: 'Geist Sans, sans-serif',
                color: labelColor,
                offsetY: -3
              },
              value: {
                show: true,
                fontSize: '15px',
                fontFamily: 'Geist Sans, sans-serif',
                fontWeight: '500',
                color: isDark ? '#ffffff' : '#09090b',
                offsetY: 3,
                formatter: (val: string) => val
              },
              total: {
                show: true,
                label: 'Total Students',
                fontSize: '9px',
                fontFamily: 'Geist Sans, sans-serif',
                color: labelColor,
                formatter: () => '116'
              }
            }
          }
        }
      },
      dataLabels: { enabled: false },
      legend: {
        show: false
      },
      tooltip: {
        theme: isDark ? 'dark' : 'light',
        style: {
          fontSize: '10px',
          fontFamily: 'Geist Sans, sans-serif'
        }
      }
    };
  });

  protected getDescriptionText(): string {
    const tf = this.activeTimeframe();
    if (tf === 'daily') return 'Average daily attendance rate for the current cycle';
    if (tf === 'weekly') return 'Average weekly attendance rate over the current week';
    return 'Average monthly attendance rate over the last five months';
  }

  protected changeTimeframe(tf: 'daily' | 'weekly' | 'monthly'): void {
    this.activeTimeframe.set(tf);
  }

  protected toggleChartConfig(event: MouseEvent): void {
    event.stopPropagation();
    this.isChartConfigOpen.update(o => !o);
  }

  protected toggleGridLines(): void {
    this.showGridLines.update(g => !g);
  }

  protected toggleCurveType(): void {
    this.curveType.update(c => c === 'smooth' ? 'straight' : 'smooth');
  }

  protected toggleGradientFill(): void {
    this.showGradient.update(g => !g);
  }

  // Filters computed from search query
  protected readonly filteredClasses = computed(() => {
    const query = this.state.searchQuery().toLowerCase();
    if (!query) return this.classGroups;
    return this.classGroups.filter(c => 
      c.subject.toLowerCase().includes(query) || 
      c.code.toLowerCase().includes(query) ||
      c.teacher.toLowerCase().includes(query)
    );
  });

  protected readonly filteredLogs = computed(() => {
    const logs = this.state.activityLogs();
    const query = this.state.searchQuery().toLowerCase();
    if (!query) return logs;
    return logs.filter(l => l.message.toLowerCase().includes(query));
  });

  protected getPercent(pax: number, max: number): number {
    return Math.round((pax / max) * 100);
  }

  protected getCategoryColor(cat: string): string {
    switch (cat) {
      case 'academic': return 'bg-emerald-500';
      case 'system': return 'bg-amber-500';
      case 'administrative': return 'bg-indigo-500';
      default: return 'bg-zinc-400';
    }
  }

  protected getEventTypeColor(type: string): string {
    switch (type) {
      case 'academic': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
      case 'sports': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
      default: return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20';
    }
  }

  protected onClickOutside(event: MouseEvent): void {
    const container = document.getElementById('chart-controls-container');
    if (container && !container.contains(event.target as Node)) {
      this.isChartConfigOpen.set(false);
    }
  }
}
