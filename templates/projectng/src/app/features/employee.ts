import { Component, inject, signal, computed } from '@angular/core';
import { WorkspaceService } from '../shared/services/workspace.service';

interface Employee {
  id: number;
  name: string;
  role: string;
  email: string;
  team: string;
  status: 'Active' | 'On Leave' | 'Offsite';
  tasksCount: number;
  avatarGrad: string;
  initials: string;
}

@Component({
  selector: 'app-employee',
  imports: [],
  template: `
    <div class="space-y-6 animate-blur-slide font-sans">
      
      <!-- Table Actions Header -->
      <section class="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div>
          <h2 class="font-display font-extrabold text-md tracking-tight select-none">
            Employee Directory
          </h2>
          <p class="text-xs text-zinc-400 mt-1">Manage workspace members, workloads, and roles.</p>
        </div>

        <button 
          (click)="addEmployee()"
          class="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-950 font-bold text-xs transition-colors cursor-pointer select-none clickable-scale">
          Add Employee
        </button>
      </section>

      <!-- Employees Grid/Table (Flat, shadow-free, subtle dark borders) -->
      <section [class]="isDark() ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-zinc-200'" class="border rounded-2xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr [class]="isDark() ? 'border-zinc-800 bg-zinc-900/20 text-zinc-400' : 'border-zinc-200 bg-zinc-50/50 text-zinc-500'" class="border-b font-display font-bold text-[10px]">
                <th class="p-4">Member</th>
                <th class="p-4">Role</th>
                <th class="p-4">Team</th>
                <th class="p-4">Active Tasks</th>
                <th class="p-4">Status</th>
                <th class="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y" [class]="isDark() ? 'divide-zinc-850' : 'divide-zinc-100'">
              @if (isLoading()) {
                @for (dummy of dummyArray; track $index) {
                  <tr class="animate-pulse">
                    <!-- Member shimmer -->
                    <td class="p-4 flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0"></div>
                      <div class="space-y-1.5 w-24">
                        <div class="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-full"></div>
                        <div class="h-2 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3"></div>
                      </div>
                    </td>
                    <!-- Role shimmer -->
                    <td class="p-4"><div class="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-16"></div></td>
                    <!-- Team shimmer -->
                    <td class="p-4"><div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-12"></div></td>
                    <!-- Active Tasks shimmer -->
                    <td class="p-4"><div class="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-10"></div></td>
                    <!-- Status shimmer -->
                    <td class="p-4"><div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-14"></div></td>
                    <!-- Actions shimmer -->
                    <td class="p-4 text-right"><div class="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-12 ml-auto"></div></td>
                  </tr>
                }
              } @else {
                @for (emp of paginatedEmployees(); track emp.id) {
                  <tr class="hover:bg-zinc-100/10 dark:hover:bg-zinc-800/10 transition-colors">
                    <!-- Name Card (Dynamic gradient backdrop with initials instead of images) -->
                    <td class="p-4 flex items-center gap-3">
                      <div [class]="emp.avatarGrad" class="w-8 h-8 rounded-full flex items-center justify-center font-display font-extrabold text-[9px] text-zinc-950 shrink-0 select-none">
                        {{ emp.initials }}
                      </div>
                      <div>
                        <p class="font-bold text-zinc-800 dark:text-zinc-50">{{ emp.name }}</p>
                        <p class="text-[10px] text-zinc-400 font-semibold">{{ emp.email }}</p>
                      </div>
                    </td>
                    
                    <!-- Role -->
                    <td class="p-4 font-semibold text-zinc-550 dark:text-zinc-400">{{ emp.role }}</td>
                    
                    <!-- Team -->
                    <td class="p-4">
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-350">
                        {{ emp.team }}
                      </span>
                    </td>
                    
                    <!-- Active tasks load -->
                    <td class="p-4 font-bold text-teal-500">{{ emp.tasksCount }} tasks</td>
                    
                    <!-- Status -->
                    <td class="p-4">
                      <span 
                        [class]="emp.status === 'Active' ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' : (emp.status === 'On Leave' ? 'text-red-500 bg-red-500/10 border-red-500/20' : 'text-zinc-500 bg-zinc-550/10 border-zinc-500/20')"
                        class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[9px] font-bold cursor-pointer select-none clickable-scale"
                        (click)="toggleStatus(emp.id)">
                        <span [class]="emp.status === 'Active' ? 'bg-emerald-500' : (emp.status === 'On Leave' ? 'bg-red-500' : 'bg-zinc-500')" class="w-1.5 h-1.5 rounded-full"></span>
                        {{ emp.status }}
                      </span>
                    </td>
                    
                    <!-- Action buttons -->
                    <td class="p-4 text-right space-x-1.5">
                      <button 
                        (click)="assignTask(emp.id)" 
                        [class]="isDark() ? 'bg-zinc-800 border-zinc-700 text-zinc-350 hover:bg-zinc-700' : 'bg-zinc-100 border-zinc-200 text-zinc-850 hover:bg-zinc-200'"
                        class="px-2.5 py-1.5 rounded-lg border text-[10px] font-bold cursor-pointer transition-colors clickable-scale">
                        Assign
                      </button>
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>

        <!-- Pagination Controls Footer (Flat design, scale clicks) -->
        <div class="px-6 py-4 flex items-center justify-between border-t text-xs font-semibold" [class]="isDark() ? 'border-zinc-800 bg-zinc-900/20' : 'border-zinc-200 bg-zinc-50/50'">
          <button 
            [disabled]="currentPage() === 1"
            (click)="prevPage()"
            [class]="isDark() ? 'border-zinc-800 text-zinc-400 hover:bg-zinc-850 disabled:opacity-40' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-100 disabled:opacity-40'"
            class="px-3 py-1.5 rounded-xl border cursor-pointer select-none transition-colors clickable-scale">
            Previous
          </button>
          
          <span class="text-zinc-500">
            Page <span class="text-teal-500 font-extrabold">{{ currentPage() }}</span> of <span class="font-extrabold">{{ totalPages() }}</span>
          </span>

          <button 
            [disabled]="currentPage() === totalPages()"
            (click)="nextPage()"
            [class]="isDark() ? 'border-zinc-800 text-zinc-400 hover:bg-zinc-850 disabled:opacity-40' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-100 disabled:opacity-40'"
            class="px-3 py-1.5 rounded-xl border cursor-pointer select-none transition-colors clickable-scale">
            Next
          </button>
        </div>

      </section>

    </div>
  `
})
export class EmployeeComponent {
  private readonly state = inject(WorkspaceService);
  protected readonly isDark = this.state.isDark;

  protected readonly isLoading = signal(true);
  protected readonly dummyArray = Array.from({ length: 5 });
  constructor() {
    setTimeout(() => this.isLoading.set(false), 600);
  }

  // Pagination parameters
  protected readonly currentPage = signal(1);
  protected readonly pageSize = 4;

  // List of 11 mock employees with customized initials and gradients
  protected readonly employees = signal<Employee[]>([
    {
      id: 1,
      name: 'Lisa Nguyen',
      role: 'Staff Lead Frontend',
      email: 'lisa.n@projectng.org',
      team: 'Core Platform',
      status: 'Active',
      tasksCount: 3,
      avatarGrad: 'avatar-grad-1',
      initials: 'LN'
    },
    {
      id: 2,
      name: 'Simba Developer',
      role: 'Principal Engineer',
      email: 'simba.dev@projectng.org',
      team: 'Design Systems',
      status: 'Active',
      tasksCount: 4,
      avatarGrad: 'avatar-grad-2',
      initials: 'SD'
    },
    {
      id: 3,
      name: 'Alexandre Naudin',
      role: 'DevOps Architect',
      email: 'alex.n@projectng.org',
      team: 'Infrastructure',
      status: 'Offsite',
      tasksCount: 2,
      avatarGrad: 'avatar-grad-3',
      initials: 'AN'
    },
    {
      id: 4,
      name: 'Daniel Kojo',
      role: 'Backend Developer',
      email: 'daniel.k@projectng.org',
      team: 'Integrations API',
      status: 'On Leave',
      tasksCount: 0,
      avatarGrad: 'avatar-grad-4',
      initials: 'DK'
    },
    {
      id: 5,
      name: 'Marcus Brody',
      role: 'Senior System Eng',
      email: 'marcus.b@projectng.org',
      team: 'Infrastructure',
      status: 'Active',
      tasksCount: 3,
      avatarGrad: 'avatar-grad-5',
      initials: 'MB'
    },
    {
      id: 6,
      name: 'Elena Rostova',
      role: 'UI Designer',
      email: 'elena.r@projectng.org',
      team: 'Design Systems',
      status: 'Active',
      tasksCount: 2,
      avatarGrad: 'avatar-grad-1',
      initials: 'ER'
    },
    {
      id: 7,
      name: 'Yuki Tanaka',
      role: 'QA Automation',
      email: 'yuki.t@projectng.org',
      team: 'Core Platform',
      status: 'Active',
      tasksCount: 1,
      avatarGrad: 'avatar-grad-2',
      initials: 'YT'
    },
    {
      id: 8,
      name: 'Clara Oswald',
      role: 'Product Owner',
      email: 'clara.o@projectng.org',
      team: 'Core Platform',
      status: 'Active',
      tasksCount: 0,
      avatarGrad: 'avatar-grad-3',
      initials: 'CO'
    },
    {
      id: 9,
      name: 'Bruce Wayne',
      role: 'Security Analyst',
      email: 'bruce.w@projectng.org',
      team: 'Infrastructure',
      status: 'Offsite',
      tasksCount: 5,
      avatarGrad: 'avatar-grad-4',
      initials: 'BW'
    },
    {
      id: 10,
      name: 'Diana Prince',
      role: 'Senior API Developer',
      email: 'diana.p@projectng.org',
      team: 'Integrations API',
      status: 'Active',
      tasksCount: 3,
      avatarGrad: 'avatar-grad-5',
      initials: 'DP'
    },
    {
      id: 11,
      name: 'Clark Kent',
      role: 'Copywriter Tech',
      email: 'clark.k@projectng.org',
      team: 'Design Systems',
      status: 'Active',
      tasksCount: 1,
      avatarGrad: 'avatar-grad-1',
      initials: 'CK'
    }
  ]);

  // Pagination computed calculations
  protected readonly totalPages = computed(() => {
    return Math.ceil(this.employees().length / this.pageSize);
  });

  protected readonly paginatedEmployees = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.employees().slice(start, start + this.pageSize);
  });

  protected prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  protected nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  protected toggleStatus(id: number): void {
    this.employees.update(list => 
      list.map(emp => {
        if (emp.id === id) {
          const nextStatusMap: Record<string, 'Active' | 'On Leave' | 'Offsite'> = {
            'Active': 'On Leave',
            'On Leave': 'Offsite',
            'Offsite': 'Active'
          };
          return { ...emp, status: nextStatusMap[emp.status] };
        }
        return emp;
      })
    );
  }

  protected assignTask(id: number): void {
    const emp = this.employees().find(e => e.id === id);
    if (!emp) return;
    
    this.employees.update(list => 
      list.map(e => e.id === id ? { ...e, tasksCount: e.tasksCount + 1 } : e)
    );
    alert(`Assigned task successfully to ${emp.name}! Active tasks count updated.`);
  }

  protected addEmployee(): void {
    alert('Create Employee: Enter details to register new members in the directory.');
  }
}
