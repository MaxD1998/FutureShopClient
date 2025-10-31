import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { ProductPermission } from '../../../../core/enums/product-permission';
import { UserService } from '../../../auth-module/core/services/user.service';

export function productPermissionGuard(permission: ProductPermission): CanMatchFn {
  return () => {
    const userService = inject(UserService);
    return userService.hasProductPermission(permission);
  };
}
