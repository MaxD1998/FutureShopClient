import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { map, take } from 'rxjs';
import { UserService } from '../services/user.service';

export const unauthGuard: CanActivateFn = (route, state) => {
  const authService = inject(UserService);

  return authService.user$.pipe(
    take(1),
    map(user => !user),
  );
};
