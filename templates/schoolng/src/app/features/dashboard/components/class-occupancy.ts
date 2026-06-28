import { Component, inject, computed } from '@angular/core';
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
  imports: [],
  template: `
    <div class="rounded-xl border bg-theme-panel border-theme-border p-5 space-y-3">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-medium text-xs text-theme-text-main tracking-wider capitalize">Class Occupancy</h3>
          <p class="text-[10px] text-theme-text-muted font-normal mt-1">Scheduled lectures for today</p>
        </div>
        <button class="text-[10px] font-medium px-2.5 py-1.5 bg-theme-panel border border-theme-border hover:bg-theme-hover text-theme-text-muted hover:text-theme-text-main rounded-lg transition-all clickable-scale">View All</button>
      </div>

      <!-- Subject Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        @for (cls of filteredClasses(); track cls.id) {
          <div 
            class="p-4 rounded-xl border bg-theme-nested border-theme-border/60 hover:border-theme-border transition-all duration-200 animate-blur-slide clickable-scale">
            
            <div class="flex items-start justify-between">
              <div>
                <!-- Dynamic badge color matching its progress bar accent -->
                <span [class]="cls.badgeColor" class="text-[8px] font-mono px-1.5 py-0.5 rounded font-medium select-none border">
                  {{ cls.code }}
                </span>
                <h4 class="font-medium text-sm text-theme-text-main mt-2 truncate max-w-40">{{ cls.subject }}</h4>
                <p class="text-[10px] text-theme-text-muted font-normal mt-1">{{ cls.teacher }}</p>
              </div>
            </div>

            <div class="mt-3.5">
              <div class="flex items-center justify-between text-[9px] text-theme-text-muted font-normal mb-1 font-sans">
                <span>Occupants</span>
                <span>{{ cls.pax }} / {{ cls.maxPax }} ({{ getPercent(cls.pax, cls.maxPax) }}%)</span>
              </div>
              <!-- Colored progress bar -->
              <div class="w-full h-1 rounded-full bg-theme-hover overflow-hidden">
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
      badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30' 
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
      badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400 dark:border-blue-500/30' 
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
      badgeColor: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/30' 
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
      badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400 dark:border-amber-500/30' 
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
