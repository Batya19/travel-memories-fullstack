import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authGuard: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      const isAuth = !!user;

      if (isAuth) {
        return true;
      }

      return router.createUrlTree(['/login']);
    })
  );
};