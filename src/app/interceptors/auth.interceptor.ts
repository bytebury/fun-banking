import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = inject(AuthService).getAuthToken();

  if (authToken) {
    req = req.clone({
      setHeaders: {
        Authorization: authToken,
      },
    });
  }

  return next(req);
};
