import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownComponent } from '../shared/components/dropdown';
import { WorkspaceService } from '../shared/services/workspace.service';

interface TodoTask {
  id: number;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  theme: 'orange' | 'purple' | 'pink' | 'green' | 'blue';
  column: 'Todo' | 'In Progress' | 'Done';
  assignee: string;
  assigneeGrad: string;
}

@Component({
  selector: 'app-todos',
  imports: [FormsModule, DropdownComponent],
  template: `
    <div class="space-y-6 animate-blur-slide font-sans">
      
      <!-- Header Area -->
      <section class="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div>
          <h2 class="font-display font-extrabold text-md tracking-tight select-none">
            Task Board
          </h2>
          <p class="text-xs text-zinc-400 mt-1">Manage team items, drag tasks across status boards, and organize sprint scopes.</p>
        </div>

        <button 
          (click)="toggleTaskForm()"
          class="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-950 font-bold text-xs transition-colors cursor-pointer select-none clickable-scale">
          {{ isFormOpen() ? 'Cancel' : 'New Task' }}
        </button>
      </section>

      <!-- Kanban Board Columns Grid -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- COLUMN: Todo -->
        <div 
          (dragover)="onDragOver($event)" 
          (drop)="onDrop($event, 'Todo')"
          [class]="isDark() ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-zinc-200'"
          class="p-4 rounded-2xl border min-h-[500px] flex flex-col gap-4 animate-blur-slide stagger-1 shadow-none">
          
          <div class="flex items-center justify-between pb-2 border-b" [class]="isDark() ? 'border-zinc-800' : 'border-zinc-100'">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-zinc-400"></span>
              <h3 class="font-bold text-xs">Todo</h3>
            </div>
            <span class="text-[9px] bg-zinc-100 dark:bg-zinc-800 text-zinc-455 px-1.5 py-0.5 rounded font-bold">
              {{ getTasksByColumn('Todo').length }}
            </span>
          </div>

          <!-- Cards Stack -->
          <div class="flex flex-col gap-3 flex-grow">
            @if (isLoading()) {
              @for (dummy of [1, 2]; track $index) {
                <div class="p-4 pl-5 rounded-xl border border-zinc-200/30 dark:border-zinc-850/40 bg-zinc-50 dark:bg-zinc-950/20 min-h-[105px] flex flex-col justify-between gap-3 animate-pulse">
                  <div class="space-y-2">
                    <div class="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
                    <div class="h-2 bg-zinc-200 dark:bg-zinc-800 rounded w-full"></div>
                  </div>
                  <div class="flex justify-between items-center">
                    <div class="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-10"></div>
                    <div class="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
                  </div>
                </div>
              }
            } @else {
              @for (task of getTasksByColumn('Todo'); track task.id) {
                @if (dragOverTaskId() === task.id) {
                  <div class="border-t-2 border-dashed border-zinc-400 dark:border-zinc-600 my-1 animate-pulse"></div>
                }
                <div 
                  draggable="true"
                  (dragstart)="onDragStart($event, task)"
                  (dragover)="onDragOverCard($event, task)"
                  (dragleave)="onDragLeaveCard($event)"
                  (dragend)="onDragEnd()"
                  [class]="isDark() ? 'border-zinc-850/60 hover:border-zinc-700' : 'border-zinc-100 hover:border-zinc-300'"
                  [class.bg-zinc-950]="isDark() && dragOverTaskId() !== task.id"
                  [class.bg-zinc-50]="!isDark() && dragOverTaskId() !== task.id"
                  [class.bg-zinc-100]="dragOverTaskId() === task.id && !isDark()"
                  [class.bg-zinc-800]="dragOverTaskId() === task.id && isDark()"
                  class="p-4 pl-5 rounded-xl border flex flex-col justify-between gap-3 cursor-grab active:cursor-grabbing transition-all select-none group relative overflow-hidden">
                  <div class="absolute left-0 top-0 bottom-0 w-1.5" [class]="getThemeBgClass(task.theme)"></div>
                  
                  <div class="space-y-1">
                    <div class="flex items-center gap-1.5">
                      <!-- 6-dot drag handle icon -->
                      <svg class="w-3 h-3.5 text-zinc-400 dark:text-zinc-600 cursor-grab active:cursor-grabbing flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="8" cy="6" r="2" />
                        <circle cx="8" cy="12" r="2" />
                        <circle cx="8" cy="18" r="2" />
                        <circle cx="16" cy="6" r="2" />
                        <circle cx="16" cy="12" r="2" />
                        <circle cx="16" cy="18" r="2" />
                      </svg>
                      <h4 class="font-bold text-xs group-hover:text-teal-500 transition-colors">{{ task.title }}</h4>
                    </div>
                    <p class="text-[9px] text-zinc-455 leading-relaxed font-semibold">{{ task.description }}</p>
                  </div>

                  <div class="flex items-center justify-between mt-1">
                    <span 
                      [class]="task.priority === 'High' ? 'text-red-500 bg-red-500/10 border-red-500/20' : (task.priority === 'Medium' ? 'text-yellow-600 bg-yellow-500/10 border-yellow-500/20' : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20')"
                      class="px-2 py-0.5 rounded text-[8px] font-bold border uppercase tracking-wider">
                      {{ task.priority }}
                    </span>
                    
                    <span [class]="task.assigneeGrad" class="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[7px] text-white">
                      {{ task.assignee }}
                    </span>
                  </div>

                </div>
              } @empty {
                <div class="flex-grow flex items-center justify-center border border-dashed rounded-xl" [class]="isDark() ? 'border-zinc-800 text-zinc-600' : 'border-zinc-200 text-zinc-400'">
                  <p class="text-[10px] font-semibold">Drag tasks here</p>
                </div>
              }
            }
          </div>
        </div>

        <!-- COLUMN: In Progress -->
        <div 
          (dragover)="onDragOver($event)" 
          (drop)="onDrop($event, 'In Progress')"
          [class]="isDark() ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-zinc-200'"
          class="p-4 rounded-2xl border min-h-[500px] flex flex-col gap-4 animate-blur-slide stagger-2 shadow-none">
          
          <div class="flex items-center justify-between pb-2 border-b" [class]="isDark() ? 'border-zinc-800' : 'border-zinc-100'">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-amber-500"></span>
              <h3 class="font-bold text-xs">In Progress</h3>
            </div>
            <span class="text-[9px] bg-zinc-100 dark:bg-zinc-800 text-zinc-455 px-1.5 py-0.5 rounded font-bold">
              {{ getTasksByColumn('In Progress').length }}
            </span>
          </div>

          <!-- Cards Stack -->
          <div class="flex flex-col gap-3 flex-grow">
            @if (isLoading()) {
              @for (dummy of [1]; track $index) {
                <div class="p-4 pl-5 rounded-xl border border-zinc-200/30 dark:border-zinc-850/40 bg-zinc-50 dark:bg-zinc-950/20 min-h-[105px] flex flex-col justify-between gap-3 animate-pulse">
                  <div class="space-y-2">
                    <div class="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
                    <div class="h-2 bg-zinc-200 dark:bg-zinc-800 rounded w-full"></div>
                  </div>
                  <div class="flex justify-between items-center">
                    <div class="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-10"></div>
                    <div class="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
                  </div>
                </div>
              }
            } @else {
              @for (task of getTasksByColumn('In Progress'); track task.id) {
                @if (dragOverTaskId() === task.id) {
                  <div class="border-t-2 border-dashed border-zinc-400 dark:border-zinc-600 my-1 animate-pulse"></div>
                }
                <div 
                  draggable="true"
                  (dragstart)="onDragStart($event, task)"
                  (dragover)="onDragOverCard($event, task)"
                  (dragleave)="onDragLeaveCard($event)"
                  (dragend)="onDragEnd()"
                  [class]="isDark() ? 'border-zinc-850/60 hover:border-zinc-700' : 'border-zinc-100 hover:border-zinc-300'"
                  [class.bg-zinc-950]="isDark() && dragOverTaskId() !== task.id"
                  [class.bg-zinc-50]="!isDark() && dragOverTaskId() !== task.id"
                  [class.bg-zinc-100]="dragOverTaskId() === task.id && !isDark()"
                  [class.bg-zinc-800]="dragOverTaskId() === task.id && isDark()"
                  class="p-4 pl-5 rounded-xl border flex flex-col justify-between gap-3 cursor-grab active:cursor-grabbing transition-all select-none group relative overflow-hidden">
                  <div class="absolute left-0 top-0 bottom-0 w-1.5" [class]="getThemeBgClass(task.theme)"></div>
                  
                  <div class="space-y-1">
                    <div class="flex items-center gap-1.5">
                      <!-- 6-dot drag handle icon -->
                      <svg class="w-3 h-3.5 text-zinc-400 dark:text-zinc-600 cursor-grab active:cursor-grabbing flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="8" cy="6" r="2" />
                        <circle cx="8" cy="12" r="2" />
                        <circle cx="8" cy="18" r="2" />
                        <circle cx="16" cy="6" r="2" />
                        <circle cx="16" cy="12" r="2" />
                        <circle cx="16" cy="18" r="2" />
                      </svg>
                      <h4 class="font-bold text-xs group-hover:text-teal-500 transition-colors">{{ task.title }}</h4>
                    </div>
                    <p class="text-[9px] text-zinc-455 leading-relaxed font-semibold">{{ task.description }}</p>
                  </div>

                  <div class="flex items-center justify-between mt-1">
                    <span 
                      [class]="task.priority === 'High' ? 'text-red-500 bg-red-500/10 border-red-500/20' : (task.priority === 'Medium' ? 'text-yellow-600 bg-yellow-500/10 border-yellow-500/20' : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20')"
                      class="px-2 py-0.5 rounded text-[8px] font-bold border uppercase tracking-wider">
                      {{ task.priority }}
                    </span>
                    
                    <span [class]="task.assigneeGrad" class="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[7px] text-white">
                      {{ task.assignee }}
                    </span>
                  </div>

                </div>
              } @empty {
                <div class="flex-grow flex items-center justify-center border border-dashed rounded-xl" [class]="isDark() ? 'border-zinc-800 text-zinc-600' : 'border-zinc-200 text-zinc-400'">
                  <p class="text-[10px] font-semibold">Drag tasks here</p>
                </div>
              }
            }
          </div>
        </div>

        <!-- COLUMN: Done -->
        <div 
          (dragover)="onDragOver($event)" 
          (drop)="onDrop($event, 'Done')"
          [class]="isDark() ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-zinc-200'"
          class="p-4 rounded-2xl border min-h-[500px] flex flex-col gap-4 animate-blur-slide stagger-3 shadow-none">
          
          <div class="flex items-center justify-between pb-2 border-b" [class]="isDark() ? 'border-zinc-800' : 'border-zinc-100'">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              <h3 class="font-bold text-xs">Done</h3>
            </div>
            <span class="text-[9px] bg-zinc-100 dark:bg-zinc-800 text-zinc-455 px-1.5 py-0.5 rounded font-bold">
              {{ getTasksByColumn('Done').length }}
            </span>
          </div>

          <!-- Cards Stack -->
          <div class="flex flex-col gap-3 flex-grow">
            @if (isLoading()) {
              @for (dummy of [1]; track $index) {
                <div class="p-4 pl-5 rounded-xl border border-zinc-200/30 dark:border-zinc-850/40 bg-zinc-50 dark:bg-zinc-950/20 min-h-[105px] flex flex-col justify-between gap-3 animate-pulse">
                  <div class="space-y-2">
                    <div class="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
                    <div class="h-2 bg-zinc-200 dark:bg-zinc-800 rounded w-full"></div>
                  </div>
                  <div class="flex justify-between items-center">
                    <div class="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-10"></div>
                    <div class="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
                  </div>
                </div>
              }
            } @else {
              @for (task of getTasksByColumn('Done'); track task.id) {
                @if (dragOverTaskId() === task.id) {
                  <div class="border-t-2 border-dashed border-zinc-400 dark:border-zinc-600 my-1 animate-pulse"></div>
                }
                <div 
                  draggable="true"
                  (dragstart)="onDragStart($event, task)"
                  (dragover)="onDragOverCard($event, task)"
                  (dragleave)="onDragLeaveCard($event)"
                  (dragend)="onDragEnd()"
                  [class]="isDark() ? 'border-zinc-850/60 hover:border-zinc-700' : 'border-zinc-100 hover:border-zinc-300'"
                  [class.bg-zinc-950]="isDark() && dragOverTaskId() !== task.id"
                  [class.bg-zinc-50]="!isDark() && dragOverTaskId() !== task.id"
                  [class.bg-zinc-100]="dragOverTaskId() === task.id && !isDark()"
                  [class.bg-zinc-800]="dragOverTaskId() === task.id && isDark()"
                  class="p-4 pl-5 rounded-xl border flex flex-col justify-between gap-3 cursor-grab active:cursor-grabbing transition-all select-none group relative overflow-hidden">
                  <div class="absolute left-0 top-0 bottom-0 w-1.5" [class]="getThemeBgClass(task.theme)"></div>
                  
                  <div class="space-y-1">
                    <div class="flex items-center gap-1.5">
                      <!-- 6-dot drag handle icon -->
                      <svg class="w-3 h-3.5 text-zinc-400 dark:text-zinc-600 cursor-grab active:cursor-grabbing flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="8" cy="6" r="2" />
                        <circle cx="8" cy="12" r="2" />
                        <circle cx="8" cy="18" r="2" />
                        <circle cx="16" cy="6" r="2" />
                        <circle cx="16" cy="12" r="2" />
                        <circle cx="16" cy="18" r="2" />
                      </svg>
                      <h4 class="font-bold text-xs group-hover:text-teal-500 transition-colors">{{ task.title }}</h4>
                    </div>
                    <p class="text-[9px] text-zinc-455 leading-relaxed font-semibold">{{ task.description }}</p>
                  </div>

                  <div class="flex items-center justify-between mt-1">
                    <span 
                      [class]="task.priority === 'High' ? 'text-red-500 bg-red-500/10 border-red-500/20' : (task.priority === 'Medium' ? 'text-yellow-600 bg-yellow-500/10 border-yellow-500/20' : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20')"
                      class="px-2 py-0.5 rounded text-[8px] font-bold border uppercase tracking-wider">
                      {{ task.priority }}
                    </span>
                    
                    <span [class]="task.assigneeGrad" class="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[7px] text-white">
                      {{ task.assignee }}
                    </span>
                  </div>

                </div>
              } @empty {
                <div class="flex-grow flex items-center justify-center border border-dashed rounded-xl" [class]="isDark() ? 'border-zinc-800 text-zinc-600' : 'border-zinc-200 text-zinc-400'">
                  <p class="text-[10px] font-semibold">Drag tasks here</p>
                </div>
              }
            }
          </div>
        </div>

      </section>

    </div>

    <!-- New Task Form Modal Overlay -->
    @if (isFormOpen()) {
      <div 
        (click)="toggleTaskForm()" 
        class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
        
        <section 
          (click)="$event.stopPropagation()"
          [class]="isDark() ? 'bg-zinc-900 border-zinc-850 text-zinc-50' : 'bg-white border-zinc-200 text-zinc-900'"
          class="p-6 rounded-2xl border flex flex-col gap-4 animate-blur-slide shadow-xl w-full max-w-lg">
          
          <div class="flex items-center justify-between pb-3 border-b" [class]="isDark() ? 'border-zinc-800' : 'border-zinc-100'">
            <h3 class="font-extrabold text-sm font-display">Create New Board Task</h3>
            <button 
              (click)="toggleTaskForm()" 
              [class]="isDark() ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-550 hover:text-zinc-900'"
              class="p-1 rounded-lg transition-colors clickable-scale">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
            <div class="flex flex-col gap-1.5">
              <label class="text-zinc-400">Title</label>
              <input 
                type="text" 
                [(ngModel)]="newTaskTitle" 
                placeholder="Database token audits..." 
                [class]="isDark() ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-200 text-zinc-900'"
                class="px-3 py-2 rounded-xl border outline-none font-semibold">
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-zinc-400">Description</label>
              <input 
                type="text" 
                [(ngModel)]="newTaskDescription" 
                placeholder="Review token authorizations..." 
                [class]="isDark() ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-200 text-zinc-900'"
                class="px-3 py-2 rounded-xl border outline-none font-semibold">
            </div>

            <div class="flex flex-col gap-1.5">
              <app-dropdown 
                [label]="'Priority'"
                [options]="['High', 'Medium', 'Low']"
                [selected]="newTaskPriority"
                (selectionChange)="onPriorityChange($event)">
              </app-dropdown>
            </div>

            <div class="flex flex-col gap-1.5">
              <app-dropdown 
                [label]="'Color Scope'"
                [options]="['Purple', 'Blue', 'Green', 'Orange', 'Pink']"
                [selected]="formattedThemeName(newTaskTheme)"
                (selectionChange)="onThemeChange($event)">
              </app-dropdown>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t" [class]="isDark() ? 'border-zinc-800' : 'border-zinc-100'">
            <button 
              (click)="createTask()"
              class="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-zinc-950 font-bold text-xs transition-colors cursor-pointer select-none clickable-scale">
              Save Task
            </button>
          </div>
        </section>
      </div>
    }
  `
})
export class TodosComponent {
  private readonly state = inject(WorkspaceService);
  protected readonly isDark = this.state.isDark;

  protected readonly isLoading = signal(true);
  constructor() {
    setTimeout(() => this.isLoading.set(false), 600);
  }

  protected getThemeBgClass(theme: string): string {
    switch (theme) {
      case 'orange': return 'bg-orange-500';
      case 'purple': return 'bg-purple-500';
      case 'pink': return 'bg-pink-500';
      case 'green': return 'bg-emerald-500';
      case 'blue': return 'bg-blue-500';
      default: return 'bg-zinc-500';
    }
  }

  protected readonly isFormOpen = signal(false);

  // Kanban task list items
  protected readonly todoTasks = signal<TodoTask[]>([
    { id: 1, title: 'Compile design tokens', description: 'Run audits for new Tailwind CSS v4 variables config.', priority: 'High', theme: 'purple', column: 'Todo', assignee: 'LN', assigneeGrad: 'avatar-grad-1' },
    { id: 2, title: 'OAuth endpoint authorization', description: 'Implement token secure hydration parameters.', priority: 'Medium', theme: 'blue', column: 'Todo', assignee: 'SU', assigneeGrad: 'avatar-grad-2' },
    { id: 3, title: 'Bento Grid icons swap', description: 'Verify dashboard navigation references match mockup.', priority: 'High', theme: 'green', column: 'In Progress', assignee: 'DK', assigneeGrad: 'avatar-grad-4' },
    { id: 4, title: 'Inbox detail thread views', description: 'Setup conversation click actions and inline replies.', priority: 'Medium', theme: 'pink', column: 'In Progress', assignee: 'AN', assigneeGrad: 'avatar-grad-3' },
    { id: 5, title: 'Initial angular starter route', description: 'Configure basic projectNG workspace setup layout.', priority: 'Low', theme: 'orange', column: 'Done', assignee: 'SU', assigneeGrad: 'avatar-grad-2' }
  ]);

  // Drag over target tracking signal
  protected readonly dragOverTaskId = signal<number | null>(null);

  // Form bindings
  protected newTaskTitle = '';
  protected newTaskDescription = '';
  protected newTaskPriority: 'High' | 'Medium' | 'Low' = 'Medium';
  protected newTaskTheme: 'orange' | 'purple' | 'pink' | 'green' | 'blue' = 'purple';

  protected toggleTaskForm(): void {
    this.isFormOpen.update(v => !v);
  }

  protected formattedThemeName(theme: string): string {
    if (!theme) return '';
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  }

  protected onPriorityChange(priority: string): void {
    this.newTaskPriority = priority as 'High' | 'Medium' | 'Low';
  }

  protected onThemeChange(themeName: string): void {
    this.newTaskTheme = themeName.toLowerCase() as 'orange' | 'purple' | 'pink' | 'green' | 'blue';
  }

  protected getTasksByColumn(column: 'Todo' | 'In Progress' | 'Done'): TodoTask[] {
    return this.todoTasks().filter(t => t.column === column);
  }

  protected onDragStart(event: DragEvent, task: TodoTask): void {
    event.dataTransfer?.setData('text/plain', task.id.toString());
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault(); // allow drop
    if (this.dragOverTaskId() !== null) {
      this.dragOverTaskId.set(null);
    }
  }

  protected onDragOverCard(event: DragEvent, task: TodoTask): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.dragOverTaskId() !== task.id) {
      this.dragOverTaskId.set(task.id);
    }
  }

  protected onDragLeaveCard(event: DragEvent): void {
    // No-op to satisfy binding
  }

  protected onDragEnd(): void {
    this.dragOverTaskId.set(null);
  }

  protected onDrop(event: DragEvent, targetColumn: 'Todo' | 'In Progress' | 'Done'): void {
    event.preventDefault();
    const idStr = event.dataTransfer?.getData('text/plain');
    if (!idStr) return;
    const id = parseInt(idStr, 10);
    
    this.todoTasks.update(list => {
      const draggedIndex = list.findIndex(t => t.id === id);
      if (draggedIndex === -1) return list;
      
      const draggedTask = { ...list[draggedIndex], column: targetColumn };
      const newList = list.filter(t => t.id !== id);
      
      const overId = this.dragOverTaskId();
      if (overId !== null) {
        const targetIndex = newList.findIndex(t => t.id === overId);
        if (targetIndex !== -1) {
          newList.splice(targetIndex, 0, draggedTask);
          return newList;
        }
      }
      
      newList.push(draggedTask);
      return newList;
    });

    this.dragOverTaskId.set(null);
  }

  protected createTask(): void {
    if (!this.newTaskTitle.trim()) return;

    const newTask: TodoTask = {
      id: Date.now(),
      title: this.newTaskTitle.trim(),
      description: this.newTaskDescription.trim() || 'No description provided.',
      priority: this.newTaskPriority,
      theme: this.newTaskTheme,
      column: 'Todo',
      assignee: 'JS',
      assigneeGrad: 'avatar-grad-3'
    };

    this.todoTasks.update(list => [...list, newTask]);

    // Reset fields
    this.newTaskTitle = '';
    this.newTaskDescription = '';
    this.newTaskPriority = 'Medium';
    this.newTaskTheme = 'purple';
    this.isFormOpen.set(false);
  }
}
