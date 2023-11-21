import { Router, type CanActivateFn } from '@angular/router';
import { UserAuthenticationService } from '../services/user-authentication.service';
import { inject } from '@angular/core';

export const notSignedInGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(UserAuthenticationService);

  if (auth.isLoggedIn()) {
    return router.parseUrl('dashboard');
  }

  return true;
};
