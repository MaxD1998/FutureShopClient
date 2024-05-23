import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const unauthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  return authService.user$.pipe(
    take(1),
    map(user => !user),
  );
};
