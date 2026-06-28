import { Component, inject, computed, PLATFORM_ID, signal, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SchoolService } from '../../../shared/services/school.service';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-dashboard-gpa-trend',
  standalone: true,
  imports: [NgApexchartsModule],
  template: `
    <div class="rounded-xl border bg-theme-panel border-theme-border p-5 space-y-3">
      <div>
        <h3 class="font-medium text-xs text-theme-text-main tracking-wider capitalize">GPA Performance Trends</h3>
        <p class="text-[10px] text-theme-text-muted font-normal mt-1">Midterm GPA averages across active grade levels</p>
      </div>
      <div class="w-full overflow-hidden">
        @if (isBrowser()) {
          <apx-chart
            class="w-full font-sans"
            [series]="gpaChartOptions().series"
            [chart]="gpaChartOptions().chart"
            [xaxis]="gpaChartOptions().xaxis"
            [yaxis]="gpaChartOptions().yaxis"
            [colors]="gpaChartOptions().colors"
            [stroke]="gpaChartOptions().stroke"
            [grid]="gpaChartOptions().grid"
            [legend]="gpaChartOptions().legend"
            [tooltip]="gpaChartOptions().tooltip"
          ></apx-chart>
        } @else {
          <div class="h-48 flex items-center justify-center">
            <span class="text-[10px] text-theme-text-muted font-normal">Loading GPA trends...</span>
          </div>
        }
      </div>
    </div>
  `
})
export class DashboardGpaTrendComponent {
  protected readonly state = inject(SchoolService);
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly isBrowser = signal(isPlatformBrowser(this.platformId));

  constructor() {
    effect(() => {
      this.state.isCollapsed();
      if (isPlatformBrowser(this.platformId)) {
        [50, 100, 150, 200, 250, 300].forEach(d => {
          setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
          }, d);
        });
      }
    });
  }

  protected readonly gpaChartOptions = computed(() => {
    const isDark = this.state.isDark();
    const gridColor = isDark ? '#27272a' : '#eaeaea';
    const labelColor = isDark ? '#a1a1aa' : '#71717a';
    const legendColor = isDark ? '#fafafa' : '#09090b';

    return {
      series: [
        {
          name: 'Grade 9',
          data: [3.1, 3.25, 3.2, 3.4, 3.52]
        },
        {
          name: 'Grade 10',
          data: [3.3, 3.15, 3.4, 3.35, 3.61]
        },
        {
          name: 'Grade 11',
          data: [3.42, 3.5, 3.38, 3.62, 3.75]
        },
        {
          name: 'Grade 12',
          data: [3.55, 3.62, 3.7, 3.82, 3.91]
        }
      ],
      chart: {
        type: 'line' as any,
        height: 200,
        toolbar: { show: false },
        animations: { enabled: true }
      },
      colors: ['#10b981', '#f59e0b', '#6366f1', '#ec4899'], // Matching sidebar cohorts: Emerald, Amber, Indigo, Pink
      stroke: {
        curve: 'smooth' as any,
        width: 2.5
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5'],
        axisBorder: { show: false },
        axisTicks: { show: true, color: gridColor },
        labels: {
          style: {
            colors: labelColor,
            fontFamily: 'Geist Sans, sans-serif',
            fontSize: '9px'
          }
        }
      },
      yaxis: {
        min: 2.8,
        max: 4.0,
        tickAmount: 3,
        labels: {
          style: {
            colors: labelColor,
            fontFamily: 'Geist Sans, sans-serif',
            fontSize: '9px'
          },
          formatter: (val: number) => val.toFixed(1)
        }
      },
      grid: {
        borderColor: gridColor,
        strokeDashArray: 4,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
        padding: { top: 0, right: 10, bottom: 0, left: 10 }
      },
      legend: {
        show: true,
        position: 'top' as any,
        horizontalAlign: 'right' as any,
        fontSize: '9px',
        fontFamily: 'Geist Sans, sans-serif',
        labels: { colors: legendColor },
        itemMargin: { horizontal: 6, vertical: 0 }
      },
      tooltip: {
        theme: isDark ? 'dark' : 'light',
        style: {
          fontSize: '10px',
          fontFamily: 'Geist Sans, sans-serif'
        }
      }
    };
  });
}
