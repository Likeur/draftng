import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard').then(m => m.DashboardComponent)
  },
  {
    path: 'projects',
    loadComponent: () => import('./features/projects/projects').then(m => m.ProjectsComponent),
    children: [
      {
        path: 'timeline',
        loadComponent: () => import('./features/projects/timeline').then(m => m.TimelineComponent)
      },
      {
        path: 'list',
        loadComponent: () => import('./features/projects/list').then(m => m.ListComponent)
      },
      {
        path: '',
        redirectTo: 'timeline',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'calendar',
    loadComponent: () => import('./features/calendar').then(m => m.CalendarComponent)
  },
  {
    path: 'employee',
    loadComponent: () => import('./features/employee').then(m => m.EmployeeComponent)
  },
  {
    path: 'team',
    loadComponent: () => import('./features/team').then(m => m.TeamComponent)
  },
  {
    path: 'inbox',
    loadComponent: () => import('./features/inbox').then(m => m.InboxComponent)
  },
  {
    path: 'todos',
    loadComponent: () => import('./features/todos').then(m => m.TodosComponent)
  },
  {
    path: '',
    redirectTo: 'projects',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'projects'
  }
];
