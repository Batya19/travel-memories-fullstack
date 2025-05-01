import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PanelMenuModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: '/admin/dashboard'
    },
    {
      label: 'Statistics',
      icon: 'pi pi-chart-bar',
      routerLink: '/admin/statistics'
    },
    {
      label: 'User Management',
      icon: 'pi pi-users',
      routerLink: '/admin/users'
    },
    {
      label: 'System Settings',
      icon: 'pi pi-cog',
      routerLink: '/admin/settings'
    }
  ];

  constructor(private router: Router) { }
}