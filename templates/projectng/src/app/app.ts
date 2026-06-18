import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './shared/components/sidebar';
import { TopbarComponent } from './shared/components/topbar';
import { DashboardComponent } from './features/dashboard';
import { ProjectsComponent } from './features/projects/projects';
import { CalendarComponent } from './features/calendar';
import { EmployeeComponent } from './features/employee';
import { TeamComponent } from './features/team';
import { InboxComponent } from './features/inbox';
import { TodosComponent } from './features/todos';

interface Task {
  id: number;
  title: string;
  dateRange: string;
  priority: 'High' | 'Medium' | 'Low';
  theme: 'orange' | 'purple' | 'pink' | 'green' | 'blue';
  gridColumn: string;
  status: 'Backlog' | 'Todo' | 'In Progress' | 'Done';
  assignees: string[];
}

@Component({
  selector: 'app-root',
  imports: [
    CommonModule, 
    SidebarComponent, 
    TopbarComponent, 
    DashboardComponent, 
    ProjectsComponent,
    CalendarComponent,
    EmployeeComponent,
    TeamComponent,
    InboxComponent,
    TodosComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly isDark = signal(true); // Default to Dark mode to look premium like Linear
  protected readonly currentTheme = signal<'dark' | 'light' | 'system'>('dark');
  protected readonly activeNav = signal('Projects');
  protected readonly searchQuery = signal('');
  protected readonly isSidebarCollapsed = signal(false);

  constructor() {
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

  protected selectTheme(theme: any): void {
    const val = theme as 'dark' | 'light' | 'system';
    this.currentTheme.set(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', val);
    }
    this.applyTheme(val);
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

  // Global shared state for projects
  protected readonly tasks = signal<Task[]>([
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

  protected toggleTheme(): void {
    const current = this.currentTheme();
    const nextTheme = current === 'dark' ? 'light' : 'dark';
    this.selectTheme(nextTheme);
  }

  protected toggleSidebar(): void {
    this.isSidebarCollapsed.update(c => !c);
  }

  protected handleTaskDelete(id: number): void {
    this.tasks.update(curr => curr.filter(t => t.id !== id));
  }

  protected handleTaskCreated(data: {
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
}
