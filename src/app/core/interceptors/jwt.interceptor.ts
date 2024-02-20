import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  if (authService.isSignedIn) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authService.jwt}`,
      },
    });
  }

  return next(req);
};
