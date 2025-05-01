import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MenubarModule,
    ButtonModule,
    AvatarModule,
    MenuModule
  ],
  template: `
    <div class="header">
      <div class="logo-container">
        <img src="assets/logo.svg" alt="TravelMemories Logo" class="logo" />
        <span class="app-name">TravelMemories Admin</span>
      </div>
      
      <div class="right-menu">
        <div class="user-info" *ngIf="user">
          <p-avatar 
            [label]="getUserInitials()" 
            shape="circle" 
            [style]="{ 'background-color': '#4caf50', color: '#ffffff' }"
            (click)="userMenu.toggle($event)"
          ></p-avatar>
          <span class="user-name">{{ user.firstName }} {{ user.lastName }}</span>
        </div>
        
        <p-menu #userMenu [popup]="true" [model]="userMenuItems"></p-menu>
      </div>
    </div>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 1.5rem;
      background-color: #ffffff;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .logo-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .logo {
      height: 40px;
    }
    
    .app-name {
      font-size: 1.25rem;
      font-weight: 600;
      color: #333333;
    }
    
    .right-menu {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
    }
    
    .user-name {
      font-weight: 500;
      
      @media (max-width: 768px) {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
  user: any;
  
  userMenuItems: MenuItem[] = [
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => {
        // Profile page logic (if needed)
      }
    },
    {
      separator: true
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => {
        this.authService.logout();
      }
    }
  ];
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.user = this.authService.currentUserValue;
  }
  
  getUserInitials(): string {
    if (this.user) {
      return `${this.user.firstName.charAt(0)}${this.user.lastName.charAt(0)}`;
    }
    return '';
  }
}