import { Component, inject, computed } from '@angular/core';
import { SchoolService } from '../../../shared/services/school.service';

@Component({
  selector: 'app-dashboard-activity-logs',
  standalone: true,
  imports: [],
  template: `
    <div class="rounded-xl border bg-white dark:bg-zinc-100 border-zinc-200 dark:border-zinc-800/80 p-5 space-y-3">
      <div>
        <h3 class="font-medium text-xs text-zinc-900 dark:text-zinc-50 tracking-wider capitalize">Registrar Activity</h3>
        <p class="text-[10px] text-zinc-400 dark:text-zinc-500 font-normal mt-1">Live audit log of registrar activity and marks entries</p>
      </div>

      <div class="divide-y divide-zinc-100 dark:divide-zinc-900 font-sans">
        @for (log of filteredLogs(); track log.id) {
          <div class="py-2.5 flex items-start justify-between gap-4 text-xs font-normal animate-blur-slide">
            <div class="flex items-start gap-3">
              <span [class]="getCategoryColor(log.category)" class="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"></span>
              <p class="text-zinc-650 dark:text-zinc-300 leading-normal">{{ log.message }}</p>
            </div>
            <span class="text-[9px] text-zinc-400 dark:text-zinc-500 whitespace-nowrap pt-0.5 font-mono select-none font-normal">{{ log.time }}</span>
          </div>
        }
      </div>
    </div>
  `
})
export class DashboardActivityLogsComponent {
  protected readonly state = inject(SchoolService);

  protected readonly filteredLogs = computed(() => {
    const logs = this.state.activityLogs();
    const query = this.state.searchQuery().toLowerCase();
    if (!query) return logs;
    return logs.filter(l => l.message.toLowerCase().includes(query));
  });

  protected getCategoryColor(cat: string): string {
    switch (cat) {
      case 'academic': return 'bg-emerald-500';
      case 'system': return 'bg-amber-500';
      case 'administrative': return 'bg-indigo-500';
      default: return 'bg-zinc-400';
    }
  }
}
