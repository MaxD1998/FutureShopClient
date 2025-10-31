import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { UserService } from '../../modules/auth-module/core/services/user.service';
import { UserType } from '../enums/user-type';

export const authEmployeeGuard: CanMatchFn = (route, state) => {
  const userService = inject(UserService);

  return userService.hasRole(UserType.employee);
};
