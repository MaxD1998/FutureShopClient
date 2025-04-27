import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { map } from 'rxjs';
import { NavButtonComponent } from '../../../../components/shared/nav/nav-button/nav-button.component';
import { NavComponent } from '../../../../components/shared/nav/nav.component';
import { ClientRoute } from '../../../../core/constants/client-routes/client.route';
import { IconType } from '../../../../core/enums/icon-type';
import { UserType } from '../../../../core/enums/user-type';
import { UserService } from '../../../auth-module/core/services/user.service';
import { MenuAsideComponent } from './menu-aside/menu-aside.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  imports: [AsyncPipe, RouterModule, MenuAsideComponent, NavComponent, NavButtonComponent],
})
export class MainComponent {
  private readonly _userService = inject(UserService);

  isOpenedMenu = signal<boolean>(false);

  ClientRoute: typeof ClientRoute = ClientRoute;
  IconType: typeof IconType = IconType;

  isLocalAdmin$ = this._userService.user$.pipe(map(user => !!user && user.roles.includes(UserType.localAdmin)));
}
