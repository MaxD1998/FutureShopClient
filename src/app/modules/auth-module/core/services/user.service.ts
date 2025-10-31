import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, take } from 'rxjs';
import { AuthorizeDto } from '../../../../core/dtos/authorize.dto';
import { AuthorizationPermission } from '../../../../core/enums/authorization-permission';
import { ProductPermission } from '../../../../core/enums/product-permission';
import { ShopPermission } from '../../../../core/enums/shop-permission';
import { UserType } from '../../../../core/enums/user-type';
import { WarehousePermission } from '../../../../core/enums/warehouse-permission';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly user$: BehaviorSubject<AuthorizeDto | undefined> = new BehaviorSubject<AuthorizeDto | undefined>(undefined);

  //Roles
  hasRole(type: UserType): Observable<boolean> {
    return this.user$.asObservable().pipe(
      map(user => {
        if (user) {
          return user.roles.some(x => x === type) || user.roles.includes(UserType.superAdmin);
        }

        return false;
      }),
    );
  }

  //Modules permissions

  hasAuthorizationPermission(permission: AuthorizationPermission): Observable<boolean> {
    return this.user$.asObservable().pipe(
      take(1),
      map(user => {
        if (user) {
          return user.authorizationPermissions.some(x => x === permission) || user.roles.includes(UserType.superAdmin);
        }

        return false;
      }),
    );
  }

  hasProductPermission(permission: ProductPermission): Observable<boolean> {
    return this.user$.asObservable().pipe(
      take(1),
      map(user => {
        if (user) {
          return user.productPermissions.some(x => x === permission) || user.roles.includes(UserType.superAdmin);
        }

        return false;
      }),
    );
  }

  hasShopPermission(permission: ShopPermission): Observable<boolean> {
    return this.user$.asObservable().pipe(
      take(1),
      map(user => {
        if (user) {
          return user.shopPermissions.some(x => x === permission) || user.roles.includes(UserType.superAdmin);
        }

        return false;
      }),
    );
  }

  hasWarehousePermission(permission: WarehousePermission): Observable<boolean> {
    return this.user$.asObservable().pipe(
      take(1),
      map(user => {
        if (user) {
          return user.warehousePermissions.some(x => x === permission) || user.roles.includes(UserType.superAdmin);
        }

        return false;
      }),
    );
  }
}
