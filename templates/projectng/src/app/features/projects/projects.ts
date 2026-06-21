import { Component, inject, signal, computed } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { TaskModalComponent } from './task-modal';
import { DropdownComponent } from '../../shared/components/dropdown';
import { WorkspaceService } from '../../shared/services/workspace.service';

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
  selector: 'app-projects',
  imports: [RouterOutlet, RouterLink, TaskModalComponent, DropdownComponent],
  template: `
    <div class="space-y-6 animate-blur-slide">
      
      <!-- Toolbar Filters and switches (Flat aesthetic) -->
      <section class="flex flex-col sm:flex-row gap-4 items-center justify-between">
        
        <!-- Search and Custom Dropdown Filters -->
        <div class="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <!-- Priority Filter Custom Dropdown -->
          <div class="w-40 shrink-0">
            <app-dropdown 
              [options]="priorityFilterOptions"
              [selected]="selectedPriority()"
              (selectionChange)="selectedPriority.set($event)">
            </app-dropdown>
          </div>
        </div>

        <!-- View mode toggle and trigger -->
        <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
          
          <!-- Flat layout switch -->
          <div [class]="isDark() ? 'bg-zinc-900/60 border-zinc-850' : 'bg-zinc-100 border-zinc-200'" class="p-1 rounded-xl border flex items-center select-none">
            <button 
              routerLink="timeline" 
              [class]="isViewModeActive('timeline') ? (isDark() ? 'bg-zinc-800 text-zinc-50 font-bold' : 'bg-white text-zinc-950 font-bold shadow-sm') : 'text-zinc-400 hover:text-zinc-650'"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all">
              Timeline
            </button>
            <button 
              routerLink="list" 
              [class]="isViewModeActive('list') ? (isDark() ? 'bg-zinc-800 text-zinc-50 font-bold' : 'bg-white text-zinc-950 font-bold shadow-sm') : 'text-zinc-400 hover:text-zinc-650'"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all">
              List (Linear)
            </button>
          </div>

          <!-- Add Project Button -->
          <button 
            (click)="isModalOpen.set(true)" 
            class="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-950 font-bold text-xs transition-colors cursor-pointer select-none flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            Create Project
          </button>
        </div>
      </section>

      <!-- View Selector -->
      <router-outlet></router-outlet>

    </div>

    <!-- Custom Dropdown Form Modal -->
    @if (isModalOpen()) {
      <app-projects-task-modal 
        [isDark]="isDark()" 
        (close)="isModalOpen.set(false)" 
        (taskCreated)="handleTaskCreated($event)">
      </app-projects-task-modal>
    }
  `
})
export class ProjectsComponent {
  private readonly state = inject(WorkspaceService);
  private readonly router = inject(Router);

  protected readonly isDark = this.state.isDark;
  protected readonly searchQuery = this.state.searchQuery;
  protected readonly tasks = this.state.tasks;

  protected readonly selectedPriority = signal<string>('All Priorities');
  protected readonly isModalOpen = signal(false);

  protected readonly priorityFilterOptions = ['All Priorities', 'High', 'Medium', 'Low'];

  // Filter tasks computed signal (accessed by child router views)
  public readonly filteredTasks = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const priority = this.selectedPriority();
    
    return this.tasks().filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(query);
      const matchesPriority = priority === 'All Priorities' || task.priority === priority;
      return matchesSearch && matchesPriority;
    });
  });

  protected isViewModeActive(mode: string): boolean {
    return this.router.url.endsWith(mode) || (mode === 'timeline' && this.router.url.endsWith('/projects'));
  }

  protected handleTaskCreated(data: {
    title: string;
    priority: 'High' | 'Medium' | 'Low';
    startDate: string;
    endDate: string;
    theme: 'orange' | 'purple' | 'pink' | 'green' | 'blue';
  }): void {
    this.state.handleTaskCreated(data);
    this.isModalOpen.set(false);
  }
}
