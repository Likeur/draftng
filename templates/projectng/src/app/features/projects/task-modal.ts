import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownComponent } from '../../shared/components/dropdown';

@Component({
  selector: 'app-projects-task-modal',
  imports: [FormsModule, DropdownComponent],
  template: `
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div 
        [class]="isDark() ? 'bg-zinc-900 border-zinc-850 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'" 
        class="w-full max-w-md rounded-2xl border p-6 relative">
        
        <!-- Close button -->
        <button (click)="close.emit()" class="absolute top-4 right-4 text-zinc-400 hover:text-zinc-650 transition-colors cursor-pointer select-none">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 class="font-display font-extrabold text-lg tracking-tight mb-5">Create New Project Card</h3>
        
        <form (ngSubmit)="onSubmit()" class="space-y-4">
          <!-- Title input -->
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Title</label>
            <input 
              type="text" 
              [(ngModel)]="title"
              name="title"
              placeholder="e.g. Design Tokens Audit" 
              [class]="isDark() ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-100 border-zinc-200'"
              class="w-full px-3 py-2 border text-xs outline-none focus:ring-1 focus:ring-teal-500 rounded-xl font-semibold transition-all placeholder-zinc-450"
              required>
          </div>

          <!-- Priority custom dropdown -->
          <div>
            <app-dropdown 
              label="Priority"
              [options]="priorityOptions"
              [selected]="priority()"
              (selectionChange)="priority.set($event)">
            </app-dropdown>
          </div>

          <!-- Dates custom dropdowns -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <app-dropdown 
                label="Start Date"
                [options]="dateOptions"
                [selected]="startDate()"
                (selectionChange)="startDate.set($event)">
              </app-dropdown>
            </div>
            
            <div>
              <app-dropdown 
                label="End Date"
                [options]="dateOptions"
                [selected]="endDate()"
                (selectionChange)="endDate.set($event)">
              </app-dropdown>
            </div>
          </div>

          <!-- Highlight Theme custom dropdown -->
          <div>
            <app-dropdown 
              label="Highlight Theme"
              [options]="themeOptions"
              [selected]="theme()"
              (selectionChange)="theme.set($event)">
            </app-dropdown>
          </div>

          <!-- Action controls -->
          <div class="flex items-center justify-end gap-2 pt-3">
            <button type="button" (click)="close.emit()" [class]="isDark() ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'" class="px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors select-none">
              Cancel
            </button>
            <button type="submit" class="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-zinc-950 font-bold text-xs transition-colors cursor-pointer select-none">
              Create Card
            </button>
          </div>
        </form>

      </div>
    </div>
  `
})
export class TaskModalComponent {
  public readonly isDark = input<boolean>(false);
  
  public readonly close = output<void>();
  public readonly taskCreated = output<{
    title: string;
    priority: 'High' | 'Medium' | 'Low';
    startDate: string;
    endDate: string;
    theme: 'orange' | 'purple' | 'pink' | 'green' | 'blue';
  }>();

  protected title = '';
  protected readonly priority = signal<string>('High');
  protected readonly startDate = signal<string>('Mon 15');
  protected readonly endDate = signal<string>('Wed 17');
  protected readonly theme = signal<string>('Purple (Vibrant)');

  protected readonly priorityOptions = ['High', 'Medium', 'Low'];
  protected readonly dateOptions = ['Mon 15', 'Tue 16', 'Wed 17', 'Thu 18', 'Fri 19', 'Sat 20', 'Sun 21'];
  protected readonly themeOptions = [
    'Orange (Amber)',
    'Purple (Vibrant)',
    'Pink (Sleek)',
    'Green (Emerald)',
    'Blue (Sky)'
  ];

  protected onSubmit(): void {
    const title = this.title.trim();
    if (!title) return;

    // Map theme label to code values
    const themeMap: Record<string, 'orange' | 'purple' | 'pink' | 'green' | 'blue'> = {
      'Orange (Amber)': 'orange',
      'Purple (Vibrant)': 'purple',
      'Pink (Sleek)': 'pink',
      'Green (Emerald)': 'green',
      'Blue (Sky)': 'blue'
    };

    const mappedTheme = themeMap[this.theme()] || 'purple';

    this.taskCreated.emit({
      title,
      priority: this.priority() as 'High' | 'Medium' | 'Low',
      startDate: this.startDate(),
      endDate: this.endDate(),
      theme: mappedTheme
    });
  }
}
