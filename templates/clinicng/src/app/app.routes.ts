import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard').then(m => m.DashboardComponent)
  },
  {
    path: 'patients',
    loadComponent: () => import('./features/patients').then(m => m.PatientsComponent)
  },
  {
    path: 'appointments',
    loadComponent: () => import('./features/appointments').then(m => m.AppointmentsComponent)
  }
];
