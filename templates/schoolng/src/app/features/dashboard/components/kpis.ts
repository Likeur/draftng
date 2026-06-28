import { Component, inject } from '@angular/core';
import { SchoolService } from '../../../shared/services/school.service';

@Component({
  selector: 'app-dashboard-kpis',
  standalone: true,
  imports: [],
  template: `
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
  `
})
export class DashboardKpisComponent {
  protected readonly state = inject(SchoolService);
}
