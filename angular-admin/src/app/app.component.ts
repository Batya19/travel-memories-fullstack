import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/layout/header/header.component';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AuthService } from './core/services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent, RouterModule, CommonModule],
  providers: [
    MessageService,
    ConfirmationService
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin');
  }
}