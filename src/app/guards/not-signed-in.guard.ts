import { Router, type CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { first, map } from 'rxjs';

export const notSignedInGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(AuthService);

  return auth.isLoggedIn$.pipe(
    first(),
    map((isLoggedIn) => {
      if (isLoggedIn) {
        return router.createUrlTree(['dashboard']);
      }
      return true;
    })
  );
};
