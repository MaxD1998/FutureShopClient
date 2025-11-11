import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { filter, map, Observable, take } from 'rxjs';
import { ClientRoute } from '../../core/constants/client-routes/client.route';
import { IconType } from '../../core/enums/icon-type';
import { UserType } from '../../core/enums/user-type';
import { UserService } from '../../modules/auth-module/core/services/user.service';
import { NavComponent } from '../shared/nav/nav.component';
import { ModuleButtonComponent } from './module-button/module-button.component';

@Component({
  selector: 'app-module',
  imports: [AsyncPipe, NavComponent, ModuleButtonComponent],
  templateUrl: './module.component.html',
  styleUrl: './module.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModuleComponent {
  private readonly _router = inject(Router);

  readonly userService = inject(UserService);
  IconType: typeof IconType = IconType;

  navigateToAuthModuleSettings(): void {
    this._router.navigateByUrl(`${ClientRoute.authModule}/${ClientRoute.settings}`);
  }

  navigateToProductModule(): void {
    this._router.navigateByUrl(ClientRoute.productModule);
  }

  navigateToShopModule(): void {
    this._router.navigateByUrl('');
  }

  hasAuthorizationModule(): Observable<boolean> {
    return this.userService.user$.pipe(
      take(1),
      filter(user => !!user),
      map(user => {
        return user.authorizationPermissions.length > 0 || user.roles.some(x => x == UserType.superAdmin);
      }),
    );
  }

  hasProductModule(): Observable<boolean> {
    return this.userService.user$.pipe(
      take(1),
      filter(user => !!user),
      map(user => {
        return user.productPermissions.length > 0 || user.roles.some(x => x == UserType.superAdmin);
      }),
    );
  }

  hasShopModule(): Observable<boolean> {
    return this.userService.user$.pipe(
      take(1),
      filter(user => !!user),
      map(user => {
        return user.shopPermissions.length > 0 || user.roles.some(x => x == UserType.superAdmin);
      }),
    );
  }

  hasWarehouseModule(): Observable<boolean> {
    return this.userService.user$.pipe(
      take(1),
      filter(user => !!user),
      map(user => {
        return user.warehousePermissions.length > 0 || user.roles.some(x => x == UserType.superAdmin);
      }),
    );
  }
}
