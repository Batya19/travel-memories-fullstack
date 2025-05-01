// import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, signal, computed, effect } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
// import { MenuItem } from 'primeng/api';
// import { Subject, takeUntil } from 'rxjs';

// // PrimeNG Components (imported in the template)
// import { ButtonModule } from 'primeng/button';
// import { MenuModule } from 'primeng/menu';
// import { AvatarModule } from 'primeng/avatar';
// import { OverlayPanelModule } from 'primeng/overlaypanel';
// import { AuthService } from '../../../core/services/auth.service';
// import { User } from '../../../core/models/user.model';

// @Component({
//   selector: 'app-header',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ButtonModule,
//     MenuModule,
//     AvatarModule,
//     OverlayPanelModule,
//   ],
//   templateUrl: './header.component.html',
//   styleUrl: './header.component.scss',
//   changeDetection: ChangeDetectionStrategy.OnPush, // Using OnPush for better performance
// })
// export class HeaderComponent implements OnInit, OnDestroy {
//   private readonly destroy$ = new Subject<void>();

//   // Signals for managing state
//   pageTitle = signal<string>('Dashboard');
//   user = signal<User | null>(null);
//   userName = computed(() => this.user() ? `${this.user()!.firstName} ${this.user()!.lastName}` : 'Guest');

//   // Sidebar state (using a signal)
//   isSidebarCollapsed = signal<boolean>(false);

//   // Menu items (if you decide to use p-menu later)
//   menuItems: MenuItem[] = [
//     { label: 'Profile', icon: 'pi pi-user', routerLink: ['/profile'] },
//     { separator: true },
//     { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logout() },
//   ];

//   constructor(
//     private authService: AuthService,
//     private router: Router,
//     private route: ActivatedRoute // Inject ActivatedRoute
//   ) {
//     // Effect to update page title based on route changes
//     effect(() => {
//       this.router.events.pipe(takeUntil(this.destroy$)).subscribe(event => {
//         if (event instanceof NavigationEnd) {
//           let currentRoute = this.route.root;
//           while (currentRoute.firstChild) {
//             currentRoute = currentRoute.firstChild;
//           }
//           this.pageTitle.set(this.getTitleFromRoute(currentRoute));
//         }
//       });
//     });

//     // Effect to subscribe to the current user
//     effect(() => {
//       this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(currentUser => {
//         this.user.set(currentUser);
//       });
//     });
//   }

//   ngOnInit(): void {
//     // Initialization logic here if needed
//   }

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }

//   getTitleFromRoute(route: ActivatedRoute): string {
//     if (route.snapshot.data['title']) {
//       return route.snapshot.data['title'];
//     }
//     const primaryChildRoute = route.firstChild;
//     if (primaryChildRoute?.snapshot?.url?.[0]?.path) {
//       const segment = primaryChildRoute.snapshot.url[0].path;
//       return segment.charAt(0).toUpperCase() + segment.slice(1);
//     }
//     return 'Dashboard';
//   }

//   toggleSidebar(): void {
//     this.isSidebarCollapsed.update(value => !value);
//     document.body.classList.toggle('sidebar-collapsed', this.isSidebarCollapsed());
//   }

//   logout(): void {
//     this.authService.logout();
//   }
// }

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