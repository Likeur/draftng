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
  color: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  template: `
    <div class="space-y-8 animate-blur-slide font-sans">
      
      <!-- Welcome Header -->
      <section class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between select-none">
        <div>
          <h2 class="font-display font-extrabold text-2xl tracking-tight text-zinc-900 dark:text-zinc-50">Academic Console</h2>
          <p class="text-xs text-zinc-400 mt-1">Registrar overview for the Summer Term 2026. All systems operational.</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="flex h-2 w-2 relative">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span class="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">Live Sync Active</span>
        </div>
      </section>

      <!-- KPI Metrics Grid -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        
        <!-- Total Students -->
        <div 
          [class]="state.isDark() ? 'bg-zinc-900/60 border-zinc-900' : 'bg-white border-zinc-200'"
          class="p-5 rounded-2xl border transition-all duration-300 hover:shadow-md flex flex-col justify-between min-h-32 clickable-scale">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-zinc-400">Total Students</span>
            <div class="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <h3 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
              {{ state.totalStudents().value }}
            </h3>
            <span class="text-[10px] font-bold text-emerald-500 mt-1 block">
              {{ state.totalStudents().change }} <span class="text-zinc-400">from last term</span>
            </span>
          </div>
        </div>

        <!-- Active Classes -->
        <div 
          [class]="state.isDark() ? 'bg-zinc-900/60 border-zinc-900' : 'bg-white border-zinc-200'"
          class="p-5 rounded-2xl border transition-all duration-300 hover:shadow-md flex flex-col justify-between min-h-32 clickable-scale">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-zinc-400">Active Classes</span>
            <div class="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.33l-7.5-5-7.5 5V21" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <h3 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
              {{ state.activeClasses().value }}
            </h3>
            <span class="text-[10px] font-bold text-teal-500 mt-1 block">
              {{ state.activeClasses().capacity }} <span class="text-zinc-400">room capacity</span>
            </span>
          </div>
        </div>

        <!-- Teachers on Shift -->
        <div 
          [class]="state.isDark() ? 'bg-zinc-900/60 border-zinc-900' : 'bg-white border-zinc-200'"
          class="p-5 rounded-2xl border transition-all duration-300 hover:shadow-md flex flex-col justify-between min-h-32 clickable-scale">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-zinc-400">Teachers on Shift</span>
            <div class="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M12 13.489v6.528m-6.42-6.528A47.95 47.95 0 0 0 12 20.06a47.948 47.948 0 0 0 6.42-6.571M12 3.493v.01" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <h3 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
              {{ state.teachersOnDuty().value }}
            </h3>
            <span class="text-[10px] font-bold text-zinc-450 mt-1 block">
              {{ state.teachersOnDuty().roster }}
            </span>
          </div>
        </div>

        <!-- Attendance Rate -->
        <div 
          [class]="state.isDark() ? 'bg-zinc-900/60 border-zinc-900' : 'bg-white border-zinc-200'"
          class="p-5 rounded-2xl border transition-all duration-300 hover:shadow-md flex flex-col justify-between min-h-32 clickable-scale">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-zinc-400">Attendance Rate</span>
            <div class="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <h3 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
              {{ state.attendanceRate().value }}
            </h3>
            <span class="text-[10px] font-bold text-emerald-500 mt-1 block">
              {{ state.attendanceRate().status }}
            </span>
          </div>
        </div>

      </section>

      <!-- Main Layout Columns -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Left: Roster Classes & Activity logs -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Classes Section -->
          <div 
            [class]="state.isDark() ? 'bg-zinc-900/60 border-zinc-900' : 'bg-white border-zinc-200'"
            class="rounded-2xl border p-6 space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-bold text-sm text-zinc-900 dark:text-zinc-50 leading-none">Class Occupancy</h3>
                <p class="text-[10px] text-zinc-400 mt-1">Status of scheduled lectures for today</p>
              </div>
              <button [class]="state.isDark() ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'" class="text-[10px] font-bold text-zinc-400 px-3 py-1.5 rounded-lg border border-transparent transition-all clickable-scale">View All</button>
            </div>

            <!-- Subject Cards Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              @for (cls of filteredClasses(); track cls.id) {
                <div 
                  [class]="state.isDark() ? 'bg-zinc-950/80 border-zinc-850 hover:bg-zinc-950' : 'bg-zinc-50 border-zinc-150 hover:bg-zinc-100/50'"
                  class="p-4 rounded-xl border flex flex-col justify-between gap-4 transition-all duration-300 animate-blur-slide clickable-scale">
                  
                  <div class="flex items-start justify-between">
                    <div>
                      <span class="text-[9px] font-mono bg-zinc-100 dark:bg-zinc-900 text-zinc-400 px-1.5 py-0.5 rounded font-bold">{{ cls.code }}</span>
                      <h4 class="font-bold text-xs text-zinc-800 dark:text-zinc-100 mt-2 truncate max-w-40">{{ cls.subject }}</h4>
                      <p class="text-[10px] text-zinc-400 mt-0.5">{{ cls.teacher }}</p>
                    </div>
                    <!-- Small Gradient Dot representation of cohort group -->
                    <span [class]="cls.color" class="w-3 h-3 rounded-full shrink-0 border border-zinc-200/50 dark:border-zinc-800/50"></span>
                  </div>

                  <div>
                    <div class="flex items-center justify-between text-[9px] text-zinc-400 font-bold mb-1.5">
                      <span>Occupants</span>
                      <span>{{ cls.pax }} / {{ cls.maxPax }} ({{ getPercent(cls.pax, cls.maxPax) }}%)</span>
                    </div>
                    <div class="w-full h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                      <div class="h-full bg-emerald-500 rounded-full" [style.width.%]="getPercent(cls.pax, cls.maxPax)"></div>
                    </div>
                  </div>

                </div>
              }
            </div>
          </div>

          <!-- Activity Logs Section -->
          <div 
            [class]="state.isDark() ? 'bg-zinc-900/60 border-zinc-900' : 'bg-white border-zinc-200'"
            class="rounded-2xl border p-6 space-y-4">
            <div>
              <h3 class="font-bold text-sm text-zinc-900 dark:text-zinc-50 leading-none">Registrar Activity</h3>
              <p class="text-[10px] text-zinc-400 mt-1">Live audit log of registrar activity and marks entries</p>
            </div>

            <div class="divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
              @for (log of filteredLogs(); track log.id) {
                <div class="py-3 flex items-start justify-between gap-4 text-xs font-medium animate-blur-slide">
                  <div class="flex items-start gap-3">
                    <span [class]="getCategoryColor(log.category)" class="w-2 h-2 rounded-full mt-1.5 shrink-0"></span>
                    <p class="text-zinc-700 dark:text-zinc-300 leading-normal">{{ log.message }}</p>
                  </div>
                  <span class="text-[9px] text-zinc-400 whitespace-nowrap pt-0.5 font-mono select-none">{{ log.time }}</span>
                </div>
              }
            </div>
          </div>

        </div>

        <!-- Right Column: Events & Action Panel -->
        <div class="space-y-6">
          
          <!-- Upcoming Events -->
          <div 
            [class]="state.isDark() ? 'bg-zinc-900/60 border-zinc-900' : 'bg-white border-zinc-200'"
            class="rounded-2xl border p-6 space-y-4">
            <div>
              <h3 class="font-bold text-sm text-zinc-900 dark:text-zinc-50 leading-none">Calendar & Events</h3>
              <p class="text-[10px] text-zinc-400 mt-1">Upcoming official assemblies and deadlines</p>
            </div>

            <div class="space-y-3">
              @for (evt of state.upcomingEvents(); track evt.id) {
                <div 
                  [class]="state.isDark() ? 'bg-zinc-950/80 border-zinc-850 hover:bg-zinc-950' : 'bg-zinc-50 border-zinc-150 hover:bg-zinc-100/50'"
                  class="p-4.5 rounded-xl border space-y-2.5 transition-all duration-300 animate-blur-slide clickable-scale">
                  
                  <div class="flex items-center justify-between gap-2">
                    <h4 class="font-bold text-xs text-zinc-900 dark:text-zinc-50 truncate">{{ evt.title }}</h4>
                    <span [class]="getEventTypeColor(evt.type)" class="text-[8px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase font-mono shrink-0">
                      {{ evt.type }}
                    </span>
                  </div>

                  <div class="flex flex-col gap-1 text-[10px] text-zinc-400 font-semibold">
                    <div class="flex items-center gap-1.5">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75" />
                      </svg>
                      <span>{{ evt.date }} &#64; {{ evt.time }}</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                      </svg>
                      <span>{{ evt.location }}</span>
                    </div>
                  </div>

                </div>
              }
            </div>
          </div>

          <!-- Quick Actions panel -->
          <div 
            [class]="state.isDark() ? 'bg-zinc-900/60 border-zinc-900' : 'bg-white border-zinc-200'"
            class="rounded-2xl border p-6 space-y-4">
            <div>
              <h3 class="font-bold text-sm text-zinc-900 dark:text-zinc-50 leading-none">Console Shortcuts</h3>
              <p class="text-[10px] text-zinc-400 mt-1">Registrar shortcuts for swift entries</p>
            </div>

            <div class="grid grid-cols-2 gap-2 text-xs font-semibold">
              <button [class]="state.isDark() ? 'bg-zinc-950 border-zinc-850 hover:bg-zinc-950 text-zinc-300' : 'bg-zinc-50 border-zinc-150 hover:bg-zinc-100/50 text-zinc-700'" class="p-3 border rounded-xl flex flex-col gap-2 items-center text-center clickable-scale">
                <svg class="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                </svg>
                <span>Add Student</span>
              </button>
              
              <button [class]="state.isDark() ? 'bg-zinc-950 border-zinc-850 hover:bg-zinc-950 text-zinc-300' : 'bg-zinc-50 border-zinc-150 hover:bg-zinc-100/50 text-zinc-700'" class="p-3 border rounded-xl flex flex-col gap-2 items-center text-center clickable-scale">
                <svg class="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.375M9 18h3.375m1.875-12h-.75c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125h.75c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125ZM9 3.75h.75c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125H9c-.621 0-1.125-.504-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125ZM9 9h.75c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125H9c-.621 0-1.125-.504-1.125-1.125v-1.5C7.875 9.504 8.379 9 9 9Z" />
                </svg>
                <span>Record Absence</span>
              </button>

              <button [class]="state.isDark() ? 'bg-zinc-950 border-zinc-850 hover:bg-zinc-950 text-zinc-300' : 'bg-zinc-50 border-zinc-150 hover:bg-zinc-100/50 text-zinc-700'" class="p-3 border rounded-xl flex flex-col gap-2 items-center text-center clickable-scale">
                <svg class="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a3 3 0 1 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
                <span>Post Notice</span>
              </button>

              <button [class]="state.isDark() ? 'bg-zinc-950 border-zinc-850 hover:bg-zinc-950 text-zinc-300' : 'bg-zinc-50 border-zinc-150 hover:bg-zinc-100/50 text-zinc-700'" class="p-3 border rounded-xl flex flex-col gap-2 items-center text-center clickable-scale">
                <svg class="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
                <span>Edit Calendar</span>
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
    { id: 201, subject: 'AP Calculus BC', code: 'MATH-401', teacher: 'Dr. Elizabeth Vance', room: 'Gymnasium Annex 2A', pax: 28, maxPax: 30, color: 'avatar-grad-1' },
    { id: 202, subject: 'Honors Chemistry', code: 'CHEM-302', teacher: 'Prof. Julian Crane', room: 'Science Hall 3B', pax: 24, maxPax: 25, color: 'avatar-grad-2' },
    { id: 203, subject: 'English Literature', code: 'LIT-201', teacher: 'Ms. Clara Oswald', room: 'Humanities Room 12', pax: 19, maxPax: 30, color: 'avatar-grad-3' },
    { id: 204, subject: 'Intro to Microeconomics', code: 'ECON-101', teacher: 'Dr. Alistair Finch', room: 'Lecture Hall C', pax: 45, maxPax: 50, color: 'avatar-grad-4' }
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
      case 'academic': return 'bg-teal-500';
      case 'system': return 'bg-amber-500';
      case 'administrative': return 'bg-purple-500';
      default: return 'bg-zinc-400';
    }
  }

  protected getEventTypeColor(type: string): string {
    switch (type) {
      case 'academic': return 'bg-teal-500/10 text-teal-500 border border-teal-500/20';
      case 'sports': return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
      default: return 'bg-purple-500/10 text-purple-500 border border-purple-500/20';
    }
  }
}
