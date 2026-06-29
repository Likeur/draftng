import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClinicService, Patient } from '../shared/services/clinic.service';

@Component({
  selector: 'app-patients',
  imports: [FormsModule],
  template: `
    <div class="space-y-6">

      <!-- Page Header -->
      <div class="animate-blur-slide stagger-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 class="text-lg font-semibold text-theme-text-main">Patients</h2>
          <p class="text-xs text-theme-text-muted mt-0.5">Manage and view all registered patients.</p>
        </div>
        <button class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium rounded-lg transition-all clickable-scale shrink-0">
          <!-- Lucide: plus -->
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Add Patient
        </button>
      </div>

      <!-- Filters Bar -->
      <div class="animate-blur-slide stagger-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <!-- Search -->
        <div class="flex items-center gap-2 px-3 h-9 bg-theme-panel border border-theme-border rounded-lg w-full sm:w-64">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-theme-text-muted shrink-0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input 
            type="text" 
            [ngModel]="searchFilter()" 
            (ngModelChange)="searchFilter.set($event)" 
            placeholder="Search patients..." 
            class="bg-transparent border-none outline-none text-xs w-full placeholder-theme-text-muted text-theme-text-main">
        </div>

        <!-- Status Filter -->
        <div class="flex items-center gap-1.5">
          <button 
            (click)="statusFilter.set('All')"
            [class]="statusFilter() === 'All' ? 'bg-theme-text-main text-theme-bg' : 'bg-theme-panel border border-theme-border text-theme-text-muted hover:text-theme-text-main'"
            class="px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all cursor-pointer clickable-scale">
            All
          </button>
          <button 
            (click)="statusFilter.set('Active')"
            [class]="statusFilter() === 'Active' ? 'bg-emerald-500 text-white' : 'bg-theme-panel border border-theme-border text-theme-text-muted hover:text-theme-text-main'"
            class="px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all cursor-pointer clickable-scale">
            Active
          </button>
          <button 
            (click)="statusFilter.set('Critical')"
            [class]="statusFilter() === 'Critical' ? 'bg-rose-500 text-white' : 'bg-theme-panel border border-theme-border text-theme-text-muted hover:text-theme-text-main'"
            class="px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all cursor-pointer clickable-scale">
            Critical
          </button>
          <button 
            (click)="statusFilter.set('Inactive')"
            [class]="statusFilter() === 'Inactive' ? 'bg-zinc-500 text-white' : 'bg-theme-panel border border-theme-border text-theme-text-muted hover:text-theme-text-main'"
            class="px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all cursor-pointer clickable-scale">
            Inactive
          </button>
        </div>
      </div>

      <!-- Patients Table -->
      <div class="animate-blur-slide stagger-3 bg-theme-panel border border-theme-border rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="border-b border-theme-border bg-theme-hover/50">
                <th class="px-3 sm:px-5 py-3 text-[9px] font-medium text-theme-text-muted uppercase tracking-wider">Patient</th>
                <th class="px-3 sm:px-5 py-3 text-[9px] font-medium text-theme-text-muted uppercase tracking-wider">Age / Gender</th>
                <th class="px-3 sm:px-5 py-3 text-[9px] font-medium text-theme-text-muted uppercase tracking-wider hidden md:table-cell">Phone</th>
                <th class="px-3 sm:px-5 py-3 text-[9px] font-medium text-theme-text-muted uppercase tracking-wider hidden lg:table-cell">Condition</th>
                <th class="px-3 sm:px-5 py-3 text-[9px] font-medium text-theme-text-muted uppercase tracking-wider hidden sm:table-cell">Last Visit</th>
                <th class="px-3 sm:px-5 py-3 text-[9px] font-medium text-theme-text-muted uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              @for (patient of filteredPatients(); track patient.id) {
                <tr class="border-b border-theme-border/50 last:border-none hover:bg-theme-hover/50 transition-colors cursor-pointer">
                  <td class="px-3 sm:px-5 py-3">
                    <div class="flex items-center gap-2 sm:gap-3">
                      <div [class]="patient.avatar" class="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-[9px] sm:text-[10px] font-bold shrink-0">
                        {{ getInitials(patient.name) }}
                      </div>
                      <div class="min-w-0">
                        <p class="text-[11px] font-medium text-theme-text-main truncate">{{ patient.name }}</p>
                        <p class="text-[9px] text-theme-text-muted">ID: #{{ patient.id.toString().padStart(4, '0') }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-3 sm:px-5 py-3 text-[11px] text-theme-text-muted">{{ patient.age }}y / {{ patient.gender }}</td>
                  <td class="px-3 sm:px-5 py-3 text-[11px] text-theme-text-muted font-mono hidden md:table-cell">{{ patient.phone }}</td>
                  <td class="px-3 sm:px-5 py-3 text-[11px] text-theme-text-muted hidden lg:table-cell">{{ patient.condition }}</td>
                  <td class="px-3 sm:px-5 py-3 text-[11px] text-theme-text-muted hidden sm:table-cell">{{ patient.lastVisit }}</td>
                  <td class="px-3 sm:px-5 py-3">
                    <span class="text-[9px] font-medium px-2 py-0.5 rounded-full"
                      [class.bg-emerald-500/10]="patient.status === 'Active'" [class.text-emerald-500]="patient.status === 'Active'"
                      [class.bg-rose-500/10]="patient.status === 'Critical'" [class.text-rose-500]="patient.status === 'Critical'"
                      [class.bg-zinc-500/10]="patient.status === 'Inactive'" [class.text-zinc-500]="patient.status === 'Inactive'">
                      {{ patient.status }}
                    </span>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="px-5 py-10 text-center text-xs text-theme-text-muted">No patients found matching your criteria.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Table Footer -->
        <div class="px-3 sm:px-5 py-3 border-t border-theme-border flex items-center justify-between">
          <p class="text-[10px] text-theme-text-muted">Showing {{ filteredPatients().length }} of {{ state.patients().length }} patients</p>
          <div class="flex items-center gap-1">
            <button class="w-7 h-7 flex items-center justify-center rounded-lg bg-theme-hover text-theme-text-muted hover:text-theme-text-main text-xs cursor-pointer clickable-scale">‹</button>
            <button class="w-7 h-7 flex items-center justify-center rounded-lg bg-theme-text-main text-theme-bg text-xs font-medium cursor-pointer clickable-scale">1</button>
            <button class="w-7 h-7 flex items-center justify-center rounded-lg bg-theme-hover text-theme-text-muted hover:text-theme-text-main text-xs cursor-pointer clickable-scale">›</button>
          </div>
        </div>
      </div>

    </div>
  `
})
export class PatientsComponent {
  protected readonly state = inject(ClinicService);
  protected readonly searchFilter = signal('');
  protected readonly statusFilter = signal<'All' | 'Active' | 'Critical' | 'Inactive'>('All');

  protected readonly filteredPatients = computed(() => {
    let patients = this.state.patients();
    const search = this.searchFilter().toLowerCase();
    const status = this.statusFilter();

    if (search) {
      patients = patients.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.condition.toLowerCase().includes(search) ||
        p.phone.includes(search)
      );
    }

    if (status !== 'All') {
      patients = patients.filter(p => p.status === status);
    }

    return patients;
  });

  protected getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
}
