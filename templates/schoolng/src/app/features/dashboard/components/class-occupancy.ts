import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchoolService } from '../../../shared/services/school.service';

interface ClassGroup {
  id: number;
  subject: string;
  code: string;
  teacher: string;
  room: string;
  pax: number;
  maxPax: number;
  color: string;
  badgeColor: string;
}

@Component({
  selector: 'app-dashboard-class-occupancy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rounded-xl border bg-white dark:bg-zinc-955 border-zinc-200 dark:border-zinc-800/80 p-5 space-y-3">
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
            class="p-4 rounded-xl border bg-white dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 animate-blur-slide clickable-scale">
            
            <div class="flex items-start justify-between">
              <div>
                <!-- Dynamic badge color matching its progress bar accent -->
                <span [class]="cls.badgeColor" class="text-[8px] font-mono px-1.5 py-0.5 rounded font-medium select-none border">
                  {{ cls.code }}
                </span>
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
  `
})
export class DashboardClassOccupancyComponent {
  protected readonly state = inject(SchoolService);

  // Active Subject Cohorts mock data
  protected readonly classGroups: ClassGroup[] = [
    { 
      id: 201, 
      subject: 'AP Calculus BC', 
      code: 'MATH-401', 
      teacher: 'Dr. Elizabeth Vance', 
      room: 'Gymnasium Annex 2A', 
      pax: 28, 
      maxPax: 30, 
      color: 'bg-emerald-500', 
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-500/10' 
    },
    { 
      id: 202, 
      subject: 'Honors Chemistry', 
      code: 'CHEM-302', 
      teacher: 'Prof. Julian Crane', 
      room: 'Science Hall 3B', 
      pax: 24, 
      maxPax: 25, 
      color: 'bg-blue-500', 
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 dark:border-blue-500/10' 
    },
    { 
      id: 203, 
      subject: 'English Literature', 
      code: 'LIT-201', 
      teacher: 'Ms. Clara Oswald', 
      room: 'Humanities Room 12', 
      pax: 19, 
      maxPax: 30, 
      color: 'bg-indigo-500', 
      badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 dark:border-indigo-500/10' 
    },
    { 
      id: 204, 
      subject: 'Intro to Microeconomics', 
      code: 'ECON-101', 
      teacher: 'Dr. Alistair Finch', 
      room: 'Lecture Hall C', 
      pax: 45, 
      maxPax: 50, 
      color: 'bg-amber-500', 
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 dark:border-amber-500/10' 
    }
  ];

  protected readonly filteredClasses = computed(() => {
    const query = this.state.searchQuery().toLowerCase();
    if (!query) return this.classGroups;
    return this.classGroups.filter(c => 
      c.subject.toLowerCase().includes(query) || 
      c.code.toLowerCase().includes(query) ||
      c.teacher.toLowerCase().includes(query)
    );
  });

  protected getPercent(pax: number, max: number): number {
    return Math.round((pax / max) * 100);
  }
}
