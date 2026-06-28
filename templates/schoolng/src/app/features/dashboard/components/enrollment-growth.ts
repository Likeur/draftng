import { Component, inject, computed, PLATFORM_ID, signal, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SchoolService } from '../../../shared/services/school.service';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-dashboard-enrollment-growth',
  standalone: true,
  imports: [NgApexchartsModule],
  template: `
    <div class="rounded-xl border bg-theme-panel border-theme-border p-5 space-y-3">
      <div>
        <h3 class="font-medium text-xs text-theme-text-main tracking-wider capitalize">Enrollment Growth</h3>
        <p class="text-[10px] text-theme-text-muted font-normal mt-1">Monthly registration and transfer admissions for 2026</p>
      </div>
      <div class="w-full overflow-hidden">
        @if (isBrowser()) {
          <apx-chart
            class="w-full font-sans"
            [series]="enrollmentChartOptions().series"
            [chart]="enrollmentChartOptions().chart"
            [xaxis]="enrollmentChartOptions().xaxis"
            [yaxis]="enrollmentChartOptions().yaxis"
            [colors]="enrollmentChartOptions().colors"
            [stroke]="enrollmentChartOptions().stroke"
            [plotOptions]="enrollmentChartOptions().plotOptions"
            [dataLabels]="enrollmentChartOptions().dataLabels"
            [grid]="enrollmentChartOptions().grid"
            [legend]="enrollmentChartOptions().legend"
            [tooltip]="enrollmentChartOptions().tooltip"
          ></apx-chart>
        } @else {
          <div class="h-48 flex items-center justify-center">
            <span class="text-[10px] text-theme-text-muted font-normal">Loading enrollment stats...</span>
          </div>
        }
      </div>
    </div>
  `
})
export class DashboardEnrollmentGrowthComponent {
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

  protected readonly enrollmentChartOptions = computed(() => {
    const isDark = this.state.isDark();
    const gridColor = isDark ? '#27272a' : '#eaeaea';
    const labelColor = isDark ? '#a1a1aa' : '#71717a';
    const legendColor = isDark ? '#fafafa' : '#09090b';

    return {
      series: [
        {
          name: 'New Admissions',
          data: [65, 84, 110, 145, 95, 120]
        },
        {
          name: 'Transfers',
          data: [15, 20, 18, 30, 22, 28]
        }
      ],
      chart: {
        type: 'bar' as any,
        height: 200,
        stacked: true,
        toolbar: { show: false },
        animations: { enabled: true }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '40%',
          borderRadius: 4
        }
      },
      colors: ['#6366f1', '#e11d48'], // Indigo for admissions, Rose for transfers
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
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
        labels: {
          style: {
            colors: labelColor,
            fontFamily: 'Geist Sans, sans-serif',
            fontSize: '9px'
          }
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
        itemMargin: { horizontal: 10, vertical: 0 }
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
