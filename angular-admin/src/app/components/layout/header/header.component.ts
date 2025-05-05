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
  imports: [CommonModule, MenubarModule, ButtonModule, AvatarModule, MenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  user: any;

  userMenuItems: MenuItem[] = [
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

  navigateToHome() {
    this.router.navigate(['/dashboard']);
  }
}