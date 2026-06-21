import { Component, inject, signal } from '@angular/core';
import { WorkspaceService } from '../../shared/services/workspace.service';
import { ProjectsComponent } from './projects';

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
  selector: 'app-projects-list',
  imports: [],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in">
      
      <!-- Columns rendering -->
      @for (col of columns; track col.name) {
        <div class="space-y-4">
          
          <!-- Header -->
          <div class="flex items-center justify-between pb-2 border-b" [class]="isDark() ? 'border-zinc-800' : 'border-zinc-200'">
            <div class="flex items-center gap-2">
              <span [class]="col.dotClass" class="w-2.5 h-2.5 rounded-full"></span>
              <h3 class="font-bold text-xs tracking-tight text-zinc-800 dark:text-zinc-200">{{ col.name }}</h3>
            </div>
            
            <span class="text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-550">
              {{ getCount(col.name) }}
            </span>
          </div>

          <!-- Cards in column -->
          <div class="space-y-3 min-h-[300px]">
            @if (isLoading()) {
              @for (dummy of [1]; track $index) {
                <div class="bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200/30 dark:border-zinc-850/40 p-4 rounded-xl flex flex-col gap-3 animate-pulse min-h-[105px] justify-between">
                  <div class="space-y-2">
                    <div class="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
                    <div class="h-2 bg-zinc-200 dark:bg-zinc-800 rounded w-full"></div>
                  </div>
                  <div class="flex justify-between items-center mt-1">
                    <div class="h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded w-16"></div>
                    <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-8"></div>
                  </div>
                </div>
              }
            } @else {
              @for (task of tasks(); track task.id) {
                @if (task.status === col.name) {
                  
                  <!-- Kanban card -->
                  <div 
                    [class]="isDark() ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-zinc-200'" 
                    class="p-4 rounded-xl border flex flex-col gap-3 group transition-all duration-200 hover:border-zinc-350 dark:hover:border-zinc-700">
                    
                    <div class="flex items-start justify-between gap-3">
                      <h4 class="font-bold text-xs leading-snug">{{ task.title }}</h4>
                      
                      <button (click)="deleteTask(task.id)" class="text-zinc-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer select-none">
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>

                    <div class="flex items-center justify-between mt-1">
                      <span class="text-[9px] text-zinc-400 font-semibold">{{ task.dateRange }}</span>
                      
                      <!-- Priority -->
                      <span 
                        [class]="task.priority === 'High' ? 'text-red-500 bg-red-500/10' : (task.priority === 'Medium' ? 'text-yellow-550 bg-yellow-550/10' : 'text-emerald-500 bg-emerald-500/10')"
                        class="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider">
                        {{ task.priority }}
                      </span>
                    </div>
                  </div>

                }
              }
            }
          </div>

        </div>
      }
    </div>
  `
})
export class ListComponent {
  private readonly state = inject(WorkspaceService);
  protected readonly projectsComp = inject(ProjectsComponent);

  protected readonly isDark = this.state.isDark;
  protected readonly tasks = this.projectsComp.filteredTasks;

  protected readonly isLoading = signal(true);
  constructor() {
    setTimeout(() => this.isLoading.set(false), 600);
  }

  protected readonly columns = [
    { name: 'Backlog', dotClass: 'bg-zinc-455' },
    { name: 'Todo', dotClass: 'bg-blue-400' },
    { name: 'In Progress', dotClass: 'bg-amber-500' },
    { name: 'Done', dotClass: 'bg-emerald-500' }
  ];

  protected deleteTask(id: number): void {
    this.state.handleTaskDelete(id);
  }

  protected getCount(status: string): number {
    return this.tasks().filter(t => t.status === status).length;
  }
}
