import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    canMatch: [authGuard, adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'statistics',
        loadComponent: () => import('./components/statistics/statistics.component').then(m => m.StatisticsComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./components/user-management/user-management.component').then(m => m.UserManagementComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./components/system-settings/system-settings.component').then(m => m.SystemSettingsComponent)
      }
    ]
  },
  {
    path: '',
    redirectTo: 'admin/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'admin/dashboard'
  }
];