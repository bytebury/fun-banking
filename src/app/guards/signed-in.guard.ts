import { inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';
import { UserAuthenticationService } from '../services/user-authentication.service';

export const signedInGuard: CanActivateFn = (route) => {
  const userAuth = inject(UserAuthenticationService);
  const router = inject(Router);

  if (userAuth.isLoggedIn()) {
    return true;
  } else {
    return router.parseUrl('');
  }
};
