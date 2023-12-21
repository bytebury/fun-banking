import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { first, map } from 'rxjs';
import { CustomerAuthService } from '../services/customer-auth.service';

export const noCustomerGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(CustomerAuthService);

  return auth.isLoggedIn$.pipe(
    first(),
    map((isLoggedIn) => {
      if (isLoggedIn) {
        return router.createUrlTree(['/', 'customers', 'welcome']);
      }
      return true;
    })
  );
};
