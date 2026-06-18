import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CalendarDay {
  dayNumber: number;
  isCurrentMonth: boolean;
  tasks: { title: string; theme: 'orange' | 'purple' | 'pink' | 'green' | 'blue' }[];
}

@Component({
  selector: 'app-calendar',
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-blur-slide font-sans">
      
      <!-- Controls Panel -->
      <section class="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div class="flex items-center gap-3">
          <button 
            (click)="prevMonth()" 
            [class]="isDark() ? 'bg-zinc-900 border-zinc-850 hover:bg-zinc-800 text-zinc-300' : 'bg-white border-zinc-200 hover:bg-zinc-50'"
            class="p-1.5 rounded-xl border cursor-pointer clickable-scale shrink-0 select-none">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h2 class="font-display font-extrabold text-md tracking-tight select-none">
            June 2026
          </h2>
          
          <button 
            (click)="nextMonth()" 
            [class]="isDark() ? 'bg-zinc-900 border-zinc-850 hover:bg-zinc-800 text-zinc-300' : 'bg-white border-zinc-200 hover:bg-zinc-50'"
            class="p-1.5 rounded-xl border cursor-pointer clickable-scale shrink-0 select-none">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div [class]="isDark() ? 'bg-zinc-900/60 border-zinc-850' : 'bg-zinc-100 border-zinc-200'" class="p-1 rounded-xl border flex items-center select-none">
            <button 
              (click)="calendarView.set('month')" 
              [class]="calendarView() === 'month' ? (isDark() ? 'bg-zinc-800 text-zinc-50 font-bold' : 'bg-white text-zinc-950 font-bold shadow-sm') : 'text-zinc-400 hover:text-zinc-650'"
              class="px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all clickable-scale">
              Month
            </button>
            <button 
              (click)="calendarView.set('week')" 
              [class]="calendarView() === 'week' ? (isDark() ? 'bg-zinc-800 text-zinc-50 font-bold' : 'bg-white text-zinc-950 font-bold shadow-sm') : 'text-zinc-400 hover:text-zinc-650'"
              class="px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all clickable-scale">
              Week
            </button>
          </div>

          <button 
            (click)="createEvent()"
            class="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-950 font-bold text-xs transition-colors cursor-pointer select-none clickable-scale">
            Add Event
          </button>
        </div>
      </section>

      <!-- Calendar Month Grid -->
      <section [class]="isDark() ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-zinc-200'" class="border rounded-2xl overflow-hidden shadow-sm">
        
        <!-- Weekdays Header -->
        <div class="grid grid-cols-7 text-center font-display font-bold text-xs text-zinc-400 border-b py-3" [class]="isDark() ? 'border-zinc-800 bg-zinc-900/20' : 'border-zinc-200 bg-zinc-50/50'">
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
          <div>Sun</div>
        </div>

        <!-- Days Grid -->
        <div class="grid grid-cols-7 grid-rows-5 divide-x divide-y" [class]="isDark() ? 'divide-zinc-850 border-zinc-850' : 'divide-zinc-200 border-zinc-200'">
          @for (day of calendarDays; track day.dayNumber) {
            <div 
              [class]="day.isCurrentMonth ? '' : (isDark() ? 'bg-zinc-950/20 text-zinc-600' : 'bg-zinc-50/40 text-zinc-400')"
              class="min-h-[90px] p-3 flex flex-col justify-between hover:bg-zinc-100/10 dark:hover:bg-zinc-800/10 transition-colors">
              <span class="text-xs font-bold">{{ day.dayNumber }}</span>
              
              <!-- Tasks inside cells -->
              <div class="space-y-1.5 mt-2">
                @for (task of day.tasks; track task.title) {
                  <div 
                    [class]="'px-2 py-0.5 rounded text-[8px] font-bold border truncate select-none cursor-pointer clickable-scale ' + getTaskClasses(task.theme)">
                    {{ task.title }}
                  </div>
                }
              </div>
            </div>
          }
        </div>

      </section>

    </div>
  `
})
export class CalendarComponent {
  public readonly isDark = input<boolean>(false);
  protected readonly calendarView = signal<'month' | 'week'>('month');

  protected getTaskClasses(theme: string): string {
    switch (theme) {
      case 'orange':
        return 'bg-orange-500/8 text-orange-500 border-orange-500/20';
      case 'purple':
        return 'bg-purple-500/8 text-purple-500 border-purple-500/20';
      case 'pink':
        return 'bg-pink-500/8 text-pink-500 border-pink-500/20';
      case 'green':
        return 'bg-emerald-500/8 text-emerald-500 border-emerald-500/20';
      case 'blue':
        return 'bg-blue-500/8 text-blue-500 border-blue-500/20';
      default:
        return 'bg-zinc-500/8 text-zinc-500 border-zinc-500/20';
    }
  }

  // Hardcoded June 2026 Monthly Calendar Layout
  protected readonly calendarDays: CalendarDay[] = [
    // Pre-month filler
    { dayNumber: 25, isCurrentMonth: false, tasks: [] },
    { dayNumber: 26, isCurrentMonth: false, tasks: [] },
    { dayNumber: 27, isCurrentMonth: false, tasks: [] },
    { dayNumber: 28, isCurrentMonth: false, tasks: [] },
    { dayNumber: 29, isCurrentMonth: false, tasks: [] },
    { dayNumber: 30, isCurrentMonth: false, tasks: [] },
    { dayNumber: 1, isCurrentMonth: true, tasks: [] },
    
    // June week 1
    { dayNumber: 2, isCurrentMonth: true, tasks: [] },
    { dayNumber: 3, isCurrentMonth: true, tasks: [] },
    { dayNumber: 4, isCurrentMonth: true, tasks: [] },
    { dayNumber: 5, isCurrentMonth: true, tasks: [] },
    { dayNumber: 6, isCurrentMonth: true, tasks: [] },
    { dayNumber: 7, isCurrentMonth: true, tasks: [] },
    { dayNumber: 8, isCurrentMonth: true, tasks: [] },
    
    // June week 2
    { dayNumber: 9, isCurrentMonth: true, tasks: [] },
    { dayNumber: 10, isCurrentMonth: true, tasks: [] },
    { dayNumber: 11, isCurrentMonth: true, tasks: [] },
    { dayNumber: 12, isCurrentMonth: true, tasks: [] },
    { dayNumber: 13, isCurrentMonth: true, tasks: [] },
    { dayNumber: 14, isCurrentMonth: true, tasks: [] },
    { 
      dayNumber: 15, 
      isCurrentMonth: true, 
      tasks: [{ title: 'Design Tokens Refactoring', theme: 'purple' }] 
    },
    
    // June week 3
    { 
      dayNumber: 16, 
      isCurrentMonth: true, 
      tasks: [{ title: 'Core API Auth integrations', theme: 'blue' }] 
    },
    { 
      dayNumber: 17, 
      isCurrentMonth: true, 
      tasks: [{ title: 'Gantt Timeline Engine', theme: 'green' }] 
    },
    { 
      dayNumber: 18, 
      isCurrentMonth: true, 
      tasks: [{ title: 'System Migration', theme: 'orange' }] 
    },
    { 
      dayNumber: 19, 
      isCurrentMonth: true, 
      tasks: [{ title: 'E2E Integration testing', theme: 'pink' }] 
    },
    { dayNumber: 20, isCurrentMonth: true, tasks: [] },
    { dayNumber: 21, isCurrentMonth: true, tasks: [] },
    { dayNumber: 22, isCurrentMonth: true, tasks: [] },
    
    // June week 4
    { dayNumber: 23, isCurrentMonth: true, tasks: [] },
    { dayNumber: 24, isCurrentMonth: true, tasks: [] },
    { dayNumber: 25, isCurrentMonth: true, tasks: [] },
    { dayNumber: 26, isCurrentMonth: true, tasks: [] },
    { dayNumber: 27, isCurrentMonth: true, tasks: [] },
    { dayNumber: 28, isCurrentMonth: true, tasks: [] },
    { dayNumber: 29, isCurrentMonth: true, tasks: [] },
    
    // Post-month filler
    { dayNumber: 30, isCurrentMonth: true, tasks: [] },
    { dayNumber: 1, isCurrentMonth: false, tasks: [] },
    { dayNumber: 2, isCurrentMonth: false, tasks: [] },
    { dayNumber: 3, isCurrentMonth: false, tasks: [] },
    { dayNumber: 4, isCurrentMonth: false, tasks: [] }
  ];

  protected prevMonth(): void {
    console.log('Navigating to previous month...');
  }

  protected nextMonth(): void {
    console.log('Navigating to next month...');
  }

  protected createEvent(): void {
    alert('Create Calendar Event: Select a day to assign a scheduled project NG task.');
  }
}
