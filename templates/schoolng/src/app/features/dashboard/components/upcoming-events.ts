import { Component, inject } from '@angular/core';
import { SchoolService } from '../../../shared/services/school.service';

@Component({
  selector: 'app-dashboard-upcoming-events',
  standalone: true,
  imports: [],
  template: `
    <div class="rounded-xl border bg-white dark:bg-zinc-955 border-zinc-200 dark:border-zinc-800/80 p-5 space-y-3">
      <div>
        <h3 class="font-medium text-xs text-zinc-900 dark:text-zinc-50 tracking-wider capitalize">Calendar & Events</h3>
        <p class="text-[10px] text-zinc-400 font-normal mt-1">Upcoming official assemblies and deadlines</p>
      </div>

      <div class="space-y-2.5">
        @for (evt of state.upcomingEvents(); track evt.id) {
          <div 
            class="p-3.5 rounded-xl border bg-white dark:bg-zinc-100/40 border-zinc-200 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 animate-blur-slide clickable-scale font-sans">
            
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
  `
})
export class DashboardUpcomingEventsComponent {
  protected readonly state = inject(SchoolService);

  protected getEventTypeColor(type: string): string {
    switch (type) {
      case 'academic': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
      case 'sports': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
      default: return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20';
    }
  }
}
