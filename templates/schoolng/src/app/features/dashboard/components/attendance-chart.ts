import { Component, inject, computed, PLATFORM_ID, signal, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SchoolService } from '../../../shared/services/school.service';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-dashboard-attendance-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  template: `
    <div class="rounded-xl border bg-theme-panel border-theme-border p-5 space-y-3">
      
      <div class="flex items-start justify-between gap-4 relative z-20">
        <div>
          <h3 class="font-medium text-xs text-theme-text-main tracking-wider capitalize">Attendance Analytics</h3>
          <p class="text-[10px] text-theme-text-muted font-normal mt-1">{{ getDescriptionText() }}</p>
        </div>
        
        <!-- Controls: Segment Selector + 3-dots config button -->
        <div class="flex items-center gap-2 relative" id="chart-controls-container">
          <!-- Segmented timeframe selector -->
          <div class="flex items-center rounded-lg border border-theme-border p-0.5 bg-theme-bg select-none">
            <button (click)="changeTimeframe('daily')" [class]="activeTimeframe() === 'daily' ? 'bg-theme-panel text-theme-text-main shadow-sm font-medium' : 'text-theme-text-muted hover:text-theme-text-main'" class="px-2.5 py-1 text-[10px] rounded-md transition-all cursor-pointer">Daily</button>
            <button (click)="changeTimeframe('weekly')" [class]="activeTimeframe() === 'weekly' ? 'bg-theme-panel text-theme-text-main shadow-sm font-medium' : 'text-theme-text-muted hover:text-theme-text-main'" class="px-2.5 py-1 text-[10px] rounded-md transition-all cursor-pointer">Weekly</button>
            <button (click)="changeTimeframe('monthly')" [class]="activeTimeframe() === 'monthly' ? 'bg-theme-panel text-theme-text-main shadow-sm font-medium' : 'text-theme-text-muted hover:text-theme-text-main'" class="px-2.5 py-1 text-[10px] rounded-md transition-all cursor-pointer">Monthly</button>
          </div>

          <!-- More Config 3-Dots Button -->
          <button 
            (click)="toggleChartConfig($event)"
            class="w-7 h-7 flex items-center justify-center rounded-lg border border-theme-border text-theme-text-muted hover:text-theme-text-main bg-theme-panel transition-all cursor-pointer clickable-scale">
            <!-- Lucide: more-horizontal -->
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </button>

          <!-- Config Options Dropdown Menu -->
          <div 
            [class.opacity-100]="isChartConfigOpen()"
            [class.pointer-events-auto]="isChartConfigOpen()"
            [class.scale-100]="isChartConfigOpen()"
            [class.translate-y-0]="isChartConfigOpen()"
            [class.opacity-0]="!isChartConfigOpen()"
            [class.pointer-events-none]="!isChartConfigOpen()"
            [class.scale-95]="!isChartConfigOpen()"
            [class.translate-y-[-4px]]="!isChartConfigOpen()"
            class="absolute right-0 top-full mt-1.5 w-44 bg-theme-panel border border-theme-border rounded-xl p-1.5 z-40 shadow-lg transition-all duration-200 ease-out origin-top-right transform text-theme-text-muted font-sans">
            
            <button (click)="toggleGridLines()" class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-normal hover:bg-theme-hover hover:text-theme-text-main transition-all cursor-pointer text-left font-medium">
              <span>Grid Lines</span>
              <span class="text-[9px] font-medium" [class]="showGridLines() ? 'text-emerald-500' : 'text-theme-text-muted'">
                {{ showGridLines() ? 'On' : 'Off' }}
              </span>
            </button>

            <button (click)="toggleCurveType()" class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-normal hover:bg-theme-hover hover:text-theme-text-main transition-all cursor-pointer text-left font-medium">
              <span>Smooth Curve</span>
              <span class="text-[9px] font-medium" [class]="curveType() === 'smooth' ? 'text-emerald-500' : 'text-theme-text-muted'">
                {{ curveType() === 'smooth' ? 'Yes' : 'No' }}
              </span>
            </button>

            <div class="h-px my-1 bg-theme-border"></div>

            <button (click)="toggleGradientFill()" class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-normal hover:bg-theme-hover hover:text-theme-text-main transition-all cursor-pointer text-left font-medium">
              <span>Gradient Fill</span>
              <span class="text-[9px] font-medium" [class]="showGradient() ? 'text-emerald-500' : 'text-theme-text-muted'">
                {{ showGradient() ? 'On' : 'Off' }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div class="w-full overflow-hidden">
        @if (isBrowser()) {
          <apx-chart
            class="w-full font-sans"
            [series]="attendanceChartOptions().series"
            [chart]="attendanceChartOptions().chart"
            [colors]="attendanceChartOptions().colors"
            [stroke]="attendanceChartOptions().stroke"
            [fill]="attendanceChartOptions().fill"
            [xaxis]="attendanceChartOptions().xaxis"
            [yaxis]="attendanceChartOptions().yaxis"
            [grid]="attendanceChartOptions().grid"
            [dataLabels]="attendanceChartOptions().dataLabels"
            [tooltip]="attendanceChartOptions().tooltip"
          ></apx-chart>
        } @else {
          <div class="h-48 flex items-center justify-center">
            <span class="text-[10px] text-theme-text-muted font-normal">Loading chart...</span>
          </div>
        }
      </div>
    </div>
  `
})
export class DashboardAttendanceChartComponent {
  protected readonly state = inject(SchoolService);
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly isBrowser = signal(false);

  constructor() {
    let isInitial = true;

    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.isBrowser.set(true);
      }, 500);
    }

    effect(() => {
      this.state.isCollapsed();
      if (isInitial) {
        isInitial = false;
        return;
      }
      if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 220); // Wait slightly past the 200ms transition
      }
    });
  }

  // Timeframe and chart config states
  protected readonly activeTimeframe = signal<'daily' | 'weekly' | 'monthly'>('weekly');
  protected readonly isChartConfigOpen = signal(false);
  protected readonly showGridLines = signal(true);
  protected readonly curveType = signal<'smooth' | 'straight'>('smooth');
  protected readonly showGradient = signal(true);

  // Timeframe datasets
  private readonly datasets = {
    daily: {
      data: [98.5, 99.2, 97.4, 98.9, 99.5],
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    },
    weekly: {
      data: [97.2, 98.1, 97.8, 98.4, 98.2],
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    },
    monthly: {
      data: [96.8, 97.5, 98.1, 97.9, 98.3],
      categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun']
    }
  };

  protected readonly attendanceChartOptions = computed(() => {
    const isDark = this.state.isDark();
    const gridColor = isDark ? '#27272a' : '#eaeaea';
    const labelColor = isDark ? '#71717a' : '#a1a1aa';
    const tf = this.activeTimeframe();
    const currentDataset = this.datasets[tf];

    return {
      series: [
        {
          name: 'Attendance Rate',
          data: currentDataset.data
        }
      ],
      chart: {
        type: 'area' as any,
        height: 200,
        parentHeightOffset: 0,
        toolbar: { show: false },
        animations: { enabled: true }
      },
      colors: ['#10b981'],
      stroke: {
        curve: this.curveType() as any,
        width: 3
      },
      fill: {
        type: this.showGradient() ? 'gradient' : 'solid',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: this.showGradient() ? 0.35 : 0.03,
          opacityTo: 0.01,
          stops: [0, 90, 100]
        }
      },
      xaxis: {
        categories: currentDataset.categories,
        axisBorder: { show: false },
        axisTicks: { show: true, color: gridColor },
        labels: {
          show: true,
          style: {
            colors: labelColor,
            fontFamily: 'Geist Sans, sans-serif',
            fontSize: '9px'
          }
        }
      },
      yaxis: {
        min: 95,
        max: 100,
        tickAmount: 2,
        labels: {
          show: true,
          style: {
            colors: labelColor,
            fontFamily: 'Geist Sans, sans-serif',
            fontSize: '9px'
          },
          formatter: (val: number) => `${val}%`
        }
      },
      grid: {
        borderColor: gridColor,
        strokeDashArray: 4,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: this.showGridLines() } },
        padding: { top: 0, right: 10, bottom: 0, left: 10 }
      },
      dataLabels: { enabled: false },
      tooltip: {
        theme: isDark ? 'dark' : 'light',
        style: {
          fontSize: '10px',
          fontFamily: 'Geist Sans, sans-serif'
        },
        y: {
          formatter: (val: number) => `${val}%`
        }
      }
    };
  });

  protected getDescriptionText(): string {
    const tf = this.activeTimeframe();
    if (tf === 'daily') return 'Average daily attendance rate for the current cycle';
    if (tf === 'weekly') return 'Average weekly attendance rate over the current week';
    return 'Average monthly attendance rate over the last five months';
  }

  protected changeTimeframe(tf: 'daily' | 'weekly' | 'monthly'): void {
    this.activeTimeframe.set(tf);
  }

  protected toggleChartConfig(event: MouseEvent): void {
    event.stopPropagation();
    this.isChartConfigOpen.update(o => !o);
  }

  protected toggleGridLines(): void {
    this.showGridLines.update(g => !g);
  }

  protected toggleCurveType(): void {
    this.curveType.update(c => c === 'smooth' ? 'straight' : 'smooth');
  }

  protected toggleGradientFill(): void {
    this.showGradient.update(g => !g);
  }
}
