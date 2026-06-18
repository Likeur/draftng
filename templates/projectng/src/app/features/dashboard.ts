import { Component, input, computed, signal, PLATFORM_ID, inject, ElementRef, ViewChild, AfterViewInit, effect } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

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

interface PlanningItem {
  day: string;
  task: string;
  assignee: string;
  completed: boolean;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-blur-slide font-sans">
      
      <!-- Grid Cards (Subtle dark borders, flat styling) -->
      <section class="grid grid-cols-2 lg:grid-cols-4 gap-6">
        @for (metric of metrics(); track metric.label; let i = $index) {
          <div 
            [class]="isDark() ? 'bg-zinc-900 border-zinc-850 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-855'" 
            class="p-5 rounded-2xl border shadow-none animate-blur-slide"
            [style.animation-delay]="(i * 60) + 'ms'">
            <div class="flex items-center justify-between mb-3">
              <span class="text-[10px] font-bold text-zinc-400 select-none">{{ metric.label }}</span>
              <span [class]="metric.badgeClass" class="px-2 py-0.5 rounded text-[8px] font-bold">
                {{ metric.status }}
              </span>
            </div>
            <p class="font-display font-extrabold text-2xl tracking-tight">{{ metric.value }}</p>
            <p class="text-[9px] text-zinc-400 mt-1 font-semibold">Active tasks count</p>
          </div>
        }
      </section>

      <!-- Real ChartJS and Metrics Section -->
      <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Real ChartJS Activity Chart -->
        <div 
          [class]="isDark() ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-zinc-200'" 
          class="p-5 rounded-2xl border lg:col-span-2 space-y-4 shadow-none animate-blur-slide"
          style="animation-delay: 240ms;">
          <div class="flex items-center justify-between pb-2">
            <div>
              <h3 class="font-bold text-xs text-zinc-400">Completion Velocity</h3>
              <p class="text-[9px] text-zinc-400 mt-0.5 font-semibold">Real-time work resolution trends.</p>
            </div>
            <span class="text-[10px] bg-teal-500/10 text-teal-500 border border-teal-500/20 px-2 py-0.5 rounded-full font-bold select-none cursor-pointer clickable-scale">
              Chart.js Active
            </span>
          </div>

          <!-- Chart.js canvas wrapper -->
          <div class="h-44 w-full relative">
            <canvas #velocityChartCanvas></canvas>
          </div>
        </div>

        <!-- Task Completion rates circular chart -->
        <div 
          [class]="isDark() ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-zinc-200'" 
          class="p-5 rounded-2xl border flex flex-col justify-between items-center text-center shadow-none animate-blur-slide"
          style="animation-delay: 300ms;">
          <div class="w-full text-left">
            <h3 class="font-bold text-xs text-zinc-400">Roster Completion</h3>
            <p class="text-[9px] text-zinc-400 mt-0.5 font-semibold">Overall completion progress metric.</p>
          </div>
          
          <div class="my-4 relative flex items-center justify-center">
            <svg class="w-28 h-28 transform -rotate-90">
              <circle cx="56" cy="56" r="44" class="stroke-zinc-100 dark:stroke-zinc-800" stroke-width="7" fill="transparent"/>
              <circle cx="56" cy="56" r="44" class="stroke-teal-500" stroke-width="7" fill="transparent"
                [attr.stroke-dasharray]="circleCircumference"
                [attr.stroke-dashoffset]="circleStrokeOffset()"/>
            </svg>
            <div class="absolute flex flex-col items-center justify-center select-none">
              <span class="font-display font-extrabold text-xl tracking-tight text-zinc-800 dark:text-zinc-50">{{ completionPercent() }}%</span>
              <span class="text-[9px] font-bold text-zinc-400 mt-0.5">Finished</span>
            </div>
          </div>

          <p class="text-[10px] text-zinc-400 font-semibold leading-normal">
            {{ doneCount() }} of {{ totalTasks() }} assigned tasks resolved successfully.
          </p>
        </div>
      </section>

      <!-- Task Status Tables and Weekly Plans -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Task Status Grid Table -->
        <div 
          [class]="isDark() ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-zinc-200'" 
          class="p-5 rounded-2xl border shadow-none flex flex-col justify-between animate-blur-slide"
          style="animation-delay: 360ms;">
          <div>
            <div class="flex items-center justify-between pb-3 border-b mb-3" [class]="isDark() ? 'border-zinc-800' : 'border-zinc-100'">
              <div>
                <h3 class="font-bold text-xs text-zinc-400">Workflow States</h3>
                <p class="text-[9px] text-zinc-400 mt-0.5 font-semibold">Active tasks state allocation matrix.</p>
              </div>
              <span class="text-[10px] text-teal-500 font-bold select-none cursor-pointer">Active List</span>
            </div>

            <div class="divide-y text-xs font-medium" [class]="isDark() ? 'divide-zinc-800' : 'divide-zinc-100'">
              @for (task of tasks(); track task.id) {
                <div class="py-3 flex items-center justify-between gap-4">
                  <div class="flex items-center gap-2.5 overflow-hidden">
                    <span [class]="'w-5.5 h-5.5 rounded-lg border flex items-center justify-center font-bold text-[8px] shrink-0 ' + getTaskClasses(task.theme)">
                      {{ task.title.slice(0, 2) }}
                    </span>
                    <span class="font-bold text-zinc-800 dark:text-zinc-200 truncate">{{ task.title }}</span>
                  </div>
                  
                  <div class="flex items-center gap-3 shrink-0">
                    <span 
                      [class]="task.status === 'Backlog' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500' : (task.status === 'Todo' ? 'bg-blue-500/10 text-blue-500' : (task.status === 'In Progress' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'))"
                      class="px-2 py-0.5 rounded text-[8px] font-bold">
                      {{ task.status }}
                    </span>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Weekly Planning Checklist -->
        <div 
          [class]="isDark() ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-zinc-200'" 
          class="p-5 rounded-2xl border shadow-none flex flex-col justify-between animate-blur-slide"
          style="animation-delay: 420ms;">
          <div>
            <div class="flex items-center justify-between pb-3 border-b mb-3" [class]="isDark() ? 'border-zinc-800' : 'border-zinc-100'">
              <div>
                <h3 class="font-bold text-xs text-zinc-400">Weekly Schedule</h3>
                <p class="text-[9px] text-zinc-400 mt-0.5 font-semibold">Mon-Sun sprint schedule list.</p>
              </div>
              <button (click)="resetSchedule()" class="text-[10px] text-teal-500 font-bold cursor-pointer select-none clickable-scale">Reset</button>
            </div>

            <!-- Planning Checklist items -->
            <div class="space-y-2.5">
              @for (item of planningList(); track item.task) {
                <div 
                  (click)="togglePlanningItem(item)"
                  [class]="isDark() ? 'hover:bg-zinc-850/50' : 'hover:bg-zinc-50'"
                  class="flex items-center justify-between p-2.5 rounded-xl border border-zinc-200/50 dark:border-zinc-850/60 cursor-pointer select-none transition-colors duration-150 clickable-scale">
                  
                  <div class="flex items-center gap-3">
                    <!-- Custom Checkbox -->
                    <div 
                      [class]="item.completed ? 'bg-teal-500 border-teal-500 text-zinc-950' : (isDark() ? 'border-zinc-700 bg-zinc-800/40' : 'border-zinc-300 bg-zinc-50')"
                      class="w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-all">
                      @if (item.completed) {
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="4">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      }
                    </div>
                    
                    <span [class.line-through]="item.completed" [class.text-zinc-450]="item.completed" class="text-xs font-semibold text-zinc-800 dark:text-zinc-250">
                      {{ item.task }}
                    </span>
                  </div>

                  <div class="flex items-center gap-2">
                    <span class="text-[9px] text-zinc-400 font-bold">{{ item.day }}</span>
                    <!-- Dynamic profile gradient background -->
                    <span [class]="item.day === 'Mon' ? 'avatar-grad-1' : (item.day === 'Wed' ? 'avatar-grad-2' : 'avatar-grad-3')" class="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[7px] text-white">
                      {{ item.assignee }}
                    </span>
                  </div>

                </div>
              }
            </div>
          </div>
        </div>

      </section>

    </div>
  `
})
export class DashboardComponent implements AfterViewInit {
  public readonly isDark = input<boolean>(false);
  public readonly tasks = input<Task[]>([]);

  protected getTaskClasses(theme: string): string {
    switch (theme) {
      case 'orange':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'purple':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'pink':
        return 'bg-pink-500/10 text-pink-500 border-pink-500/20';
      case 'green':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'blue':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
    }
  }

  private readonly platformId = inject(PLATFORM_ID);
  private chartInstance: Chart | null = null;

  @ViewChild('velocityChartCanvas') protected canvasRef!: ElementRef<HTMLCanvasElement>;

  protected readonly circleCircumference = 2 * Math.PI * 44; // 276.46

  // Planning Checklist Signal
  protected readonly planningList = signal<PlanningItem[]>([
    { day: 'Mon', task: 'Design tokens compilation audits', assignee: 'LN', completed: true },
    { day: 'Tue', task: 'Secure backend token authorizations', assignee: 'SU', completed: false },
    { day: 'Wed', task: 'Draw layout SVG graphs path', assignee: 'DK', completed: true },
    { day: 'Thu', task: 'Deploy Angular 22 workspace route', assignee: 'AN', completed: false },
    { day: 'Fri', task: 'Run integration pipeline testing suite', assignee: 'DK', completed: false }
  ]);

  // Status metrics counts
  protected readonly backlogCount = computed(() => this.tasks().filter(t => t.status === 'Backlog').length);
  protected readonly todoCount = computed(() => this.tasks().filter(t => t.status === 'Todo').length);
  protected readonly inProgressCount = computed(() => this.tasks().filter(t => t.status === 'In Progress').length);
  protected readonly doneCount = computed(() => this.tasks().filter(t => t.status === 'Done').length);
  protected readonly totalTasks = computed(() => this.tasks().length);

  protected readonly completionPercent = computed(() => {
    const total = this.totalTasks();
    if (total === 0) return 0;
    return Math.round((this.doneCount() / total) * 100);
  });

  protected readonly circleStrokeOffset = computed(() => {
    const percent = this.completionPercent();
    return this.circleCircumference - (percent / 100) * this.circleCircumference;
  });

  protected readonly metrics = computed(() => [
    { label: 'Backlog', value: this.backlogCount(), status: 'Pending', badgeClass: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500' },
    { label: 'Todo', value: this.todoCount(), status: 'Queue', badgeClass: 'bg-blue-500/10 text-blue-500' },
    { label: 'In Progress', value: this.inProgressCount(), status: 'Active', badgeClass: 'bg-amber-500/10 text-amber-500' },
    { label: 'Done', value: this.doneCount(), status: 'Resolved', badgeClass: 'bg-emerald-500/10 text-emerald-500' }
  ]);

  constructor() {
    effect(() => {
      const dark = this.isDark();
      if (isPlatformBrowser(this.platformId) && this.chartInstance) {
        const gridColor = dark ? 'rgba(39,39,42,0.2)' : 'rgba(228,228,231,0.6)';
        if (this.chartInstance.options.scales?.['y']?.grid) {
          this.chartInstance.options.scales['y'].grid.color = gridColor;
        }
        this.chartInstance.update();
      }
    });
  }

  public ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initChart();
      }, 50);
    }
  }

  private initChart(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }

    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Create gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, 160);
    gradient.addColorStop(0, 'rgba(20, 184, 166, 0.25)');
    gradient.addColorStop(1, 'rgba(20, 184, 166, 0.00)');

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon 15', 'Tue 16', 'Wed 17', 'Thu 18', 'Fri 19', 'Sat 20', 'Sun 21'],
        datasets: [{
          label: 'Completed Tasks',
          data: [12, 19, 15, 26, 22, 30, 28],
          borderColor: '#14b8a6',
          borderWidth: 2.5,
          pointBackgroundColor: '#14b8a6',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          backgroundColor: gradient,
          tension: 0.35
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#a1a1aa',
              font: { family: 'Geist', size: 9, weight: 'bold' }
            }
          },
          y: {
            grid: { color: this.isDark() ? 'rgba(39,39,42,0.2)' : 'rgba(228,228,231,0.6)' },
            ticks: {
              color: '#a1a1aa',
              font: { family: 'Geist', size: 9, weight: 'bold' }
            }
          }
        }
      }
    });
  }

  protected togglePlanningItem(item: PlanningItem): void {
    this.planningList.update(list => 
      list.map(i => i.task === item.task ? { ...i, completed: !i.completed } : i)
    );
  }

  protected resetSchedule(): void {
    this.planningList.update(list => list.map(i => ({ ...i, completed: false })));
  }
}
