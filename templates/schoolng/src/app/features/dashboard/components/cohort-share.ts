import { Component, inject, computed, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SchoolService } from '../../../shared/services/school.service';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-dashboard-cohort-share',
  standalone: true,
  imports: [NgApexchartsModule],
  template: `
    <div class="rounded-xl border bg-white border-zinc-200 p-5 space-y-3">
      <div>
        <h3 class="font-medium text-xs text-zinc-900 tracking-wider capitalize">Cohort Share</h3>
        <p class="text-[10px] text-zinc-400 font-normal mt-1">Distribution of active students per cohort</p>
      </div>
      <div class="h-48 flex items-center justify-center overflow-hidden">
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
          <span class="text-[10px] text-zinc-400 font-normal">Loading share data...</span>
        }
      </div>
    </div>
  `
})
export class DashboardCohortShareComponent {
  protected readonly state = inject(SchoolService);
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly isBrowser = signal(isPlatformBrowser(this.platformId));

  protected readonly cohortChartOptions = computed(() => {
    const labelColor = '#a1a1aa';
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
        colors: ['#ffffff']
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
                color: '#09090b',
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
        theme: 'light',
        style: {
          fontSize: '10px',
          fontFamily: 'Geist Sans, sans-serif'
        }
      }
    };
  });
}
