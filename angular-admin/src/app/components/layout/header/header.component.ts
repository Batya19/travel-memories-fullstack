import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

// PrimeNG Components (imported in the template)
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    MenuModule,
    AvatarModule,
    OverlayPanelModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush, // Using OnPush for better performance
})
export class HeaderComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  // Signals for managing state
  pageTitle = signal<string>('Dashboard');
  user = signal<User | null>(null);
  userName = computed(() => this.user() ? `${this.user()!.firstName} ${this.user()!.lastName}` : 'Guest');

  // Sidebar state (using a signal)
  isSidebarCollapsed = signal<boolean>(false);

  // Menu items (if you decide to use p-menu later)
  menuItems: MenuItem[] = [
    { label: 'Profile', icon: 'pi pi-user', routerLink: ['/profile'] },
    { separator: true },
    { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logout() },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute // Inject ActivatedRoute
  ) {
    // Effect to update page title based on route changes
    effect(() => {
      this.router.events.pipe(takeUntil(this.destroy$)).subscribe(event => {
        if (event instanceof NavigationEnd) {
          let currentRoute = this.route.root;
          while (currentRoute.firstChild) {
            currentRoute = currentRoute.firstChild;
          }
          this.pageTitle.set(this.getTitleFromRoute(currentRoute));
        }
      });
    });

    // Effect to subscribe to the current user
    effect(() => {
      this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(currentUser => {
        this.user.set(currentUser);
      });
    });
  }

  ngOnInit(): void {
    // Initialization logic here if needed
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getTitleFromRoute(route: ActivatedRoute): string {
    if (route.snapshot.data['title']) {
      return route.snapshot.data['title'];
    }
    const primaryChildRoute = route.firstChild;
    if (primaryChildRoute?.snapshot?.url?.[0]?.path) {
      const segment = primaryChildRoute.snapshot.url[0].path;
      return segment.charAt(0).toUpperCase() + segment.slice(1);
    }
    return 'Dashboard';
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(value => !value);
    document.body.classList.toggle('sidebar-collapsed', this.isSidebarCollapsed());
  }

  logout(): void {
    this.authService.logout();
  }
}