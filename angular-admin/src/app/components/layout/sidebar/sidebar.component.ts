import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <img src="assets/logo.png" alt="TravelMemories Logo">
          <span class="logo-text">TravelMemories</span>
        </div>
      </div>
      
      <div class="sidebar-content">
        <ul class="sidebar-menu">
          <li class="sidebar-item" routerLinkActive="active">
            <a routerLink="/dashboard">
              <i class="pi pi-home"></i>
              <span>Dashboard</span>
            </a>
          </li>
          <li class="sidebar-item" routerLinkActive="active">
            <a routerLink="/users">
              <i class="pi pi-users"></i>
              <span>User Management</span>
            </a>
          </li>
          <li class="sidebar-item" routerLinkActive="active">
            <a routerLink="/statistics">
              <i class="pi pi-chart-bar"></i>
              <span>Statistics</span>
            </a>
          </li>
        </ul>
      </div>
      
      <div class="sidebar-footer">
        <div class="app-version">
          <p>Version 1.0.0</p>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      width: 250px;
      height: 100vh;
      background-color: var(--surface-overlay);
      color: var(--text-color);
      z-index: 999;
      display: flex;
      flex-direction: column;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      transition: width 0.3s, transform 0.3s;
    }
    
    .sidebar-header {
      height: 4rem;
      display: flex;
      align-items: center;
      padding: 0 1.25rem;
      border-bottom: 1px solid var(--surface-border);
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .logo img {
      height: 2rem;
      width: auto;
    }
    
    .logo-text {
      font-size: 1.25rem;
      font-weight: 600;
    }
    
    .sidebar-content {
      flex: 1;
      overflow-y: auto;
      padding: 1.25rem 0;
    }
    
    .sidebar-menu {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .sidebar-item {
      margin-bottom: 0.25rem;
    }
    
    .sidebar-item a {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.25rem;
      color: var(--text-color);
      text-decoration: none;
      transition: background-color 0.2s;
      border-radius: 0;
    }
    
    .sidebar-item:hover a {
      background-color: var(--surface-hover);
    }
    
    .sidebar-item.active a {
      background-color: var(--primary-color);
      color: var(--primary-color-text);
    }
    
    .sidebar-item i {
      font-size: 1.25rem;
      width: 1.5rem;
      text-align: center;
    }
    
    .sidebar-footer {
      padding: 1rem 1.25rem;
      border-top: 1px solid var(--surface-border);
    }
    
    .app-version {
      font-size: 0.75rem;
      color: var(--text-color-secondary);
      text-align: center;
    }
    
    .app-version p {
      margin: 0;
    }
    
    /* Responsive sidebar */
    @media screen and (max-width: 992px) {
      .sidebar {
        transform: translateX(-100%);
      }
      
      body.sidebar-active .sidebar {
        transform: translateX(0);
      }
    }
  `]
})
export class SidebarComponent {}