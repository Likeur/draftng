import { Injectable, signal, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

export interface Task {
  id: number;
  title: string;
  dateRange: string;
  priority: 'High' | 'Medium' | 'Low';
  theme: 'orange' | 'purple' | 'pink' | 'green' | 'blue';
  gridColumn: string;
  status: 'Backlog' | 'Todo' | 'In Progress' | 'Done';
  assignees: string[];
}

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  public readonly isDark = signal(true);
  public readonly currentTheme = signal<'dark' | 'light' | 'system'>('dark');
  public readonly searchQuery = signal('');
  public readonly isSidebarCollapsed = signal(false);
  public readonly isCollapsed = this.isSidebarCollapsed;
  public readonly currentUrl = signal<string>('');
  
  public readonly tasks = signal<Task[]>([
    {
      id: 101,
      title: 'Design Tokens Refactoring',
      dateRange: 'Mon 15 - Wed 17',
      priority: 'High',
      theme: 'purple',
      gridColumn: '1 / 4',
      status: 'In Progress',
      assignees: ['LN', 'DK']
    },
    {
      id: 102,
      title: 'Core API Auth integrations',
      dateRange: 'Tue 16 - Fri 19',
      priority: 'Medium',
      theme: 'blue',
      gridColumn: '2 / 6',
      status: 'Todo',
      assignees: ['SU', 'LN']
    },
    {
      id: 103,
      title: 'Gantt Timeline Engine',
      dateRange: 'Wed 17 - Sun 21',
      priority: 'High',
      theme: 'green',
      gridColumn: '3 / 8',
      status: 'In Progress',
      assignees: ['DK', 'AN', 'SU']
    },
    {
      id: 104,
      title: 'System Migration to Angular 22',
      dateRange: 'Thu 18 - Sat 20',
      priority: 'Low',
      theme: 'orange',
      gridColumn: '4 / 7',
      status: 'Backlog',
      assignees: ['AN']
    },
    {
      id: 105,
      title: 'E2E Integration Testing Pipeline',
      dateRange: 'Fri 19 - Sun 21',
      priority: 'Medium',
      theme: 'pink',
      gridColumn: '5 / 8',
      status: 'Todo',
      assignees: ['SU', 'DK']
    }
  ]);

  constructor() {
    const router = inject(Router);
    this.currentUrl.set(router.url);
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.set(event.urlAfterRedirects);
      }
    });

    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | 'system' || 'dark';
      this.currentTheme.set(savedTheme);
      this.applyTheme(savedTheme);

      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (this.currentTheme() === 'system') {
          this.isDark.set(e.matches);
        }
      });

      // Default sidebar closed/collapsed on mobile screens
      const isMobile = window.innerWidth < 768;
      this.isSidebarCollapsed.set(isMobile);
    }
  }

  public selectTheme(theme: 'dark' | 'light' | 'system'): void {
    this.currentTheme.set(theme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
    this.applyTheme(theme);
  }

  public toggleTheme(): void {
    const current = this.currentTheme();
    const nextTheme = current === 'dark' ? 'light' : 'dark';
    this.selectTheme(nextTheme);
  }

  public toggleSidebar(): void {
    this.isSidebarCollapsed.update(c => !c);
  }

  public setSidebarCollapsed(collapsed: boolean): void {
    this.isSidebarCollapsed.set(collapsed);
  }

  public handleTaskDelete(id: number): void {
    this.tasks.update(curr => curr.filter(t => t.id !== id));
  }

  public handleTaskCreated(data: {
    title: string;
    priority: 'High' | 'Medium' | 'Low';
    startDate: string;
    endDate: string;
    theme: 'orange' | 'purple' | 'pink' | 'green' | 'blue';
  }): void {
    const dateToColMap: Record<string, number> = {
      'Mon 15': 1,
      'Tue 16': 2,
      'Wed 17': 3,
      'Thu 18': 4,
      'Fri 19': 5,
      'Sat 20': 6,
      'Sun 21': 7
    };

    const startIdx = dateToColMap[data.startDate] || 1;
    const endIdx = (dateToColMap[data.endDate] || 3) + 1;

    const newTask: Task = {
      id: Date.now(),
      title: data.title,
      dateRange: `${data.startDate} - ${data.endDate}`,
      priority: data.priority,
      theme: data.theme,
      gridColumn: `${startIdx} / ${endIdx}`,
      status: 'Todo',
      assignees: ['LN']
    };

    this.tasks.update(curr => [...curr, newTask]);
  }

  private applyTheme(theme: 'dark' | 'light' | 'system'): void {
    if (theme === 'system') {
      if (typeof window !== 'undefined') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.isDark.set(prefersDark);
      }
    } else {
      this.isDark.set(theme === 'dark');
    }
  }
}
