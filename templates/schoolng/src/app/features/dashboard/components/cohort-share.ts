import { Component, inject, computed, PLATFORM_ID, signal, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SchoolService } from '../../../shared/services/school.service';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-dashboard-cohort-share',
  standalone: true,
  imports: [NgApexchartsModule],
  template: `
    <div class="rounded-xl border bg-theme-panel border-theme-border p-5 h-full flex flex-col justify-between">
      <div>
        <h3 class="font-medium text-xs text-theme-text-main tracking-wider capitalize">Cohort Share</h3>
        <p class="text-[10px] text-theme-text-muted font-normal mt-1">Distribution of active students per cohort</p>
      </div>
      <div class="w-full overflow-hidden flex-1 flex items-center justify-center">
        @if (isBrowser()) {
          <apx-chart
            class="w-full font-sans"
            [series]="cohortChartOptions().series"
            [chart]="cohortChartOptions().chart"
            [labels]="cohortChartOptions().labels"
            [colors]="cohortChartOptions().colors"
            [stroke]="cohortChartOptions().stroke"
            [plotOptions]="cohortChartOptions().plotOptions"
            [dataLabels]="cohortChartOptions().dataLabels"
            [legend]="cohortChartOptions().legend"
            [tooltip]="cohortChartOptions().tooltip"
          ></apx-chart>
        } @else {
          <div class="h-48 flex items-center justify-center">
            <span class="text-[10px] text-theme-text-muted font-normal">Loading share data...</span>
          </div>
        }
      </div>
    </div>
  `
})
export class DashboardCohortShareComponent {
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

  protected readonly cohortChartOptions = computed(() => {
    const isDark = this.state.isDark();
    const labelColor = isDark ? '#71717a' : '#a1a1aa';
    const totalColor = isDark ? '#fafafa' : '#09090b';
    const strokeColor = isDark ? '#18181b' : '#ffffff';
    const fillColors = ['#10b981', '#3b82f6', '#6366f1', '#f59e0b']; // emerald, blue, indigo, amber

    return {
      series: [28, 24, 19, 45],
      chart: {
        type: 'donut' as any,
        height: 180,
        animations: { enabled: true }
      },
      labels: ['AP Calc BC', 'Honors Chem', 'English Lit', 'Microecon'],
      colors: fillColors,
      stroke: {
        show: true,
        width: 1,
        colors: [strokeColor]
      },
      plotOptions: {
        pie: {
          donut: {
            size: '72%',
            background: 'transparent',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '9px',
                fontFamily: 'Geist Sans, sans-serif',
                color: labelColor,
                offsetY: -3
              },
              value: {
                show: true,
                fontSize: '15px',
                fontFamily: 'Geist Sans, sans-serif',
                fontWeight: '500',
                color: totalColor,
                offsetY: 3,
                formatter: (val: string) => val
              },
              total: {
                show: true,
                label: 'Total Students',
                fontSize: '9px',
                fontFamily: 'Geist Sans, sans-serif',
                color: labelColor,
                formatter: () => '116'
              }
            }
          }
        }
      },
      dataLabels: { enabled: false },
      legend: {
        show: false
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
