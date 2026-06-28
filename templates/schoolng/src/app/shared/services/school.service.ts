import { Injectable, signal, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

export interface ActivityLog {
  id: number;
  message: string;
  time: string;
  category: 'academic' | 'system' | 'administrative';
}

export interface SchoolEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'academic' | 'sports' | 'holiday';
}

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  public readonly searchQuery = signal('');
  public readonly isSidebarCollapsed = signal(false);
  public readonly isCollapsed = this.isSidebarCollapsed;
  public readonly currentUrl = signal<string>('');

  // Dashboard Stats Mock Data
  public readonly totalStudents = signal({ value: '1,240', change: '+4.2%' });
  public readonly activeClasses = signal({ value: '48', capacity: '100%' });
  public readonly teachersOnDuty = signal({ value: '32 / 36', roster: 'Daily Roster' });
  public readonly attendanceRate = signal({ value: '98.4%', status: 'High Engagement' });

  // Recent Academic Alerts / Activities
  public readonly activityLogs = signal<ActivityLog[]>([
    { id: 1, message: 'Dr. Elizabeth Vance submitted AP Calculus BC Grades', time: '2 minutes ago', category: 'academic' },
    { id: 2, message: 'Biology Lab safety certifications renewed', time: '3 hours ago', category: 'system' },
    { id: 3, message: 'New student registrar batch (Grade 9) uploaded', time: '5 hours ago', category: 'administrative' },
    { id: 4, message: 'Attendance registry closed for morning shift', time: '6 hours ago', category: 'administrative' },
    { id: 5, message: 'Weekly parent newsletter successfully compiled', time: 'Yesterday', category: 'system' }
  ]);

  // Upcoming School Events
  public readonly upcomingEvents = signal<SchoolEvent[]>([
    { id: 101, title: 'Parent-Teacher Conferences', date: 'Jul 02, 2026', time: '04:00 PM', location: 'Main Gymnasium', type: 'academic' },
    { id: 102, title: 'Summer Track & Field Finals', date: 'Jul 05, 2026', time: '09:00 AM', location: 'Stad. Track A', type: 'sports' },
    { id: 103, title: 'Mid-term Board Evaluation Meeting', date: 'Jul 10, 2026', time: '10:30 AM', location: 'Conference Room 2B', type: 'administrative' as any }
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
      // Default sidebar closed/collapsed on mobile screens
      const isMobile = window.innerWidth < 768;
      this.isSidebarCollapsed.set(isMobile);
    }
  }

  public toggleSidebar(): void {
    this.isSidebarCollapsed.update(c => !c);
  }

  public setSidebarCollapsed(collapsed: boolean): void {
    this.isSidebarCollapsed.set(collapsed);
  }
}
