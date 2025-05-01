import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export const adminGuard: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      const isAdmin = user?.role === UserRole.SYSTEM_ADMIN;

      if (isAdmin) {
        return true;
      }

      return router.createUrlTree(['/login']);
    })
  );
};