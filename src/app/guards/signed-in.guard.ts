import { inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, first } from 'rxjs';

export const signedInGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(AuthService);

  return auth.isLoggedIn$.pipe(
    first(),
    map((isLoggedIn) => {
      if (!isLoggedIn) {
        return router.createUrlTree(['']);
      }
      return true;
    })
  );
};
