import { Component } from '@angular/core';
import { DashboardKpisComponent } from './dashboard/components/kpis';
import { DashboardAttendanceChartComponent } from './dashboard/components/attendance-chart';
import { DashboardCohortShareComponent } from './dashboard/components/cohort-share';
import { DashboardClassOccupancyComponent } from './dashboard/components/class-occupancy';
import { DashboardActivityLogsComponent } from './dashboard/components/activity-logs';
import { DashboardUpcomingEventsComponent } from './dashboard/components/upcoming-events';
import { DashboardShortcutsComponent } from './dashboard/components/shortcuts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DashboardKpisComponent,
    DashboardAttendanceChartComponent,
    DashboardCohortShareComponent,
    DashboardClassOccupancyComponent,
    DashboardActivityLogsComponent,
    DashboardUpcomingEventsComponent,
    DashboardShortcutsComponent
  ],
  template: `
    <div class="space-y-5 font-sans select-none">
      
      <!-- Welcome Header -->
      <section class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between animate-blur-slide stagger-1">
        <div>
          <h2 class="font-medium text-lg tracking-tight text-theme-text-main leading-none">Academic Dashboard</h2>
          <p class="text-xs text-theme-text-muted font-normal mt-1.5">Registrar overview for the Summer Term 2026. All systems operational.</p>
        </div>
        
        <!-- Header Actions -->
        <div class="flex items-center gap-2 shrink-0">
          <button class="flex items-center gap-1.5 px-3 py-1.5 bg-theme-panel border border-theme-border text-[11px] font-medium text-theme-text-muted hover:text-theme-text-main rounded-lg transition-all clickable-scale">
            <!-- Lucide: download -->
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-theme-text-muted shrink-0"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            <span>Export</span>
          </button>
          <button class="flex items-center gap-1.5 px-3 py-1.5 bg-theme-text-main border border-theme-text-main text-[11px] font-medium text-theme-bg hover:bg-theme-hover hover:text-theme-text-main rounded-lg transition-all clickable-scale">
            <span>Actions</span>
          </button>
        </div>
      </section>

      <!-- KPI Metrics Grid -->
      <app-dashboard-kpis class="block animate-blur-slide stagger-2"></app-dashboard-kpis>

      <!-- Analytics Charts Row -->
      <section class="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <app-dashboard-attendance-chart class="lg:col-span-2 block animate-blur-slide stagger-3"></app-dashboard-attendance-chart>
        <app-dashboard-cohort-share class="block animate-blur-slide stagger-4"></app-dashboard-cohort-share>
      </section>

      <!-- Main Layout Columns -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        <!-- Left Column: Classes and Logs -->
        <div class="lg:col-span-2 space-y-5">
          <app-dashboard-class-occupancy class="block animate-blur-slide stagger-5"></app-dashboard-class-occupancy>
          <app-dashboard-activity-logs class="block animate-blur-slide stagger-6"></app-dashboard-activity-logs>
        </div>

        <!-- Right Column: Events and Shortcuts -->
        <div class="space-y-5">
          <app-dashboard-upcoming-events class="block animate-blur-slide stagger-7"></app-dashboard-upcoming-events>
          <app-dashboard-shortcuts class="block animate-blur-slide stagger-8"></app-dashboard-shortcuts>
        </div>

      </div>

    </div>
  `
})
export class DashboardComponent {}
