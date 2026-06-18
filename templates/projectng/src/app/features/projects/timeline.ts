import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Task {
  id: number;
  title: string;
  dateRange: string;
  priority: 'High' | 'Medium' | 'Low';
  theme: 'orange' | 'purple' | 'pink' | 'green' | 'blue';
  gridColumn: string;
  status: 'Backlog' | 'Todo' | 'In Progress' | 'Done';
  assignees: string[];
}

@Component({
  selector: 'app-projects-timeline',
  imports: [CommonModule],
  template: `
    <div [class]="isDark() ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-zinc-200'" class="rounded-2xl border p-5 overflow-x-auto w-full">
      <div class="min-w-[700px]">
      
      <!-- Calendar Navigator Bar -->
      <div class="flex items-center justify-between mb-6">
        <button [class]="isDark() ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-750' : 'bg-zinc-100 border-zinc-200 text-zinc-850 hover:bg-zinc-200'" class="px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer select-none">
          Today
        </button>
        
        <div class="flex items-center gap-1.5">
          <button [class]="isDark() ? 'bg-zinc-800 border-zinc-700 hover:bg-zinc-750' : 'bg-white border-zinc-200 hover:bg-zinc-50'" class="p-1.5 rounded-xl border cursor-pointer">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" /></svg>
          </button>
          
          <div [class]="isDark() ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-200'" class="px-4 py-1.5 rounded-xl border text-xs font-bold">
            Jun 15 - Jun 21
          </div>
          
          <button [class]="isDark() ? 'bg-zinc-800 border-zinc-700 hover:bg-zinc-750' : 'bg-white border-zinc-200 hover:bg-zinc-50'" class="p-1.5 rounded-xl border cursor-pointer">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      <!-- Days grid header -->
      <div class="grid grid-cols-7 border-b pb-3 mb-4 text-center font-display font-bold text-xs text-zinc-400" [class]="isDark() ? 'border-zinc-800' : 'border-zinc-200'">
        <div>Mon 15</div>
        <div>Tue 16</div>
        <div>Wed 17</div>
        <div class="text-purple-500 font-extrabold relative">
          Thu 18
          <span class="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-purple-500"></span>
        </div>
        <div>Fri 19</div>
        <div>Sat 20</div>
        <div>Sun 21</div>
      </div>

      <!-- Gantt Blocks Area -->
      <div class="grid grid-cols-7 gap-y-4 relative min-h-[300px]">
        
        <!-- Vertical timeline line on Column 4 (Thu 18) -->
        <div class="absolute inset-y-0 left-[50%] -translate-x-1/2 w-[2px] bg-purple-500/60 pointer-events-none z-10" style="grid-column: 4;"></div>

        <!-- Render Task Blocks -->
        @for (task of tasks(); track task.id) {
          <div 
            [style.grid-column]="task.gridColumn" 
            [class]="isDark() ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200'"
            class="rounded-xl border p-4 relative flex flex-col justify-between min-h-[110px] group transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
            [class.border-b-4]="true"
            [class.border-b-amber-500]="task.theme === 'orange'"
            [class.border-b-purple-500]="task.theme === 'purple'"
            [class.border-b-pink-500]="task.theme === 'pink'"
            [class.border-b-emerald-500]="task.theme === 'green'"
            [class.border-b-blue-500]="task.theme === 'blue'">
            
            <!-- Card content -->
            <div class="flex items-start justify-between gap-4">
              <div>
                <h4 class="font-bold text-xs group-hover:text-teal-500 transition-colors">{{ task.title }}</h4>
                <p class="text-[9px] text-zinc-400 mt-1 font-semibold">{{ task.dateRange }}</p>
              </div>
              
              <!-- Action Button (Delete) -->
              <button (click)="taskDelete.emit(task.id)" class="p-1 rounded-md text-zinc-400 hover:text-red-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all opacity-0 group-hover:opacity-100 cursor-pointer select-none">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>

            <!-- Footer of card -->
            <div class="flex items-center justify-between mt-3">
              <!-- Priority -->
              <span 
                [class]="task.priority === 'High' ? 'text-red-500 bg-red-500/10 border-red-500/20' : (task.priority === 'Medium' ? 'text-yellow-550 bg-yellow-550/10 border-yellow-550/20' : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20')"
                class="flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[8px] font-bold uppercase tracking-wider">
                <span [class]="task.priority === 'High' ? 'bg-red-500' : (task.priority === 'Medium' ? 'bg-yellow-550' : 'bg-emerald-500')" class="w-1 h-1 rounded-full"></span>
                {{ task.priority }}
              </span>

              <!-- Assignees stack -->
              <div class="flex items-center -space-x-1.5 select-none">
                @for (assignee of task.assignees.slice(0, 3); track assignee) {
                  <div 
                    [class]="getAvatarGrad(assignee) + (isDark() ? ' border-zinc-950' : ' border-zinc-50')" 
                    class="w-5.5 h-5.5 rounded-full border flex items-center justify-center font-bold text-[7px] text-white">
                    {{ assignee }}
                  </div>
                }
                @if (task.assignees.length > 3) {
                  <div class="w-5.5 h-5.5 rounded-full border bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-[7px] text-zinc-400" [class]="isDark() ? 'border-zinc-950' : 'border-zinc-50'">
                    +{{ task.assignees.length - 3 }}
                  </div>
                }
              </div>
            </div>

          </div>
        }
      </div>
    </div>
  </div>
  `
})
export class TimelineComponent {
  public readonly isDark = input<boolean>(false);
  public readonly tasks = input<Task[]>([]);
  public readonly taskDelete = output<number>();

  protected getAvatarGrad(initials: string): string {
    const map: Record<string, string> = {
      'LN': 'avatar-grad-1',
      'SD': 'avatar-grad-2',
      'SU': 'avatar-grad-2',
      'AN': 'avatar-grad-3',
      'DK': 'avatar-grad-4',
      'DP': 'avatar-grad-5'
    };
    return map[initials] || 'avatar-grad-1';
  }
}
