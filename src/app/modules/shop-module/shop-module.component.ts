import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { map } from 'rxjs';
import { NavButtonComponent } from '../../components/shared/nav/nav-button/nav-button.component';
import { NavComponent } from '../../components/shared/nav/nav.component';
import { ClientRoute } from '../../core/constants/client-routes/client.route';
import { IconType } from '../../core/enums/icon-type';
import { UserType } from '../../core/enums/user-type';
import { UserService } from '../auth-module/core/services/user.service';

@Component({
  selector: 'app-shop-module',
  imports: [RouterLink, RouterOutlet, AsyncPipe, TranslateModule, NavComponent, NavButtonComponent],
  templateUrl: './shop-module.component.html',
  styleUrl: './shop-module.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopModuleComponent {
  private readonly _userService = inject(UserService);

  ClientRoute: typeof ClientRoute = ClientRoute;
  IconType: typeof IconType = IconType;

  isLocalAdmin$ = this._userService.user$.pipe(map(user => !!user && user.roles.includes(UserType.localAdmin)));
}
