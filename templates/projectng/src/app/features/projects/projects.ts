import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineComponent } from './timeline';
import { ListComponent } from './list';
import { TaskModalComponent } from './task-modal';
import { DropdownComponent } from '../../shared/components/dropdown';

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
  imports: [CommonModule, TimelineComponent, ListComponent, TaskModalComponent, DropdownComponent],
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
              (click)="viewMode.set('timeline')" 
              [class]="viewMode() === 'timeline' ? (isDark() ? 'bg-zinc-800 text-zinc-50 font-bold' : 'bg-white text-zinc-950 font-bold shadow-sm') : 'text-zinc-400 hover:text-zinc-650'"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all">
              Timeline
            </button>
            <button 
              (click)="viewMode.set('list')" 
              [class]="viewMode() === 'list' ? (isDark() ? 'bg-zinc-800 text-zinc-50 font-bold' : 'bg-white text-zinc-950 font-bold shadow-sm') : 'text-zinc-400 hover:text-zinc-650'"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all">
              List (Linear)
            </button>
          </div>

          <!-- Add Project Button -->
          <button 
            (click)="isModalOpen.set(true)" 
            class="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-150 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-950 font-bold text-xs transition-colors cursor-pointer select-none flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            Create Project
          </button>
        </div>
      </section>

      <!-- View Selector -->
      @if (viewMode() === 'timeline') {
        <app-projects-timeline 
          [isDark]="isDark()" 
          [tasks]="filteredTasks()" 
          (taskDelete)="deleteTask($event)">
        </app-projects-timeline>
      } @else {
        <app-projects-list 
          [isDark]="isDark()" 
          [tasks]="filteredTasks()" 
          (taskDelete)="deleteTask($event)">
        </app-projects-list>
      }

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
  public readonly isDark = input<boolean>(false);
  public readonly searchQuery = input<string>('');
  public readonly tasks = input<Task[]>([]);

  public readonly taskDelete = output<number>();
  public readonly taskCreated = output<{
    title: string;
    priority: 'High' | 'Medium' | 'Low';
    startDate: string;
    endDate: string;
    theme: 'orange' | 'purple' | 'pink' | 'green' | 'blue';
  }>();

  protected readonly viewMode = signal<'timeline' | 'list'>('timeline');
  protected readonly selectedPriority = signal<string>('All Priorities');
  protected readonly isModalOpen = signal(false);

  protected readonly priorityFilterOptions = ['All Priorities', 'High', 'Medium', 'Low'];

  // Filter tasks computed signal
  protected readonly filteredTasks = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const priority = this.selectedPriority();
    
    return this.tasks().filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(query);
      const matchesPriority = priority === 'All Priorities' || task.priority === priority;
      return matchesSearch && matchesPriority;
    });
  });

  protected deleteTask(id: number): void {
    this.taskDelete.emit(id);
  }

  protected handleTaskCreated(data: {
    title: string;
    priority: 'High' | 'Medium' | 'Low';
    startDate: string;
    endDate: string;
    theme: 'orange' | 'purple' | 'pink' | 'green' | 'blue';
  }): void {
    this.taskCreated.emit(data);
    this.isModalOpen.set(false);
  }
}
