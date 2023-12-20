import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { first, map } from 'rxjs';
import { UserService } from '../services/user.service';
import { UserRole } from '../models/user.model';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const user = inject(UserService);

  return user.currentUser$.pipe(
    first(),
    map((currentUser) => {
      if (currentUser.role === UserRole.Admin) {
        return true;
      }
      return router.createUrlTree(['']);
    })
  );
};
