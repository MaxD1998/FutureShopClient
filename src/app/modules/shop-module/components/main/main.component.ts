import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NavButtonComponent } from '../../../../components/shared/nav/nav-button/nav-button.component';
import { NavComponent } from '../../../../components/shared/nav/nav.component';
import { ClientRoute } from '../../../../core/constants/client-routes/client.route';
import { IconType } from '../../../../core/enums/icon-type';
import { UserType } from '../../../../core/enums/user-type';
import { DropDownListItemModel } from '../../../../core/models/drop-down-list-item.model';
import { UserService } from '../../../auth-module/core/services/user.service';
import { ShopDrawerMenuComponent } from './shop-drawer-menu/shop-drawer-menucomponent';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  imports: [AsyncPipe, RouterModule, NavComponent, NavButtonComponent, ShopDrawerMenuComponent],
})
export class MainComponent {
  private readonly _router = inject(Router);

  readonly userService = inject(UserService);

  isOpenedMenu = signal<boolean>(false);

  ClientRoute: typeof ClientRoute = ClientRoute;
  IconType: typeof IconType = IconType;
  UserType: typeof UserType = UserType;

  userItems: DropDownListItemModel[] = [
    {
      id: '',
      value: 'Ustawienia',
      callback: () => {
        const array = [ClientRoute.userSettings];
        this._router.navigate(array);
      },
    },
  ];
}
