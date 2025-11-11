import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { AuthorizationPermission } from '../../../../core/enums/permissions/authorization-permission';
import { UserService } from '../services/user.service';

export function authPermissionGuard(permission: AuthorizationPermission): CanMatchFn {
  return () => {
    const userService = inject(UserService);
    return userService.hasAuthorizationPermission(permission);
  };
}
