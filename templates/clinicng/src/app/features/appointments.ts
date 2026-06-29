import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClinicService, Appointment } from '../shared/services/clinic.service';

@Component({
  selector: 'app-appointments',
  imports: [FormsModule],
  template: `
    <div class="space-y-6">

      <!-- Page Header -->
      <div class="animate-blur-slide stagger-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 class="text-lg font-semibold text-theme-text-main">Appointments</h2>
          <p class="text-xs text-theme-text-muted mt-0.5">Schedule and manage patient appointments.</p>
        </div>
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <!-- View Toggle -->
          <div class="flex items-center bg-theme-panel border border-theme-border rounded-lg p-0.5">
            <button 
              (click)="activeView.set('cards')"
              [class]="activeView() === 'cards' ? 'bg-theme-hover text-theme-text-main' : 'text-theme-text-muted hover:text-theme-text-main'"
              class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-medium transition-all cursor-pointer clickable-scale">
              <!-- Lucide: layout-grid -->
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/></svg>
              Cards
            </button>
            <button 
              (click)="activeView.set('calendar')"
              [class]="activeView() === 'calendar' ? 'bg-theme-hover text-theme-text-main' : 'text-theme-text-muted hover:text-theme-text-main'"
              class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-medium transition-all cursor-pointer clickable-scale">
              <!-- Lucide: calendar-days -->
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
              Calendar
            </button>
          </div>

          <button class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium rounded-lg transition-all clickable-scale shrink-0">
            <!-- Lucide: plus -->
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            New Appointment
          </button>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="animate-blur-slide stagger-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-theme-panel border border-theme-border rounded-xl p-4 text-center">
          <p class="text-xl font-semibold text-theme-text-main">{{ scheduledCount() }}</p>
          <p class="text-[9px] text-theme-text-muted mt-0.5">Scheduled</p>
        </div>
        <div class="bg-theme-panel border border-theme-border rounded-xl p-4 text-center">
          <p class="text-xl font-semibold text-blue-500">{{ inProgressCount() }}</p>
          <p class="text-[9px] text-theme-text-muted mt-0.5">In Progress</p>
        </div>
        <div class="bg-theme-panel border border-theme-border rounded-xl p-4 text-center">
          <p class="text-xl font-semibold text-emerald-500">{{ completedCount() }}</p>
          <p class="text-[9px] text-theme-text-muted mt-0.5">Completed</p>
        </div>
        <div class="bg-theme-panel border border-theme-border rounded-xl p-4 text-center">
          <p class="text-xl font-semibold text-rose-500">{{ cancelledCount() }}</p>
          <p class="text-[9px] text-theme-text-muted mt-0.5">Cancelled</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="animate-blur-slide stagger-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <!-- Search -->
        <div class="flex items-center gap-2 px-3 h-9 bg-theme-panel border border-theme-border rounded-lg w-full sm:w-64">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-theme-text-muted shrink-0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input 
            type="text" 
            [ngModel]="searchFilter()" 
            (ngModelChange)="searchFilter.set($event)" 
            placeholder="Search appointments..." 
            class="bg-transparent border-none outline-none text-xs w-full placeholder-theme-text-muted text-theme-text-main">
        </div>

        <!-- Type Filter -->
        <div class="flex items-center gap-1.5 flex-wrap">
          <button 
            (click)="typeFilter.set('All')"
            [class]="typeFilter() === 'All' ? 'bg-theme-text-main text-theme-bg' : 'bg-theme-panel border border-theme-border text-theme-text-muted hover:text-theme-text-main'"
            class="px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all cursor-pointer clickable-scale">
            All
          </button>
          <button 
            (click)="typeFilter.set('Consultation')"
            [class]="typeFilter() === 'Consultation' ? 'bg-blue-500 text-white' : 'bg-theme-panel border border-theme-border text-theme-text-muted hover:text-theme-text-main'"
            class="px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all cursor-pointer clickable-scale">
            Consultation
          </button>
          <button 
            (click)="typeFilter.set('Follow-up')"
            [class]="typeFilter() === 'Follow-up' ? 'bg-amber-500 text-white' : 'bg-theme-panel border border-theme-border text-theme-text-muted hover:text-theme-text-main'"
            class="px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all cursor-pointer clickable-scale">
            Follow-up
          </button>
          <button 
            (click)="typeFilter.set('Emergency')"
            [class]="typeFilter() === 'Emergency' ? 'bg-rose-500 text-white' : 'bg-theme-panel border border-theme-border text-theme-text-muted hover:text-theme-text-main'"
            class="px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all cursor-pointer clickable-scale">
            Emergency
          </button>
          <button 
            (click)="typeFilter.set('Lab Test')"
            [class]="typeFilter() === 'Lab Test' ? 'bg-violet-500 text-white' : 'bg-theme-panel border border-theme-border text-theme-text-muted hover:text-theme-text-main'"
            class="px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all cursor-pointer clickable-scale">
            Lab Test
          </button>
        </div>
      </div>

      <!-- === CARDS VIEW === -->
      @if (activeView() === 'cards') {
        <div class="animate-blur-slide stagger-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          @for (apt of filteredAppointments(); track apt.id) {
            <div class="bg-theme-panel border border-theme-border rounded-xl p-4 hover:border-emerald-500/30 transition-all group">
              <!-- Top: Patient + Status -->
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-3">
                  <div [class]="apt.avatar" class="w-9 h-9 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                    {{ getInitials(apt.patientName) }}
                  </div>
                  <div>
                    <p class="text-[11px] font-medium text-theme-text-main">{{ apt.patientName }}</p>
                    <p class="text-[9px] text-theme-text-muted">{{ apt.doctor }}</p>
                  </div>
                </div>
                <span class="text-[9px] font-medium px-2 py-0.5 rounded-full shrink-0"
                  [class.bg-emerald-500/10]="apt.status === 'Scheduled'" [class.text-emerald-500]="apt.status === 'Scheduled'"
                  [class.bg-blue-500/10]="apt.status === 'In Progress'" [class.text-blue-500]="apt.status === 'In Progress'"
                  [class.bg-green-500/10]="apt.status === 'Completed'" [class.text-green-600]="apt.status === 'Completed'"
                  [class.bg-red-500/10]="apt.status === 'Cancelled'" [class.text-red-500]="apt.status === 'Cancelled'">
                  {{ apt.status }}
                </span>
              </div>

              <!-- Details -->
              <div class="space-y-2 pt-3 border-t border-theme-border/50">
                <div class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-theme-text-muted shrink-0"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
                  <span class="text-[10px] text-theme-text-muted">{{ apt.date }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-theme-text-muted shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  <span class="text-[10px] text-theme-text-muted font-mono">{{ apt.time }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-theme-text-muted shrink-0"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>
                  <span class="text-[9px] font-medium px-2 py-0.5 rounded-full"
                    [class.bg-blue-500/10]="apt.type === 'Consultation'" [class.text-blue-500]="apt.type === 'Consultation'"
                    [class.bg-amber-500/10]="apt.type === 'Follow-up'" [class.text-amber-500]="apt.type === 'Follow-up'"
                    [class.bg-rose-500/10]="apt.type === 'Emergency'" [class.text-rose-500]="apt.type === 'Emergency'"
                    [class.bg-violet-500/10]="apt.type === 'Lab Test'" [class.text-violet-500]="apt.type === 'Lab Test'">
                    {{ apt.type }}
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-2 mt-4 pt-3 border-t border-theme-border/50">
                <button class="flex-1 py-1.5 text-[10px] font-medium text-theme-text-muted hover:text-theme-text-main bg-theme-hover rounded-lg transition-all cursor-pointer clickable-scale text-center">
                  Reschedule
                </button>
                <button class="flex-1 py-1.5 text-[10px] font-medium text-emerald-500 hover:text-emerald-400 bg-emerald-500/10 rounded-lg transition-all cursor-pointer clickable-scale text-center">
                  Check In
                </button>
              </div>
            </div>
          } @empty {
            <div class="col-span-full text-center py-10">
              <p class="text-xs text-theme-text-muted">No appointments found matching your criteria.</p>
            </div>
          }
        </div>
      }

      <!-- === CALENDAR VIEW === -->
      @if (activeView() === 'calendar') {
        <div class="animate-blur-slide stagger-4 bg-theme-panel border border-theme-border rounded-xl overflow-hidden">
          
          <!-- Calendar Header: Week Navigation -->
          <div class="flex items-center justify-between px-5 py-3 border-b border-theme-border">
            <button (click)="navigateWeek(-1)" class="w-7 h-7 flex items-center justify-center rounded-lg bg-theme-hover text-theme-text-muted hover:text-theme-text-main cursor-pointer clickable-scale">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <h3 class="text-xs font-semibold text-theme-text-main">{{ currentWeekLabel() }}</h3>
            <button (click)="navigateWeek(1)" class="w-7 h-7 flex items-center justify-center rounded-lg bg-theme-hover text-theme-text-muted hover:text-theme-text-main cursor-pointer clickable-scale">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>

          <!-- Calendar Grid -->
          <div class="overflow-x-auto">
            <div class="min-w-[700px]">
              <!-- Day Headers -->
              <div class="grid grid-cols-[60px_repeat(7,1fr)] border-b border-theme-border">
                <div class="p-2"></div>
                @for (day of weekDays(); track day.key) {
                  <div class="p-2 text-center border-l border-theme-border/50">
                    <p class="text-[9px] font-medium text-theme-text-muted uppercase">{{ day.short }}</p>
                    <p class="text-sm font-semibold mt-0.5" [class.text-emerald-500]="day.isToday" [class.text-theme-text-main]="!day.isToday">{{ day.date }}</p>
                  </div>
                }
              </div>

              <!-- Time Slots -->
              @for (slot of timeSlots; track slot) {
                <div class="grid grid-cols-[60px_repeat(7,1fr)] border-b border-theme-border/30 min-h-[60px]">
                  <!-- Time Label -->
                  <div class="p-2 flex items-start justify-end pr-3">
                    <span class="text-[9px] font-mono text-theme-text-muted">{{ slot }}</span>
                  </div>
                  <!-- Day Cells -->
                  @for (day of weekDays(); track day.key) {
                    <div class="border-l border-theme-border/30 p-1 relative min-h-[60px]">
                      @for (apt of getAppointmentsForSlot(day.key, slot); track apt.id) {
                        <div class="mb-1 px-2 py-1.5 rounded-lg text-[9px] leading-tight cursor-pointer transition-all hover:scale-[1.02]"
                          [class.bg-blue-500/15]="apt.type === 'Consultation'" [class.border-l-2]="true"
                          [class.border-blue-500]="apt.type === 'Consultation'"
                          [class.bg-amber-500/15]="apt.type === 'Follow-up'"
                          [class.border-amber-500]="apt.type === 'Follow-up'"
                          [class.bg-rose-500/15]="apt.type === 'Emergency'"
                          [class.border-rose-500]="apt.type === 'Emergency'"
                          [class.bg-violet-500/15]="apt.type === 'Lab Test'"
                          [class.border-violet-500]="apt.type === 'Lab Test'">
                          <p class="font-medium text-theme-text-main truncate">{{ apt.patientName }}</p>
                          <p class="text-theme-text-muted truncate mt-0.5">{{ apt.doctor }}</p>
                        </div>
                      }
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class AppointmentsComponent {
  protected readonly state = inject(ClinicService);
  protected readonly searchFilter = signal('');
  protected readonly typeFilter = signal<'All' | 'Consultation' | 'Follow-up' | 'Emergency' | 'Lab Test'>('All');
  protected readonly activeView = signal<'cards' | 'calendar'>('cards');
  protected readonly weekOffset = signal(0);

  protected readonly timeSlots = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  protected readonly scheduledCount = computed(() => this.state.appointments().filter(a => a.status === 'Scheduled').length);
  protected readonly inProgressCount = computed(() => this.state.appointments().filter(a => a.status === 'In Progress').length);
  protected readonly completedCount = computed(() => this.state.appointments().filter(a => a.status === 'Completed').length);
  protected readonly cancelledCount = computed(() => this.state.appointments().filter(a => a.status === 'Cancelled').length);

  protected readonly filteredAppointments = computed(() => {
    let appointments = this.state.appointments();
    const search = this.searchFilter().toLowerCase();
    const type = this.typeFilter();

    if (search) {
      appointments = appointments.filter(a =>
        a.patientName.toLowerCase().includes(search) ||
        a.doctor.toLowerCase().includes(search)
      );
    }

    if (type !== 'All') {
      appointments = appointments.filter(a => a.type === type);
    }

    return appointments;
  });

  protected readonly weekDays = computed(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startOfWeek.setDate(today.getDate() + diff + (this.weekOffset() * 7));

    const days: { key: string; short: string; date: number; isToday: boolean }[] = [];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push({
        key: this.formatDateKey(d),
        short: dayNames[i],
        date: d.getDate(),
        isToday: d.toDateString() === today.toDateString()
      });
    }

    return days;
  });

  protected readonly currentWeekLabel = computed(() => {
    const days = this.weekDays();
    if (days.length === 0) return '';
    const first = days[0];
    const last = days[6];
    const today = new Date();
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startOfWeek.setDate(today.getDate() + diff + (this.weekOffset() * 7));

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[startOfWeek.getMonth()]} ${startOfWeek.getDate()} – ${months[endOfWeek.getMonth()]} ${endOfWeek.getDate()}, ${endOfWeek.getFullYear()}`;
  });

  protected navigateWeek(direction: number): void {
    this.weekOffset.update(v => v + direction);
  }

  protected getAppointmentsForSlot(dayKey: string, timeSlot: string): Appointment[] {
    const filtered = this.filteredAppointments();
    return filtered.filter(apt => {
      const aptDateKey = this.parseDateToKey(apt.date);
      const aptHour = this.parseTimeToHour(apt.time);
      const slotHour = this.parseTimeToHour(timeSlot);
      return aptDateKey === dayKey && aptHour === slotHour;
    });
  }

  protected getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  private formatDateKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private parseDateToKey(dateStr: string): string {
    const parsed = new Date(dateStr);
    if (isNaN(parsed.getTime())) return '';
    return this.formatDateKey(parsed);
  }

  private parseTimeToHour(timeStr: string): number {
    const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return -1;
    let hour = parseInt(match[1], 10);
    const period = match[3].toUpperCase();
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    return hour;
  }
}
