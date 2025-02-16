import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { filter, map, Observable, take } from 'rxjs';
import { ClientRoute } from '../../core/constants/client-routes/client.route';
import { IconType } from '../../core/enums/icon-type';
import { ModuleType } from '../../core/enums/module-type';
import { UserType } from '../../core/enums/user-type';
import { UserService } from '../../modules/auth-module/core/services/user.service';
import { IconComponent } from '../shared/icon/icon.component';
import { NavComponent } from '../shared/nav/nav.component';

@Component({
  selector: 'app-module',
  imports: [AsyncPipe, IconComponent, NavComponent],
  templateUrl: './module.component.html',
  styleUrl: './module.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModuleComponent {
  private readonly _router = inject(Router);

  readonly userService = inject(UserService);
  IconType: typeof IconType = IconType;
  ModuleType: typeof ModuleType = ModuleType;

  navigateToProductModule(): void {
    this._router.navigateByUrl(ClientRoute.productModule);
  }

  navigateToShopModule(): void {
    this._router.navigateByUrl('');
  }

  canShowModule(moduleType: ModuleType): Observable<boolean> {
    return this.userService.user$.pipe(
      take(1),
      filter(user => !!user),
      map(user => {
        return user.modules.some(x => x.moduleType == moduleType) || user.roles.some(x => x == UserType.superAdmin);
      }),
    );
  }
}
