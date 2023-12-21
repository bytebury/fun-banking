import { Router, type CanActivateFn } from '@angular/router';
import { CustomerAuthService } from '../services/customer-auth.service';
import { inject } from '@angular/core';
import { first, map } from 'rxjs';

export const customerGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(CustomerAuthService);

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
