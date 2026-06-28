import { Component, inject } from '@angular/core';
import { SchoolService } from '../../../shared/services/school.service';

@Component({
  selector: 'app-dashboard-shortcuts',
  standalone: true,
  imports: [],
  template: `
    <div 
      class="rounded-xl border bg-white border-zinc-200 p-5 space-y-3">
      <div>
        <h3 class="font-medium text-xs text-zinc-900 tracking-wider capitalize">Console Shortcuts</h3>
        <p class="text-[10px] text-zinc-400 font-normal mt-1">Registrar shortcuts for swift entries</p>
      </div>

      <div class="grid grid-cols-2 gap-2 text-[11px] font-medium font-sans">
        <button class="p-3 border rounded-xl flex flex-col gap-2 items-center text-center bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition-colors clickable-scale">
          <!-- Lucide: user-plus -->
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400 shrink-0"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
          <span>Add Student</span>
        </button>
        
        <button class="p-3 border rounded-xl flex flex-col gap-2 items-center text-center bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition-colors clickable-scale">
          <!-- Lucide: clipboard-check -->
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400 shrink-0"><rect width="8" height="4" x="9" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>
          <span>Absences</span>
        </button>

        <button class="p-3 border rounded-xl flex flex-col gap-2 items-center text-center bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition-colors clickable-scale">
          <!-- Lucide: megaphone -->
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400 shrink-0"><path d="m3 11 18-5v12L3 13v-2Z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
          <span>Post Notice</span>
        </button>

        <button class="p-3 border rounded-xl flex flex-col gap-2 items-center text-center bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition-colors clickable-scale">
          <!-- Lucide: calendar-plus -->
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400 shrink-0"><path d="M8 2v4M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18M16 14h-8M12 11v6"/></svg>
          <span>Add Event</span>
        </button>
      </div>
    </div>
  `
})
export class DashboardShortcutsComponent {
  protected readonly state = inject(SchoolService);
}
