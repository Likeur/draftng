import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchoolService } from '../shared/services/school.service';

interface ClassGroup {
  id: number;
  subject: string;
  code: string;
  teacher: string;
  room: string;
  pax: number;
  maxPax: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  template: `
    <div class="space-y-8 animate-blur-slide font-sans select-none">
      
      <!-- Welcome Header -->
      <section class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 class="font-medium text-lg tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">Academic Console</h2>
          <p class="text-xs text-zinc-400 font-normal mt-1.5">Registrar overview for the Summer Term 2026. All systems operational.</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="flex h-1.5 w-1.5 relative">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-450 dark:bg-zinc-100 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-zinc-950 dark:bg-zinc-50"></span>
          </span>
          <span class="text-[9px] font-medium text-zinc-400 dark:text-zinc-500 tracking-wider uppercase">Live Sync Active</span>
        </div>
      </section>

      <!-- KPI Metrics Grid (Vercel-style clean slate grids) -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <!-- Total Students -->
        <div 
          [class]="state.isDark() ? 'bg-zinc-950 border-zinc-900' : 'bg-white border-zinc-200'"
          class="p-5 rounded-xl border flex flex-col justify-between min-h-32 transition-colors duration-250 clickable-scale">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Total Students</span>
            <div class="text-zinc-400">
              <!-- Lucide: users -->
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
          </div>
          <div class="mt-4">
            <h3 class="text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
              {{ state.totalStudents().value }}
            </h3>
            <span class="text-[9px] font-normal text-zinc-400 mt-2 block">
              <span class="text-emerald-500 font-medium">{{ state.totalStudents().change }}</span> from last term
            </span>
          </div>
        </div>

        <!-- Active Classes -->
        <div 
          [class]="state.isDark() ? 'bg-zinc-950 border-zinc-900' : 'bg-white border-zinc-200'"
          class="p-5 rounded-xl border flex flex-col justify-between min-h-32 transition-colors duration-250 clickable-scale">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Active Classes</span>
            <div class="text-zinc-400">
              <!-- Lucide: school -->
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="m4 6 8-4 8 4M18 10v7M6 10v7m3-7v7m6-7v7M2 22h20M12 22v-4M8 12h8"/></svg>
            </div>
          </div>
          <div class="mt-4">
            <h3 class="text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
              {{ state.activeClasses().value }}
            </h3>
            <span class="text-[9px] font-normal text-zinc-400 mt-2 block">
              <span class="text-zinc-950 dark:text-zinc-50 font-medium">{{ state.activeClasses().capacity }}</span> room capacity
            </span>
          </div>
        </div>

        <!-- Teachers on Shift -->
        <div 
          [class]="state.isDark() ? 'bg-zinc-950 border-zinc-900' : 'bg-white border-zinc-200'"
          class="p-5 rounded-xl border flex flex-col justify-between min-h-32 transition-colors duration-250 clickable-scale">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Teachers on Shift</span>
            <div class="text-zinc-400">
              <!-- Lucide: user-check -->
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
            </div>
          </div>
          <div class="mt-4">
            <h3 class="text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
              {{ state.teachersOnDuty().value }}
            </h3>
            <span class="text-[9px] font-normal text-zinc-450 mt-2 block">
              {{ state.teachersOnDuty().roster }}
            </span>
          </div>
        </div>

        <!-- Attendance Rate -->
        <div 
          [class]="state.isDark() ? 'bg-zinc-950 border-zinc-900' : 'bg-white border-zinc-200'"
          class="p-5 rounded-xl border flex flex-col justify-between min-h-32 transition-colors duration-250 clickable-scale">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Attendance Rate</span>
            <div class="text-zinc-400">
              <!-- Lucide: activity -->
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
          </div>
          <div class="mt-4">
            <h3 class="text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
              {{ state.attendanceRate().value }}
            </h3>
            <span class="text-[9px] font-normal text-zinc-455 mt-2 block">
              {{ state.attendanceRate().status }}
            </span>
          </div>
        </div>

      </section>

      <!-- Main Layout Columns -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Left Column: Classes and Logs -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Class Occupancy -->
          <div 
            [class]="state.isDark() ? 'bg-zinc-950 border-zinc-900' : 'bg-white border-zinc-200'"
            class="rounded-xl border p-6 space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-xs text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">Class Occupancy</h3>
                <p class="text-[10px] text-zinc-400 font-normal mt-1.5">Scheduled lectures for today</p>
              </div>
              <button [class]="state.isDark() ? 'hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 border-zinc-800' : 'hover:bg-zinc-50 text-zinc-500 hover:text-zinc-900 border-zinc-200'" class="text-[10px] font-medium px-3 py-1.5 rounded-lg border transition-all clickable-scale">View All</button>
            </div>

            <!-- Subject Cards Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              @for (cls of filteredClasses(); track cls.id) {
                <div 
                  [class]="state.isDark() ? 'bg-zinc-950 border-zinc-900 hover:border-zinc-850' : 'bg-white border-zinc-200 hover:border-zinc-300'"
                  class="p-4.5 rounded-xl border flex flex-col justify-between gap-4 transition-all duration-200 animate-blur-slide clickable-scale">
                  
                  <div class="flex items-start justify-between">
                    <div>
                      <span class="text-[8px] font-mono bg-zinc-50 dark:bg-zinc-900 text-zinc-400 border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5 rounded font-medium select-none">{{ cls.code }}</span>
                      <h4 class="font-medium text-sm text-zinc-800 dark:text-zinc-100 mt-2.5 truncate max-w-40">{{ cls.subject }}</h4>
                      <p class="text-[10px] text-zinc-400 font-normal mt-1">{{ cls.teacher }}</p>
                    </div>
                  </div>

                  <div>
                    <div class="flex items-center justify-between text-[9px] text-zinc-400 font-normal mb-1.5">
                      <span>Occupants</span>
                      <span>{{ cls.pax }} / {{ cls.maxPax }} ({{ getPercent(cls.pax, cls.maxPax) }}%)</span>
                    </div>
                    <!-- Minimal monochrome progress bar -->
                    <div class="w-full h-1 rounded-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                      <div class="h-full bg-zinc-950 dark:bg-zinc-50 rounded-full" [style.width.%]="getPercent(cls.pax, cls.maxPax)"></div>
                    </div>
                  </div>

                </div>
              }
            </div>
          </div>

          <!-- Activity Logs Section -->
          <div 
            [class]="state.isDark() ? 'bg-zinc-950 border-zinc-900' : 'bg-white border-zinc-200'"
            class="rounded-xl border p-6 space-y-4">
            <div>
              <h3 class="font-medium text-xs text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">Registrar Activity</h3>
              <p class="text-[10px] text-zinc-400 font-normal mt-1.5">Live audit log of registrar activity and marks entries</p>
            </div>

            <div class="divide-y divide-zinc-200/50 dark:divide-zinc-900">
              @for (log of filteredLogs(); track log.id) {
                <div class="py-3 flex items-start justify-between gap-4 text-xs font-normal animate-blur-slide">
                  <div class="flex items-start gap-3">
                    <span [class]="getCategoryColor(log.category)" class="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"></span>
                    <p class="text-zinc-650 dark:text-zinc-300 leading-normal">{{ log.message }}</p>
                  </div>
                  <span class="text-[9px] text-zinc-400 whitespace-nowrap pt-0.5 font-mono select-none font-normal">{{ log.time }}</span>
                </div>
              }
            </div>
          </div>

        </div>

        <!-- Right Column: Events & Actions -->
        <div class="space-y-6">
          
          <!-- Upcoming Events -->
          <div 
            [class]="state.isDark() ? 'bg-zinc-950 border-zinc-900' : 'bg-white border-zinc-200'"
            class="rounded-xl border p-6 space-y-4">
            <div>
              <h3 class="font-medium text-xs text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">Calendar & Events</h3>
              <p class="text-[10px] text-zinc-400 font-normal mt-1.5">Upcoming official assemblies and deadlines</p>
            </div>

            <div class="space-y-3">
              @for (evt of state.upcomingEvents(); track evt.id) {
                <div 
                  [class]="state.isDark() ? 'bg-zinc-950 border-zinc-900 hover:border-zinc-850' : 'bg-white border-zinc-200 hover:border-zinc-300'"
                  class="p-4 rounded-xl border space-y-2.5 transition-all duration-200 animate-blur-slide clickable-scale">
                  
                  <div class="flex items-center justify-between gap-2">
                    <h4 class="font-medium text-xs text-zinc-900 dark:text-zinc-50 truncate">{{ evt.title }}</h4>
                    <span [class]="getEventTypeColor(evt.type)" class="text-[8px] font-normal px-1.5 py-0.5 rounded tracking-wider uppercase font-mono shrink-0">
                      {{ evt.type }}
                    </span>
                  </div>

                  <div class="flex flex-col gap-1.5 text-[10px] text-zinc-400 font-normal">
                    <div class="flex items-center gap-2">
                      <!-- Lucide: calendar -->
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M8 2v4M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
                      <span>{{ evt.date }} &#64; {{ evt.time }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <!-- Lucide: map-pin -->
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                      <span>{{ evt.location }}</span>
                    </div>
                  </div>

                </div>
              }
            </div>
          </div>

          <!-- Quick Actions Panel (Vercel-style clean action slots) -->
          <div 
            [class]="state.isDark() ? 'bg-zinc-950 border-zinc-900' : 'bg-white border-zinc-200'"
            class="rounded-xl border p-6 space-y-4">
            <div>
              <h3 class="font-medium text-xs text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">Console Shortcuts</h3>
              <p class="text-[10px] text-zinc-400 font-normal mt-1.5">Registrar shortcuts for swift entries</p>
            </div>

            <div class="grid grid-cols-2 gap-2 text-[11px] font-medium">
              <button [class]="state.isDark() ? 'bg-zinc-900 hover:bg-zinc-900/60 border-zinc-850 text-zinc-300' : 'bg-zinc-50 hover:bg-zinc-100/40 border-zinc-200 text-zinc-700'" class="p-3 border rounded-xl flex flex-col gap-2.5 items-center text-center clickable-scale">
                <!-- Lucide: user-plus -->
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400 shrink-0"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
                <span>Add Student</span>
              </button>
              
              <button [class]="state.isDark() ? 'bg-zinc-900 hover:bg-zinc-900/60 border-zinc-850 text-zinc-300' : 'bg-zinc-50 hover:bg-zinc-100/40 border-zinc-200 text-zinc-700'" class="p-3 border rounded-xl flex flex-col gap-2.5 items-center text-center clickable-scale">
                <!-- Lucide: clipboard-check -->
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400 shrink-0"><rect width="8" height="4" x="9" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>
                <span>Absences</span>
              </button>

              <button [class]="state.isDark() ? 'bg-zinc-900 hover:bg-zinc-900/60 border-zinc-850 text-zinc-300' : 'bg-zinc-50 hover:bg-zinc-100/40 border-zinc-200 text-zinc-700'" class="p-3 border rounded-xl flex flex-col gap-2.5 items-center text-center clickable-scale">
                <!-- Lucide: megaphone -->
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400 shrink-0"><path d="m3 11 18-5v12L3 13v-2Z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
                <span>Post Notice</span>
              </button>

              <button [class]="state.isDark() ? 'bg-zinc-900 hover:bg-zinc-900/60 border-zinc-850 text-zinc-300' : 'bg-zinc-50 hover:bg-zinc-100/40 border-zinc-200 text-zinc-700'" class="p-3 border rounded-xl flex flex-col gap-2.5 items-center text-center clickable-scale">
                <!-- Lucide: calendar-plus -->
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400 shrink-0"><path d="M8 2v4M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18M16 14h-8M12 11v6"/></svg>
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

  // Active Subject Cohorts mock data
  protected readonly classGroups: ClassGroup[] = [
    { id: 201, subject: 'AP Calculus BC', code: 'MATH-401', teacher: 'Dr. Elizabeth Vance', room: 'Gymnasium Annex 2A', pax: 28, maxPax: 30 },
    { id: 202, subject: 'Honors Chemistry', code: 'CHEM-302', teacher: 'Prof. Julian Crane', room: 'Science Hall 3B', pax: 24, maxPax: 25 },
    { id: 203, subject: 'English Literature', code: 'LIT-201', teacher: 'Ms. Clara Oswald', room: 'Humanities Room 12', pax: 19, maxPax: 30 },
    { id: 204, subject: 'Intro to Microeconomics', code: 'ECON-101', teacher: 'Dr. Alistair Finch', room: 'Lecture Hall C', pax: 45, maxPax: 50 }
  ];

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
      case 'academic': return 'bg-zinc-400 dark:bg-zinc-650';
      case 'system': return 'bg-zinc-400 dark:bg-zinc-650';
      case 'administrative': return 'bg-zinc-400 dark:bg-zinc-650';
      default: return 'bg-zinc-400';
    }
  }

  protected getEventTypeColor(type: string): string {
    return 'bg-zinc-100 dark:bg-zinc-900 text-zinc-550 border border-zinc-200 dark:border-zinc-800';
  }
}
