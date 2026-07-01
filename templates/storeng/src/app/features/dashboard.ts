import { Component, inject, signal, computed, PLATFORM_ID, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../shared/services/store.service';
import { UiSelectComponent, SelectOption } from '../shared/components/ui-select';
import { UiDatepickerComponent } from '../shared/components/ui-datepicker';

@Component({
  selector: 'app-dashboard',
  imports: [NgApexchartsModule, FormsModule, UiSelectComponent, UiDatepickerComponent],
  template: `
    <div class="space-y-6">
      
      <!-- Page Header -->
      <div class="animate-blur-slide stagger-1 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 class="text-lg font-semibold text-theme-text-main">Good morning, Alex</h2>
          <p class="text-xs text-theme-text-muted mt-0.5">Here's a snapshot of your store's performance today.</p>
        </div>
        <!-- Date Picker + Period Selector -->
        <div class="flex flex-wrap items-center gap-2 shrink-0">
          <ui-select
            [(value)]="activePeriod"
            [options]="periodOptions"
            placeholder="Period"
            wrapperClass="w-28"
          />
          <ui-datepicker
            [(value)]="dateFrom"
            placeholder="From"
            wrapperClass="w-36"
          />
          <span class="text-xs text-theme-text-muted select-none">—</span>
          <ui-datepicker
            [(value)]="dateTo"
            placeholder="To"
            wrapperClass="w-36"
            [alignRight]="true"
          />
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="animate-blur-slide stagger-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button class="flex items-center justify-center gap-2.5 px-4 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-medium transition-all cursor-pointer clickable-scale">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          New Order
        </button>
        <button class="flex items-center justify-center gap-2.5 px-4 py-3 bg-theme-panel border border-theme-border hover:border-sky-500/40 text-theme-text-main rounded-xl text-xs font-medium transition-all cursor-pointer clickable-scale">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-500"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/></svg>
          Add Product
        </button>
        <button class="flex items-center justify-center gap-2.5 px-4 py-3 bg-theme-panel border border-theme-border hover:border-sky-500/40 text-theme-text-main rounded-xl text-xs font-medium transition-all cursor-pointer clickable-scale">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-violet-500"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Export CSV
        </button>
        <button class="flex items-center justify-center gap-2.5 px-4 py-3 bg-theme-panel border border-theme-border hover:border-sky-500/40 text-theme-text-main rounded-xl text-xs font-medium transition-all cursor-pointer clickable-scale">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="m19 9-5 5-4-4-3 3"/></svg>
          View Reports
        </button>
      </div>

      <!-- KPI Cards Grid -->
      <div class="animate-blur-slide stagger-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <!-- Total Revenue -->
        <div class="bg-theme-panel border border-theme-border rounded-xl p-5 transition-all hover:border-sky-500/30">
          <div class="flex items-center justify-between mb-3">
            <div class="w-9 h-9 rounded-lg bg-sky-500/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-sky-500"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <span class="text-[10px] font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">{{ state.totalRevenue().change }}</span>
          </div>
          <p class="text-2xl font-semibold text-theme-text-main tracking-tight">{{ state.totalRevenue().value }}</p>
          <p class="text-[10px] text-theme-text-muted mt-1">Total Revenue</p>
        </div>

        <!-- Total Orders -->
        <div class="bg-theme-panel border border-theme-border rounded-xl p-5 transition-all hover:border-violet-500/30">
          <div class="flex items-center justify-between mb-3">
            <div class="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-violet-500"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            </div>
            <span class="text-[10px] font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">{{ state.totalOrders().change }}</span>
          </div>
          <p class="text-2xl font-semibold text-theme-text-main tracking-tight">{{ state.totalOrders().value }}</p>
          <p class="text-[10px] text-theme-text-muted mt-1">Total Orders</p>
        </div>

        <!-- Total Products -->
        <div class="bg-theme-panel border border-theme-border rounded-xl p-5 transition-all hover:border-amber-500/30">
          <div class="flex items-center justify-between mb-3">
            <div class="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-500"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/></svg>
            </div>
            <span class="text-[10px] font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">{{ state.totalProducts().change }}</span>
          </div>
          <p class="text-2xl font-semibold text-theme-text-main tracking-tight">{{ state.totalProducts().value }}</p>
          <p class="text-[10px] text-theme-text-muted mt-1">Total Products</p>
        </div>

        <!-- Conversion Rate -->
        <div class="bg-theme-panel border border-theme-border rounded-xl p-5 transition-all hover:border-emerald-500/30">
          <div class="flex items-center justify-between mb-3">
            <div class="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
            </div>
            <span class="text-[10px] font-medium text-sky-500 bg-sky-500/10 px-2 py-0.5 rounded-full">{{ state.conversionRate().status }}</span>
          </div>
          <p class="text-2xl font-semibold text-theme-text-main tracking-tight">{{ state.conversionRate().value }}</p>
          <p class="text-[10px] text-theme-text-muted mt-1">Conversion Rate</p>
        </div>

      </div>

      <!-- Charts Row 1 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <!-- Chart 1: Revenue Trend — Area Chart -->
        <div class="animate-blur-slide stagger-4 bg-theme-panel border border-theme-border rounded-xl p-5 min-h-[290px]">
          <!-- Chart header: amount + title + controls -->
          <div class="flex items-start justify-between mb-4 gap-2">
            <div>
              <p class="text-[10px] text-theme-text-muted">Total Revenue</p>
              <div class="flex items-baseline gap-2 mt-0.5">
                <span class="text-xl font-semibold text-theme-text-main tracking-tight">{{ revenueAmount() }}</span>
                <span class="text-[10px] font-medium text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">+12.4%</span>
              </div>
              <div class="flex items-center gap-3 text-[9px] text-theme-text-muted mt-1.5">
                <span class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-sky-500"></span> Revenue</span>
                <span class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-violet-500"></span> Orders</span>
              </div>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              <!-- Period selector -->
              <ui-select
                [(value)]="chartPeriod"
                [options]="periodOptions"
                placeholder="Period"
                wrapperClass="w-24"
                height="28px"
              />
              <!-- Customize button -->
              <button (click)="toggleChartCustomizer()" [class.border-sky-500]="showChartCustomizer()" [class.text-sky-500]="showChartCustomizer()" class="h-7 w-7 flex items-center justify-center bg-theme-bg border border-theme-border rounded-lg text-theme-text-muted hover:text-theme-text-main hover:border-sky-500/50 transition-colors cursor-pointer clickable-scale">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
              </button>
            </div>
          </div>
          <!-- Chart customizer panel -->
          @if (showChartCustomizer()) {
            <div class="mb-3 p-3 bg-theme-bg border border-theme-border rounded-xl flex flex-wrap gap-3 text-[10px] animate-blur-slide">
              <label class="flex items-center gap-1.5 cursor-pointer text-theme-text-muted hover:text-theme-text-main">
                <input type="checkbox" [(ngModel)]="showRevenueSeries" class="accent-sky-500 w-3 h-3"> Revenue
              </label>
              <label class="flex items-center gap-1.5 cursor-pointer text-theme-text-muted hover:text-theme-text-main">
                <input type="checkbox" [(ngModel)]="showOrdersSeries" class="accent-violet-500 w-3 h-3"> Orders
              </label>
              <label class="flex items-center gap-1.5 cursor-pointer text-theme-text-muted hover:text-theme-text-main">
                <input type="checkbox" [(ngModel)]="showGridLines" class="accent-sky-500 w-3 h-3"> Grid lines
              </label>
              <label class="flex items-center gap-1.5 cursor-pointer text-theme-text-muted hover:text-theme-text-main">
                <input type="checkbox" [(ngModel)]="smoothCurve" class="accent-sky-500 w-3 h-3"> Smooth curve
              </label>
            </div>
          }
          @if (isBrowser()) {
            <apx-chart
              class="w-full font-sans"
              [series]="revenueTrendChart().series"
              [chart]="revenueTrendChart().chart"
              [colors]="revenueTrendChart().colors"
              [stroke]="revenueTrendChart().stroke"
              [fill]="revenueTrendChart().fill"
              [xaxis]="revenueTrendChart().xaxis"
              [yaxis]="revenueTrendChart().yaxis"
              [grid]="revenueTrendChart().grid"
              [dataLabels]="revenueTrendChart().dataLabels"
              [tooltip]="revenueTrendChart().tooltip"
              [legend]="revenueTrendChart().legend"
            ></apx-chart>
          } @else {
            <div class="h-52 flex items-center justify-center">
              <span class="text-[10px] text-theme-text-muted">Loading chart...</span>
            </div>
          }
        </div>

        <!-- Chart 2: Orders by Category — Bar Chart -->
        <div class="animate-blur-slide stagger-7 bg-theme-panel border border-theme-border rounded-xl p-5 min-h-[290px]">
          <div class="flex items-center justify-between mb-2">
            <div>
              <h3 class="text-xs font-semibold text-theme-text-main">Sales by Category</h3>
              <p class="text-[10px] text-theme-text-muted mt-0.5">Units sold per category</p>
            </div>
            <span class="text-[10px] font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">+11.4%</span>
          </div>
          @if (isBrowser()) {
            <apx-chart
              class="w-full font-sans"
              [series]="salesByCategoryChart().series"
              [chart]="salesByCategoryChart().chart"
              [colors]="salesByCategoryChart().colors"
              [plotOptions]="salesByCategoryChart().plotOptions"
              [xaxis]="salesByCategoryChart().xaxis"
              [yaxis]="salesByCategoryChart().yaxis"
              [grid]="salesByCategoryChart().grid"
              [dataLabels]="salesByCategoryChart().dataLabels"
              [tooltip]="salesByCategoryChart().tooltip"
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

        <!-- Chart 3: Revenue Share — Donut Chart -->
        <div class="animate-blur-slide stagger-6 bg-theme-panel border border-theme-border rounded-xl p-5 min-h-[300px]">
          <div class="mb-2">
            <h3 class="text-xs font-semibold text-theme-text-main">Revenue by Category</h3>
            <p class="text-[10px] text-theme-text-muted mt-0.5">Share of total revenue per category</p>
          </div>
          @if (isBrowser()) {
            <apx-chart
              class="w-full font-sans"
              [series]="revenueShareChart().series"
              [chart]="revenueShareChart().chart"
              [colors]="revenueShareChart().colors"
              [labels]="revenueShareChart().labels"
              [legend]="revenueShareChart().legend"
              [stroke]="revenueShareChart().stroke"
              [dataLabels]="revenueShareChart().dataLabels"
              [plotOptions]="revenueShareChart().plotOptions"
              [tooltip]="revenueShareChart().tooltip"
            ></apx-chart>
          } @else {
            <div class="h-52 flex items-center justify-center">
              <span class="text-[10px] text-theme-text-muted">Loading chart...</span>
            </div>
          }
        </div>

        <!-- Chart 4: Order Fulfillment — RadialBar Chart -->
        <div class="animate-blur-slide stagger-6 bg-theme-panel border border-theme-border rounded-xl p-5 min-h-[300px]">
          <div class="mb-2">
            <h3 class="text-xs font-semibold text-theme-text-main">Order Fulfillment</h3>
            <p class="text-[10px] text-theme-text-muted mt-0.5">Delivery & satisfaction KPIs</p>
          </div>
          @if (isBrowser()) {
            <apx-chart
              class="w-full font-sans"
              [series]="fulfillmentChart().series"
              [chart]="fulfillmentChart().chart"
              [colors]="fulfillmentChart().colors"
              [plotOptions]="fulfillmentChart().plotOptions"
              [labels]="fulfillmentChart().labels"
              [stroke]="fulfillmentChart().stroke"
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
                  [class.bg-sky-500]="log.category === 'order'"
                  [class.bg-amber-500]="log.category === 'product'"
                  [class.bg-violet-500]="log.category === 'system'"></div>
                <div class="min-w-0">
                  <p class="text-[11px] text-theme-text-main leading-snug">{{ log.message }}</p>
                  <p class="text-[9px] text-theme-text-muted mt-0.5">{{ log.time }}</p>
                </div>
              </div>
            }
          </div>
        </div>

      </div>

      <!-- Recent Orders Preview -->
      <div class="animate-blur-slide stagger-7 bg-theme-panel border border-theme-border rounded-xl p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xs font-semibold text-theme-text-main">Recent Orders</h3>
          <button class="text-[10px] text-sky-500 hover:text-sky-400 font-medium cursor-pointer clickable-scale">View All</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="border-b border-theme-border">
                <th class="pb-2 text-[9px] font-medium text-theme-text-muted uppercase tracking-wider px-3 sm:px-5">Order</th>
                <th class="pb-2 text-[9px] font-medium text-theme-text-muted uppercase tracking-wider px-3 sm:px-5 hidden sm:table-cell">Customer</th>
                <th class="pb-2 text-[9px] font-medium text-theme-text-muted uppercase tracking-wider px-3 sm:px-5 hidden sm:table-cell">Date</th>
                <th class="pb-2 text-[9px] font-medium text-theme-text-muted uppercase tracking-wider px-3 sm:px-5">Total</th>
                <th class="pb-2 text-[9px] font-medium text-theme-text-muted uppercase tracking-wider px-3 sm:px-5">Status</th>
              </tr>
            </thead>
            <tbody>
              @for (order of recentOrders(); track order.id) {
                <tr class="border-b border-theme-border/50 last:border-none hover:bg-theme-hover/50 transition-colors">
                  <td class="py-2.5 px-3 sm:px-5">
                    <span class="text-[11px] text-theme-text-main font-medium font-mono">{{ order.orderNumber }}</span>
                  </td>
                  <td class="py-2.5 px-3 sm:px-5 hidden sm:table-cell">
                    <div class="flex items-center gap-2">
                      <div [class]="order.avatar" class="w-6 h-6 rounded-full shrink-0"></div>
                      <span class="text-[11px] text-theme-text-muted">{{ order.customer }}</span>
                    </div>
                  </td>
                  <td class="py-2.5 px-3 sm:px-5 text-[11px] text-theme-text-muted hidden sm:table-cell">{{ order.date }}</td>
                  <td class="py-2.5 px-3 sm:px-5">
                    <span class="text-[11px] text-theme-text-main font-medium">{{ '$' + order.total.toFixed(2) }}</span>
                  </td>
                  <td class="py-2.5 px-3 sm:px-5">
                    <span class="text-[9px] font-medium px-2 py-0.5 rounded-full"
                      [class.bg-amber-500/10]="order.status === 'Pending'" [class.text-amber-500]="order.status === 'Pending'"
                      [class.bg-sky-500/10]="order.status === 'Processing'" [class.text-sky-500]="order.status === 'Processing'"
                      [class.bg-blue-500/10]="order.status === 'Shipped'" [class.text-blue-500]="order.status === 'Shipped'"
                      [class.bg-emerald-500/10]="order.status === 'Delivered'" [class.text-emerald-500]="order.status === 'Delivered'"
                      [class.bg-red-500/10]="order.status === 'Cancelled'" [class.text-red-500]="order.status === 'Cancelled'">
                      {{ order.status }}
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
  protected readonly state = inject(StoreService);
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly isBrowser = signal(false);

  protected readonly recentOrders = signal(this.state.orders().slice(0, 5));

  protected readonly activePeriod = signal('monthly');
  protected readonly chartPeriod = signal('monthly');
  protected readonly dateFrom = signal('');
  protected readonly dateTo = signal('');

  protected readonly periodOptions: SelectOption[] = [
    { value: 'daily',   label: 'Daily'   },
    { value: 'weekly',  label: 'Weekly'  },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly',  label: 'Yearly'  },
  ];
  protected readonly showChartCustomizer = signal(false);
  protected showRevenueSeries = true;
  protected showOrdersSeries = true;
  protected showGridLines = true;
  protected smoothCurve = true;

  protected readonly revenueAmount = computed(() => {
    const p = this.chartPeriod();
    if (p === 'daily') return '$1,612.00';
    if (p === 'weekly') return '$11,284.00';
    if (p === 'yearly') return '$581,048.00';
    return '$48,392.00';
  });

  protected toggleChartCustomizer(): void {
    this.showChartCustomizer.update(v => !v);
  }

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

  // === Chart 1: Revenue Trend — Area Chart ===
  protected readonly revenueTrendChart = computed(() => {
    const isDark = this.state.isDark();
    const gridColor = isDark ? '#27272a' : '#eaeaea';
    const labelColor = isDark ? '#71717a' : '#a1a1aa';
    const period = this.chartPeriod();
    const periodData: Record<string, { cats: string[]; rev: number[]; ord: number[] }> = {
      daily:   { cats: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],  rev: [1200,980,1450,1100,1612,890,1300], ord: [31,25,38,29,42,22,34] },
      weekly:  { cats: ['W1','W2','W3','W4','W5','W6'],  rev: [8200,9400,10100,10800,11180,11284], ord: [210,248,275,302,320,334] },
      monthly: { cats: ['Jan','Feb','Mar','Apr','May','Jun'], rev: [32000,38500,41000,44200,46800,48392], ord: [820,940,1010,1080,1180,1284] },
      yearly:  { cats: ['2020','2021','2022','2023','2024','2025'], rev: [180000,240000,310000,420000,500000,581048], ord: [4200,5800,7100,9400,11200,13840] }
    };
    const d = periodData[period] ?? periodData['monthly'];
    const allSeries = [
      { name: 'Revenue', data: d.rev },
      { name: 'Orders',  data: d.ord }
    ];
    const series = allSeries.filter((s, i) => i === 0 ? this.showRevenueSeries : this.showOrdersSeries);
    return {
      series,
      chart: { type: 'area' as any, height: 200, toolbar: { show: false }, animations: { enabled: true, speed: 600 } },
      colors: ['#0ea5e9', '#8b5cf6'],
      stroke: { curve: (this.smoothCurve ? 'smooth' : 'straight') as any, width: 2.5 },
      fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.02, stops: [0, 90, 100] } },
      xaxis: {
        categories: d.cats,
        axisBorder: { show: false }, axisTicks: { show: false },
        labels: { style: { colors: labelColor, fontFamily: 'Geist Sans, sans-serif', fontSize: '9px' } }
      },
      yaxis: { labels: { style: { colors: labelColor, fontFamily: 'Geist Sans, sans-serif', fontSize: '9px' } } },
      grid: { borderColor: gridColor, strokeDashArray: 4, xaxis: { lines: { show: false } }, yaxis: { lines: { show: this.showGridLines } }, padding: { top: 0, right: 10, bottom: 0, left: 10 } },
      dataLabels: { enabled: false },
      tooltip: { theme: isDark ? 'dark' : 'light', style: { fontSize: '10px', fontFamily: 'Geist Sans, sans-serif' } },
      legend: { show: false }
    };
  });

  // === Chart 2: Sales by Category — Bar Chart ===
  protected readonly salesByCategoryChart = computed(() => {
    const isDark = this.state.isDark();
    const gridColor = isDark ? '#27272a' : '#eaeaea';
    const labelColor = isDark ? '#71717a' : '#a1a1aa';
    return {
      series: [{ name: 'Units Sold', data: [451, 540, 214, 689] }],
      chart: { type: 'bar' as any, height: 220, toolbar: { show: false }, animations: { enabled: true, speed: 600 } },
      colors: ['#0ea5e9'],
      plotOptions: { bar: { borderRadius: 6, columnWidth: '50%', distributed: true } },
      xaxis: {
        categories: ['Electronics', 'Accessories', 'Home', 'Sports'],
        axisBorder: { show: false }, axisTicks: { show: false },
        labels: { style: { colors: labelColor, fontFamily: 'Geist Sans, sans-serif', fontSize: '9px' } }
      },
      yaxis: { labels: { style: { colors: labelColor, fontFamily: 'Geist Sans, sans-serif', fontSize: '9px' } } },
      grid: { borderColor: gridColor, strokeDashArray: 4, xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } }, padding: { top: 0, right: 10, bottom: 0, left: 10 } },
      dataLabels: { enabled: false },
      tooltip: { theme: isDark ? 'dark' : 'light', style: { fontSize: '10px', fontFamily: 'Geist Sans, sans-serif' } }
    };
  });

  // === Chart 3: Revenue Share — Donut Chart ===
  protected readonly revenueShareChart = computed(() => {
    const isDark = this.state.isDark();
    return {
      series: [42, 22, 18, 18],
      chart: { type: 'donut' as any, height: 220, animations: { enabled: true, speed: 600 } },
      colors: ['#0ea5e9', '#8b5cf6', '#f59e0b', '#10b981'],
      labels: ['Electronics', 'Accessories', 'Home & Kitchen', 'Sports'],
      legend: {
        position: 'bottom' as any, fontSize: '10px', fontFamily: 'Geist Sans, sans-serif',
        labels: { colors: isDark ? '#a1a1aa' : '#71717a' },
        markers: { size: 6, offsetX: -3 }, itemMargin: { horizontal: 8, vertical: 4 }
      },
      stroke: { width: 2, colors: [isDark ? '#18181b' : '#ffffff'] },
      dataLabels: { enabled: false },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              name: { show: true, fontSize: '10px', fontFamily: 'Geist Sans, sans-serif', color: isDark ? '#fafafa' : '#18181b' },
              value: { show: true, fontSize: '16px', fontFamily: 'Geist Sans, sans-serif', fontWeight: 600, color: isDark ? '#fafafa' : '#18181b', formatter: (val: string) => `${val}%` },
              total: { show: true, label: 'Revenue', fontSize: '9px', fontFamily: 'Geist Sans, sans-serif', color: isDark ? '#71717a' : '#a1a1aa', formatter: () => '$48.4k' }
            }
          }
        }
      },
      tooltip: { theme: isDark ? 'dark' : 'light', style: { fontSize: '10px', fontFamily: 'Geist Sans, sans-serif' } }
    };
  });

  // === Chart 4: Order Fulfillment — RadialBar Chart ===
  protected readonly fulfillmentChart = computed(() => {
    const isDark = this.state.isDark();
    return {
      series: [96, 88, 74],
      chart: { type: 'radialBar' as any, height: 230, animations: { enabled: true, speed: 600 } },
      colors: ['#0ea5e9', '#10b981', '#f59e0b'],
      plotOptions: {
        radialBar: {
          hollow: { size: '35%' },
          track: { background: isDark ? '#27272a' : '#f4f4f5', strokeWidth: '100%' },
          dataLabels: {
            name: { fontSize: '10px', fontFamily: 'Geist Sans, sans-serif', color: isDark ? '#a1a1aa' : '#71717a', offsetY: -4 },
            value: { fontSize: '18px', fontFamily: 'Geist Sans, sans-serif', fontWeight: 600, color: isDark ? '#fafafa' : '#18181b', offsetY: 4, formatter: (val: number) => `${val}%` },
            total: { show: true, label: 'Average', fontSize: '9px', fontFamily: 'Geist Sans, sans-serif', color: isDark ? '#71717a' : '#a1a1aa', formatter: () => '86%' }
          }
        }
      },
      labels: ['On-Time Delivery', 'Satisfaction', 'Return Rate'],
      stroke: { lineCap: 'round' as any }
    };
  });

}
