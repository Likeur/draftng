import { Component, inject, signal, computed, PLATFORM_ID, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ClinicService } from '../shared/services/clinic.service';

@Component({
  selector: 'app-dashboard',
  imports: [NgApexchartsModule],
  template: `
    <div class="space-y-6">
      
      <!-- Page Header -->
      <div class="animate-blur-slide stagger-1">
        <h2 class="text-lg font-semibold text-theme-text-main">Good morning, Dr. Chen</h2>
        <p class="text-xs text-theme-text-muted mt-0.5">Here's what's happening at the clinic today.</p>
      </div>

      <!-- KPI Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <!-- Total Patients -->
        <div class="animate-blur-slide stagger-2 bg-theme-panel border border-theme-border rounded-xl p-5 transition-all hover:border-emerald-500/30">
          <div class="flex items-center justify-between mb-3">
            <div class="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <span class="text-[10px] font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">{{ state.totalPatients().change }}</span>
          </div>
          <p class="text-2xl font-semibold text-theme-text-main tracking-tight">{{ state.totalPatients().value }}</p>
          <p class="text-[10px] text-theme-text-muted mt-1">Total Patients</p>
        </div>

        <!-- Appointments Today -->
        <div class="animate-blur-slide stagger-3 bg-theme-panel border border-theme-border rounded-xl p-5 transition-all hover:border-blue-500/30">
          <div class="flex items-center justify-between mb-3">
            <div class="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500"><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h5"/><path d="M17.5 17.5 16 16.3V14"/><circle cx="16" cy="16" r="6"/></svg>
            </div>
            <span class="text-[10px] font-medium text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">{{ state.appointmentsToday().change }}</span>
          </div>
          <p class="text-2xl font-semibold text-theme-text-main tracking-tight">{{ state.appointmentsToday().value }}</p>
          <p class="text-[10px] text-theme-text-muted mt-1">Appointments Today</p>
        </div>

        <!-- Doctors On Duty -->
        <div class="animate-blur-slide stagger-4 bg-theme-panel border border-theme-border rounded-xl p-5 transition-all hover:border-violet-500/30">
          <div class="flex items-center justify-between mb-3">
            <div class="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-violet-500"><path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg>
            </div>
            <span class="text-[10px] font-medium text-violet-500 bg-violet-500/10 px-2 py-0.5 rounded-full">{{ state.doctorsOnDuty().roster }}</span>
          </div>
          <p class="text-2xl font-semibold text-theme-text-main tracking-tight">{{ state.doctorsOnDuty().value }}</p>
          <p class="text-[10px] text-theme-text-muted mt-1">Doctors On Duty</p>
        </div>

        <!-- Occupancy Rate -->
        <div class="animate-blur-slide stagger-5 bg-theme-panel border border-theme-border rounded-xl p-5 transition-all hover:border-amber-500/30">
          <div class="flex items-center justify-between mb-3">
            <div class="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-500"><path d="M2 20h20"/><path d="M5 20V8h4v12"/><path d="M13 20V4h4v16"/></svg>
            </div>
            <span class="text-[10px] font-medium text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">{{ state.occupancyRate().status }}</span>
          </div>
          <p class="text-2xl font-semibold text-theme-text-main tracking-tight">{{ state.occupancyRate().value }}</p>
          <p class="text-[10px] text-theme-text-muted mt-1">Bed Occupancy</p>
        </div>

      </div>

      <!-- Charts Row 1: Patient Visits (Area) + Revenue (Bar) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <!-- Chart 1: Patient Visits — Area Chart -->
        <div class="animate-blur-slide stagger-6 bg-theme-panel border border-theme-border rounded-xl p-5 min-h-[290px]">
          <div class="flex items-center justify-between mb-2">
            <div>
              <h3 class="text-xs font-semibold text-theme-text-main">Patient Visits</h3>
              <p class="text-[10px] text-theme-text-muted mt-0.5">Monthly trend over 6 months</p>
            </div>
            <div class="flex items-center gap-3 text-[9px] text-theme-text-muted">
              <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> Walk-in</span>
              <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-blue-500"></span> Scheduled</span>
            </div>
          </div>
          @if (isBrowser()) {
            <apx-chart
              class="w-full font-sans"
              [series]="patientVisitsChart().series"
              [chart]="patientVisitsChart().chart"
              [colors]="patientVisitsChart().colors"
              [stroke]="patientVisitsChart().stroke"
              [fill]="patientVisitsChart().fill"
              [xaxis]="patientVisitsChart().xaxis"
              [yaxis]="patientVisitsChart().yaxis"
              [grid]="patientVisitsChart().grid"
              [dataLabels]="patientVisitsChart().dataLabels"
              [tooltip]="patientVisitsChart().tooltip"
              [legend]="patientVisitsChart().legend"
            ></apx-chart>
          } @else {
            <div class="h-52 flex items-center justify-center">
              <span class="text-[10px] text-theme-text-muted">Loading chart...</span>
            </div>
          }
        </div>

        <!-- Chart 2: Revenue — Bar Chart -->
        <div class="animate-blur-slide stagger-7 bg-theme-panel border border-theme-border rounded-xl p-5 min-h-[290px]">
          <div class="flex items-center justify-between mb-2">
            <div>
              <h3 class="text-xs font-semibold text-theme-text-main">Revenue</h3>
              <p class="text-[10px] text-theme-text-muted mt-0.5">Monthly income breakdown</p>
            </div>
            <span class="text-[10px] font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">+18.3%</span>
          </div>
          @if (isBrowser()) {
            <apx-chart
              class="w-full font-sans"
              [series]="revenueChart().series"
              [chart]="revenueChart().chart"
              [colors]="revenueChart().colors"
              [plotOptions]="revenueChart().plotOptions"
              [xaxis]="revenueChart().xaxis"
              [yaxis]="revenueChart().yaxis"
              [grid]="revenueChart().grid"
              [dataLabels]="revenueChart().dataLabels"
              [tooltip]="revenueChart().tooltip"
            ></apx-chart>
          } @else {
            <div class="h-52 flex items-center justify-center">
              <span class="text-[10px] text-theme-text-muted">Loading chart...</span>
            </div>
          }
        </div>

      </div>

      <!-- Charts Row 2: Department Distribution (Donut) + Patient Satisfaction (RadialBar) + Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <!-- Chart 3: Department Distribution — Donut Chart -->
        <div class="animate-blur-slide stagger-6 bg-theme-panel border border-theme-border rounded-xl p-5 min-h-[300px]">
          <div class="mb-2">
            <h3 class="text-xs font-semibold text-theme-text-main">Department Load</h3>
            <p class="text-[10px] text-theme-text-muted mt-0.5">Patient distribution by department</p>
          </div>
          @if (isBrowser()) {
            <apx-chart
              class="w-full font-sans"
              [series]="departmentChart().series"
              [chart]="departmentChart().chart"
              [colors]="departmentChart().colors"
              [labels]="departmentChart().labels"
              [legend]="departmentChart().legend"
              [stroke]="departmentChart().stroke"
              [dataLabels]="departmentChart().dataLabels"
              [plotOptions]="departmentChart().plotOptions"
              [tooltip]="departmentChart().tooltip"
            ></apx-chart>
          } @else {
            <div class="h-52 flex items-center justify-center">
              <span class="text-[10px] text-theme-text-muted">Loading chart...</span>
            </div>
          }
        </div>

        <!-- Chart 4: Patient Satisfaction — RadialBar Chart -->
        <div class="animate-blur-slide stagger-6 bg-theme-panel border border-theme-border rounded-xl p-5 min-h-[300px]">
          <div class="mb-2">
            <h3 class="text-xs font-semibold text-theme-text-main">Satisfaction Score</h3>
            <p class="text-[10px] text-theme-text-muted mt-0.5">Patient feedback ratings</p>
          </div>
          @if (isBrowser()) {
            <apx-chart
              class="w-full font-sans"
              [series]="satisfactionChart().series"
              [chart]="satisfactionChart().chart"
              [colors]="satisfactionChart().colors"
              [plotOptions]="satisfactionChart().plotOptions"
              [labels]="satisfactionChart().labels"
              [stroke]="satisfactionChart().stroke"
            ></apx-chart>
          } @else {
            <div class="h-52 flex items-center justify-center">
              <span class="text-[10px] text-theme-text-muted">Loading chart...</span>
            </div>
          }
        </div>

        <!-- Recent Activity -->
        <div class="animate-blur-slide stagger-6 bg-theme-panel border border-theme-border rounded-xl p-5 min-h-[300px]">
          <h3 class="text-xs font-semibold text-theme-text-main mb-4">Recent Activity</h3>
          <div class="space-y-3">
            @for (log of state.activityLogs(); track log.id) {
              <div class="flex gap-3 items-start">
                <div class="mt-1 w-1.5 h-1.5 rounded-full shrink-0" 
                  [class.bg-emerald-500]="log.category === 'medical'"
                  [class.bg-blue-500]="log.category === 'system'"
                  [class.bg-amber-500]="log.category === 'administrative'"></div>
                <div class="min-w-0">
                  <p class="text-[11px] text-theme-text-main leading-snug">{{ log.message }}</p>
                  <p class="text-[9px] text-theme-text-muted mt-0.5">{{ log.time }}</p>
                </div>
              </div>
            }
          </div>
        </div>

      </div>

      <!-- Upcoming Appointments Preview -->
      <div class="animate-blur-slide stagger-7 bg-theme-panel border border-theme-border rounded-xl p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xs font-semibold text-theme-text-main">Today's Appointments</h3>
          <button class="text-[10px] text-emerald-500 hover:text-emerald-400 font-medium cursor-pointer clickable-scale">View All</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="border-b border-theme-border">
                <th class="pb-2 text-[9px] font-medium text-theme-text-muted uppercase tracking-wider">Patient</th>
                <th class="pb-2 text-[9px] font-medium text-theme-text-muted uppercase tracking-wider hidden sm:table-cell">Doctor</th>
                <th class="pb-2 text-[9px] font-medium text-theme-text-muted uppercase tracking-wider hidden sm:table-cell">Time</th>
                <th class="pb-2 text-[9px] font-medium text-theme-text-muted uppercase tracking-wider">Type</th>
                <th class="pb-2 text-[9px] font-medium text-theme-text-muted uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              @for (apt of todayAppointments(); track apt.id) {
                <tr class="border-b border-theme-border/50 last:border-none hover:bg-theme-hover/50 transition-colors">
                  <td class="py-2.5">
                    <div class="flex items-center gap-2">
                      <div [class]="apt.avatar" class="w-6 h-6 rounded-full flex items-center justify-center text-white text-[8px] font-bold shrink-0">
                        {{ getInitials(apt.patientName) }}
                      </div>
                      <span class="text-[11px] text-theme-text-main font-medium">{{ apt.patientName }}</span>
                    </div>
                  </td>
                  <td class="py-2.5 text-[11px] text-theme-text-muted hidden sm:table-cell">{{ apt.doctor }}</td>
                  <td class="py-2.5 text-[11px] text-theme-text-muted font-mono hidden sm:table-cell">{{ apt.time }}</td>
                  <td class="py-2.5">
                    <span class="text-[9px] font-medium px-2 py-0.5 rounded-full"
                      [class.bg-blue-500/10]="apt.type === 'Consultation'" [class.text-blue-500]="apt.type === 'Consultation'"
                      [class.bg-amber-500/10]="apt.type === 'Follow-up'" [class.text-amber-500]="apt.type === 'Follow-up'"
                      [class.bg-rose-500/10]="apt.type === 'Emergency'" [class.text-rose-500]="apt.type === 'Emergency'"
                      [class.bg-violet-500/10]="apt.type === 'Lab Test'" [class.text-violet-500]="apt.type === 'Lab Test'">
                      {{ apt.type }}
                    </span>
                  </td>
                  <td class="py-2.5">
                    <span class="text-[9px] font-medium px-2 py-0.5 rounded-full"
                      [class.bg-emerald-500/10]="apt.status === 'Scheduled'" [class.text-emerald-500]="apt.status === 'Scheduled'"
                      [class.bg-blue-500/10]="apt.status === 'In Progress'" [class.text-blue-500]="apt.status === 'In Progress'"
                      [class.bg-green-500/10]="apt.status === 'Completed'" [class.text-green-600]="apt.status === 'Completed'"
                      [class.bg-red-500/10]="apt.status === 'Cancelled'" [class.text-red-500]="apt.status === 'Cancelled'">
                      {{ apt.status }}
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `
})
export class DashboardComponent {
  protected readonly state = inject(ClinicService);
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly isBrowser = signal(false);

  protected readonly todayAppointments = signal(this.state.appointments().slice(0, 5));

  constructor() {
    let isInitial = true;

    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.isBrowser.set(true);
      }, 300);
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
        }, 220);
      }
    });
  }

  // === Chart 1: Patient Visits — Area Chart ===
  protected readonly patientVisitsChart = computed(() => {
    const isDark = this.state.isDark();
    const gridColor = isDark ? '#27272a' : '#eaeaea';
    const labelColor = isDark ? '#71717a' : '#a1a1aa';

    return {
      series: [
        { name: 'Walk-in', data: [120, 145, 132, 168, 154, 178] },
        { name: 'Scheduled', data: [210, 238, 245, 262, 280, 295] }
      ],
      chart: {
        type: 'area' as any,
        height: 220,
        toolbar: { show: false },
        animations: { enabled: true, speed: 600 }
      },
      colors: ['#10b981', '#3b82f6'],
      stroke: { curve: 'smooth' as any, width: 2.5 },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.3,
          opacityTo: 0.02,
          stops: [0, 90, 100]
        }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: { colors: labelColor, fontFamily: 'Geist Sans, sans-serif', fontSize: '9px' }
        }
      },
      yaxis: {
        labels: {
          style: { colors: labelColor, fontFamily: 'Geist Sans, sans-serif', fontSize: '9px' }
        }
      },
      grid: {
        borderColor: gridColor,
        strokeDashArray: 4,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
        padding: { top: 0, right: 10, bottom: 0, left: 10 }
      },
      dataLabels: { enabled: false },
      tooltip: {
        theme: isDark ? 'dark' : 'light',
        style: { fontSize: '10px', fontFamily: 'Geist Sans, sans-serif' }
      },
      legend: { show: false }
    };
  });

  // === Chart 2: Revenue — Bar Chart ===
  protected readonly revenueChart = computed(() => {
    const isDark = this.state.isDark();
    const gridColor = isDark ? '#27272a' : '#eaeaea';
    const labelColor = isDark ? '#71717a' : '#a1a1aa';

    return {
      series: [
        { name: 'Revenue', data: [42000, 48000, 45500, 52000, 58000, 63000] }
      ],
      chart: {
        type: 'bar' as any,
        height: 220,
        toolbar: { show: false },
        animations: { enabled: true, speed: 600 }
      },
      colors: ['#8b5cf6'],
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: '50%',
          distributed: false
        }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: { colors: labelColor, fontFamily: 'Geist Sans, sans-serif', fontSize: '9px' }
        }
      },
      yaxis: {
        labels: {
          style: { colors: labelColor, fontFamily: 'Geist Sans, sans-serif', fontSize: '9px' },
          formatter: (val: number) => `$${(val / 1000).toFixed(0)}k`
        }
      },
      grid: {
        borderColor: gridColor,
        strokeDashArray: 4,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
        padding: { top: 0, right: 10, bottom: 0, left: 10 }
      },
      dataLabels: { enabled: false },
      tooltip: {
        theme: isDark ? 'dark' : 'light',
        style: { fontSize: '10px', fontFamily: 'Geist Sans, sans-serif' },
        y: { formatter: (val: number) => `$${val.toLocaleString()}` }
      }
    };
  });

  // === Chart 3: Department Distribution — Donut Chart ===
  protected readonly departmentChart = computed(() => {
    const isDark = this.state.isDark();

    return {
      series: [35, 25, 20, 12, 8],
      chart: {
        type: 'donut' as any,
        height: 220,
        animations: { enabled: true, speed: 600 }
      },
      colors: ['#f43f5e', '#6366f1', '#f59e0b', '#10b981', '#3b82f6'],
      labels: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology'],
      legend: {
        position: 'bottom' as any,
        fontSize: '10px',
        fontFamily: 'Geist Sans, sans-serif',
        labels: { colors: isDark ? '#a1a1aa' : '#71717a' },
        markers: { size: 6, offsetX: -3 },
        itemMargin: { horizontal: 8, vertical: 4 }
      },
      stroke: { width: 2, colors: [isDark ? '#18181b' : '#ffffff'] },
      dataLabels: { enabled: false },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '10px',
                fontFamily: 'Geist Sans, sans-serif',
                color: isDark ? '#fafafa' : '#18181b'
              },
              value: {
                show: true,
                fontSize: '16px',
                fontFamily: 'Geist Sans, sans-serif',
                fontWeight: 600,
                color: isDark ? '#fafafa' : '#18181b',
                formatter: (val: string) => `${val}%`
              },
              total: {
                show: true,
                label: 'Total',
                fontSize: '9px',
                fontFamily: 'Geist Sans, sans-serif',
                color: isDark ? '#71717a' : '#a1a1aa',
                formatter: () => '2,847'
              }
            }
          }
        }
      },
      tooltip: {
        theme: isDark ? 'dark' : 'light',
        style: { fontSize: '10px', fontFamily: 'Geist Sans, sans-serif' }
      }
    };
  });

  // === Chart 4: Patient Satisfaction — RadialBar Chart ===
  protected readonly satisfactionChart = computed(() => {
    const isDark = this.state.isDark();

    return {
      series: [92, 87, 78],
      chart: {
        type: 'radialBar' as any,
        height: 230,
        animations: { enabled: true, speed: 600 }
      },
      colors: ['#10b981', '#3b82f6', '#f59e0b'],
      plotOptions: {
        radialBar: {
          hollow: { size: '35%' },
          track: {
            background: isDark ? '#27272a' : '#f4f4f5',
            strokeWidth: '100%'
          },
          dataLabels: {
            name: {
              fontSize: '10px',
              fontFamily: 'Geist Sans, sans-serif',
              color: isDark ? '#a1a1aa' : '#71717a',
              offsetY: -4
            },
            value: {
              fontSize: '18px',
              fontFamily: 'Geist Sans, sans-serif',
              fontWeight: 600,
              color: isDark ? '#fafafa' : '#18181b',
              offsetY: 4,
              formatter: (val: number) => `${val}%`
            },
            total: {
              show: true,
              label: 'Average',
              fontSize: '9px',
              fontFamily: 'Geist Sans, sans-serif',
              color: isDark ? '#71717a' : '#a1a1aa',
              formatter: () => '86%'
            }
          }
        }
      },
      labels: ['Care Quality', 'Wait Time', 'Facility'],
      stroke: { lineCap: 'round' as any }
    };
  });

  protected getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
}
