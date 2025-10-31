import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { ShopPermission } from '../../../../core/enums/shop-permission';
import { UserService } from '../../../auth-module/core/services/user.service';

export function shopPermissionGuard(permission: ShopPermission): CanMatchFn {
  return () => {
    const userService = inject(UserService);
    return userService.hasShopPermission(permission);
  };
}
