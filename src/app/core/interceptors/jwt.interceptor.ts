import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap, take } from 'rxjs';
import { UserService } from '../services/user.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(UserService);

  return from(
    authService.user$.pipe(
      take(1),
      switchMap(user => {
        if (user) {
          req = req.clone({
            setHeaders: {
              Authorization: `Bearer ${user.token}`,
            },
          });
        }

        return next(req);
      }),
    ),
  );
};
