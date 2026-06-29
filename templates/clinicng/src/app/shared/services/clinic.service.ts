import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  phone: string;
  lastVisit: string;
  status: 'Active' | 'Inactive' | 'Critical';
  condition: string;
  avatar: string;
}

export interface Appointment {
  id: number;
  patientName: string;
  doctor: string;
  date: string;
  time: string;
  type: 'Consultation' | 'Follow-up' | 'Emergency' | 'Lab Test';
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'In Progress';
  avatar: string;
}

export interface ActivityLog {
  id: number;
  message: string;
  time: string;
  category: 'medical' | 'system' | 'administrative';
}

@Injectable({
  providedIn: 'root'
})
export class ClinicService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  public readonly isDark = signal(false);
  public readonly currentTheme = signal<'dark' | 'light' | 'system'>('light');
  public readonly searchQuery = signal('');
  public readonly isSidebarCollapsed = signal(true);
  public readonly isCollapsed = this.isSidebarCollapsed;
  public readonly currentUrl = signal<string>('');

  // Dashboard KPIs
  public readonly totalPatients = signal({ value: '2,847', change: '+12.5%' });
  public readonly appointmentsToday = signal({ value: '38', change: '+8.2%' });
  public readonly doctorsOnDuty = signal({ value: '12 / 15', roster: 'Morning Shift' });
  public readonly occupancyRate = signal({ value: '76.3%', status: 'Optimal' });

  // Recent Activity
  public readonly activityLogs = signal<ActivityLog[]>([
    { id: 1, message: 'Dr. Sarah Chen completed surgery for Patient #1042', time: '12 minutes ago', category: 'medical' },
    { id: 2, message: 'Lab results uploaded for blood panel batch #B-2847', time: '1 hour ago', category: 'system' },
    { id: 3, message: 'New patient registration: James Morrison (Cardiology)', time: '2 hours ago', category: 'administrative' },
    { id: 4, message: 'Pharmacy inventory restocked — 42 items updated', time: '3 hours ago', category: 'system' },
    { id: 5, message: 'Dr. Michael Torres rescheduled afternoon appointments', time: '4 hours ago', category: 'administrative' }
  ]);

  // Patients List
  public readonly patients = signal<Patient[]>([
    { id: 1, name: 'Emma Thompson', age: 34, gender: 'Female', phone: '+1 (555) 234-8901', lastVisit: 'Jun 28, 2026', status: 'Active', condition: 'Hypertension', avatar: 'avatar-grad-1' },
    { id: 2, name: 'James Morrison', age: 56, gender: 'Male', phone: '+1 (555) 345-6789', lastVisit: 'Jun 27, 2026', status: 'Critical', condition: 'Cardiac Arrhythmia', avatar: 'avatar-grad-2' },
    { id: 3, name: 'Sofia Rodriguez', age: 28, gender: 'Female', phone: '+1 (555) 456-7890', lastVisit: 'Jun 26, 2026', status: 'Active', condition: 'Prenatal Care', avatar: 'avatar-grad-3' },
    { id: 4, name: 'William Chen', age: 45, gender: 'Male', phone: '+1 (555) 567-8901', lastVisit: 'Jun 25, 2026', status: 'Active', condition: 'Type 2 Diabetes', avatar: 'avatar-grad-4' },
    { id: 5, name: 'Olivia Parker', age: 62, gender: 'Female', phone: '+1 (555) 678-9012', lastVisit: 'Jun 24, 2026', status: 'Inactive', condition: 'Post-Op Recovery', avatar: 'avatar-grad-5' },
    { id: 6, name: 'Daniel Kim', age: 41, gender: 'Male', phone: '+1 (555) 789-0123', lastVisit: 'Jun 23, 2026', status: 'Active', condition: 'Lower Back Pain', avatar: 'avatar-grad-1' },
    { id: 7, name: 'Isabella Martinez', age: 29, gender: 'Female', phone: '+1 (555) 890-1234', lastVisit: 'Jun 22, 2026', status: 'Active', condition: 'Allergic Rhinitis', avatar: 'avatar-grad-2' },
    { id: 8, name: 'Robert Williams', age: 73, gender: 'Male', phone: '+1 (555) 901-2345', lastVisit: 'Jun 21, 2026', status: 'Critical', condition: 'COPD', avatar: 'avatar-grad-3' },
    { id: 9, name: 'Mia Johnson', age: 38, gender: 'Female', phone: '+1 (555) 012-3456', lastVisit: 'Jun 20, 2026', status: 'Active', condition: 'Migraine', avatar: 'avatar-grad-4' },
    { id: 10, name: 'Alexander Brown', age: 50, gender: 'Male', phone: '+1 (555) 123-4567', lastVisit: 'Jun 19, 2026', status: 'Inactive', condition: 'Knee Replacement', avatar: 'avatar-grad-5' }
  ]);

  // Appointments
  public readonly appointments = signal<Appointment[]>([
    // Sunday Jun 29
    { id: 1, patientName: 'Emma Thompson', doctor: 'Dr. Sarah Chen', date: 'Jun 29, 2026', time: '09:00 AM', type: 'Consultation', status: 'Scheduled', avatar: 'avatar-grad-1' },
    { id: 2, patientName: 'James Morrison', doctor: 'Dr. Michael Torres', date: 'Jun 29, 2026', time: '09:00 AM', type: 'Emergency', status: 'In Progress', avatar: 'avatar-grad-2' },
    { id: 3, patientName: 'Sofia Rodriguez', doctor: 'Dr. Lisa Park', date: 'Jun 29, 2026', time: '10:00 AM', type: 'Follow-up', status: 'Scheduled', avatar: 'avatar-grad-3' },
    { id: 4, patientName: 'William Chen', doctor: 'Dr. Sarah Chen', date: 'Jun 29, 2026', time: '10:00 AM', type: 'Lab Test', status: 'Scheduled', avatar: 'avatar-grad-4' },
    { id: 5, patientName: 'Olivia Parker', doctor: 'Dr. James Wright', date: 'Jun 29, 2026', time: '11:00 AM', type: 'Follow-up', status: 'Completed', avatar: 'avatar-grad-5' },
    { id: 6, patientName: 'Daniel Kim', doctor: 'Dr. Michael Torres', date: 'Jun 29, 2026', time: '01:00 PM', type: 'Consultation', status: 'Scheduled', avatar: 'avatar-grad-1' },
    { id: 7, patientName: 'Isabella Martinez', doctor: 'Dr. Lisa Park', date: 'Jun 29, 2026', time: '02:00 PM', type: 'Consultation', status: 'Scheduled', avatar: 'avatar-grad-2' },
    { id: 8, patientName: 'Robert Williams', doctor: 'Dr. James Wright', date: 'Jun 29, 2026', time: '03:00 PM', type: 'Emergency', status: 'Scheduled', avatar: 'avatar-grad-3' },
    { id: 9, patientName: 'Mia Johnson', doctor: 'Dr. Sarah Chen', date: 'Jun 29, 2026', time: '04:00 PM', type: 'Follow-up', status: 'Cancelled', avatar: 'avatar-grad-4' },
    // Monday Jun 30
    { id: 10, patientName: 'Alexander Brown', doctor: 'Dr. Michael Torres', date: 'Jun 30, 2026', time: '08:00 AM', type: 'Consultation', status: 'Scheduled', avatar: 'avatar-grad-5' },
    { id: 11, patientName: 'Liam Carter', doctor: 'Dr. Sarah Chen', date: 'Jun 30, 2026', time: '09:00 AM', type: 'Follow-up', status: 'Scheduled', avatar: 'avatar-grad-1' },
    { id: 12, patientName: 'Grace Lee', doctor: 'Dr. Lisa Park', date: 'Jun 30, 2026', time: '10:00 AM', type: 'Lab Test', status: 'Scheduled', avatar: 'avatar-grad-2' },
    { id: 13, patientName: 'Ethan Davis', doctor: 'Dr. James Wright', date: 'Jun 30, 2026', time: '11:00 AM', type: 'Consultation', status: 'Scheduled', avatar: 'avatar-grad-3' },
    { id: 14, patientName: 'Ava Wilson', doctor: 'Dr. Michael Torres', date: 'Jun 30, 2026', time: '01:00 PM', type: 'Emergency', status: 'In Progress', avatar: 'avatar-grad-4' },
    { id: 15, patientName: 'Noah Garcia', doctor: 'Dr. Sarah Chen', date: 'Jun 30, 2026', time: '03:00 PM', type: 'Follow-up', status: 'Scheduled', avatar: 'avatar-grad-5' },
    // Tuesday Jul 1
    { id: 16, patientName: 'Chloe Adams', doctor: 'Dr. Lisa Park', date: 'Jul 01, 2026', time: '08:00 AM', type: 'Lab Test', status: 'Scheduled', avatar: 'avatar-grad-1' },
    { id: 17, patientName: 'Mason Taylor', doctor: 'Dr. James Wright', date: 'Jul 01, 2026', time: '09:00 AM', type: 'Consultation', status: 'Scheduled', avatar: 'avatar-grad-2' },
    { id: 18, patientName: 'Zoe Mitchell', doctor: 'Dr. Sarah Chen', date: 'Jul 01, 2026', time: '10:00 AM', type: 'Follow-up', status: 'Completed', avatar: 'avatar-grad-3' },
    { id: 19, patientName: 'Lucas White', doctor: 'Dr. Michael Torres', date: 'Jul 01, 2026', time: '11:00 AM', type: 'Emergency', status: 'Scheduled', avatar: 'avatar-grad-4' },
    { id: 20, patientName: 'Harper Nelson', doctor: 'Dr. Lisa Park', date: 'Jul 01, 2026', time: '02:00 PM', type: 'Consultation', status: 'Scheduled', avatar: 'avatar-grad-5' },
    { id: 21, patientName: 'Jack Robinson', doctor: 'Dr. James Wright', date: 'Jul 01, 2026', time: '04:00 PM', type: 'Follow-up', status: 'Scheduled', avatar: 'avatar-grad-1' },
    // Wednesday Jul 2
    { id: 22, patientName: 'Lily Turner', doctor: 'Dr. Sarah Chen', date: 'Jul 02, 2026', time: '08:00 AM', type: 'Consultation', status: 'Scheduled', avatar: 'avatar-grad-2' },
    { id: 23, patientName: 'Benjamin Scott', doctor: 'Dr. Michael Torres', date: 'Jul 02, 2026', time: '09:00 AM', type: 'Lab Test', status: 'Scheduled', avatar: 'avatar-grad-3' },
    { id: 24, patientName: 'Ella Morgan', doctor: 'Dr. Lisa Park', date: 'Jul 02, 2026', time: '10:00 AM', type: 'Follow-up', status: 'Scheduled', avatar: 'avatar-grad-4' },
    { id: 25, patientName: 'Oliver Hayes', doctor: 'Dr. James Wright', date: 'Jul 02, 2026', time: '12:00 PM', type: 'Consultation', status: 'Scheduled', avatar: 'avatar-grad-5' },
    { id: 26, patientName: 'Aria Foster', doctor: 'Dr. Sarah Chen', date: 'Jul 02, 2026', time: '02:00 PM', type: 'Emergency', status: 'In Progress', avatar: 'avatar-grad-1' },
    { id: 27, patientName: 'Henry Brooks', doctor: 'Dr. Michael Torres', date: 'Jul 02, 2026', time: '04:00 PM', type: 'Follow-up', status: 'Completed', avatar: 'avatar-grad-2' },
    // Thursday Jul 3
    { id: 28, patientName: 'Scarlett Reed', doctor: 'Dr. Lisa Park', date: 'Jul 03, 2026', time: '08:00 AM', type: 'Follow-up', status: 'Scheduled', avatar: 'avatar-grad-3' },
    { id: 29, patientName: 'Sebastian Cole', doctor: 'Dr. James Wright', date: 'Jul 03, 2026', time: '09:00 AM', type: 'Consultation', status: 'Scheduled', avatar: 'avatar-grad-4' },
    { id: 30, patientName: 'Victoria Bell', doctor: 'Dr. Sarah Chen', date: 'Jul 03, 2026', time: '11:00 AM', type: 'Lab Test', status: 'Scheduled', avatar: 'avatar-grad-5' },
    { id: 31, patientName: 'Leo Murphy', doctor: 'Dr. Michael Torres', date: 'Jul 03, 2026', time: '01:00 PM', type: 'Emergency', status: 'Scheduled', avatar: 'avatar-grad-1' },
    { id: 32, patientName: 'Nora Cooper', doctor: 'Dr. Lisa Park', date: 'Jul 03, 2026', time: '03:00 PM', type: 'Consultation', status: 'Scheduled', avatar: 'avatar-grad-2' },
    { id: 33, patientName: 'Caleb Rivera', doctor: 'Dr. James Wright', date: 'Jul 03, 2026', time: '05:00 PM', type: 'Follow-up', status: 'Cancelled', avatar: 'avatar-grad-3' },
    // Friday Jul 4
    { id: 34, patientName: 'Penelope Ward', doctor: 'Dr. Sarah Chen', date: 'Jul 04, 2026', time: '09:00 AM', type: 'Consultation', status: 'Scheduled', avatar: 'avatar-grad-4' },
    { id: 35, patientName: 'Elijah Cox', doctor: 'Dr. Michael Torres', date: 'Jul 04, 2026', time: '10:00 AM', type: 'Follow-up', status: 'Scheduled', avatar: 'avatar-grad-5' },
    { id: 36, patientName: 'Layla Hughes', doctor: 'Dr. Lisa Park', date: 'Jul 04, 2026', time: '11:00 AM', type: 'Lab Test', status: 'Scheduled', avatar: 'avatar-grad-1' },
    { id: 37, patientName: 'Gabriel Price', doctor: 'Dr. James Wright', date: 'Jul 04, 2026', time: '01:00 PM', type: 'Emergency', status: 'In Progress', avatar: 'avatar-grad-2' },
    { id: 38, patientName: 'Madison Long', doctor: 'Dr. Sarah Chen', date: 'Jul 04, 2026', time: '03:00 PM', type: 'Consultation', status: 'Completed', avatar: 'avatar-grad-3' },
    // Saturday Jul 5
    { id: 39, patientName: 'Carter Diaz', doctor: 'Dr. Michael Torres', date: 'Jul 05, 2026', time: '09:00 AM', type: 'Follow-up', status: 'Scheduled', avatar: 'avatar-grad-4' },
    { id: 40, patientName: 'Riley Flores', doctor: 'Dr. Lisa Park', date: 'Jul 05, 2026', time: '10:00 AM', type: 'Consultation', status: 'Scheduled', avatar: 'avatar-grad-5' },
    { id: 41, patientName: 'Dylan Ramirez', doctor: 'Dr. James Wright', date: 'Jul 05, 2026', time: '11:00 AM', type: 'Emergency', status: 'Scheduled', avatar: 'avatar-grad-1' },
    { id: 42, patientName: 'Savannah Ortiz', doctor: 'Dr. Sarah Chen', date: 'Jul 05, 2026', time: '01:00 PM', type: 'Lab Test', status: 'Scheduled', avatar: 'avatar-grad-2' }
  ]);

  constructor() {
    const router = inject(Router);
    this.currentUrl.set(router.url);
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.set(event.urlAfterRedirects);
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | 'system' || 'light';
      this.currentTheme.set(savedTheme);
      this.applyTheme(savedTheme);

      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (this.currentTheme() === 'system') {
          this.isDark.set(e.matches);
          this.updateDocumentClass(e.matches);
        }
      });

      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        this.isSidebarCollapsed.set(true);
      } else {
        const savedCollapsed = localStorage.getItem('sidebarCollapsed');
        if (savedCollapsed !== null) {
          this.isSidebarCollapsed.set(savedCollapsed === 'true');
        } else {
          this.isSidebarCollapsed.set(false);
        }
      }

      let lastWidth = window.innerWidth;
      window.addEventListener('resize', () => {
        const currentWidth = window.innerWidth;
        if (currentWidth < 768 && lastWidth >= 768) {
          this.isSidebarCollapsed.set(true);
        }
        lastWidth = currentWidth;
      });

      router.events.subscribe(event => {
        if (event instanceof NavigationEnd && window.innerWidth < 768) {
          this.isSidebarCollapsed.set(true);
        }
      });
    }
  }

  public selectTheme(theme: 'dark' | 'light' | 'system'): void {
    this.currentTheme.set(theme);
    if (isPlatformBrowser(this.platformId)) {
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
    this.isSidebarCollapsed.update(c => {
      const next = !c;
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('sidebarCollapsed', String(next));
      }
      return next;
    });
  }

  public setSidebarCollapsed(collapsed: boolean): void {
    this.isSidebarCollapsed.set(collapsed);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('sidebarCollapsed', String(collapsed));
    }
  }

  private applyTheme(theme: 'dark' | 'light' | 'system'): void {
    let dark = false;
    if (theme === 'system') {
      if (isPlatformBrowser(this.platformId)) {
        dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    } else {
      dark = theme === 'dark';
    }
    this.isDark.set(dark);
    this.updateDocumentClass(dark);
  }

  private updateDocumentClass(dark: boolean): void {
    if (isPlatformBrowser(this.platformId)) {
      if (dark) {
        this.document.documentElement.classList.add('dark');
      } else {
        this.document.documentElement.classList.remove('dark');
      }
    }
  }
}
