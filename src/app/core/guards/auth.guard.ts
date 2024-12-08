import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { map, take } from 'rxjs';
import { UserType } from '../enums/user-type';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(UserService);

  return authService.user$.pipe(
    take(1),
    map(user => {
      if (!user) {
        return false;
      }

      const role = route.data['role'] as UserType;

      if (!role) {
        return true;
      }

      return user.roles.some(x => x == role);
    }),
  );
};
