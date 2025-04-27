import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { map } from 'rxjs';
import { AsideComponent } from '../../../../components/shared/aside/aside.component';
import { NavButtonComponent } from '../../../../components/shared/nav/nav-button/nav-button.component';
import { NavComponent } from '../../../../components/shared/nav/nav.component';
import { ClientRoute } from '../../../../core/constants/client-routes/client.route';
import { IconType } from '../../../../core/enums/icon-type';
import { UserType } from '../../../../core/enums/user-type';
import { AsideItemModel } from '../../../../core/models/aside-item.model';
import { UserService } from '../../../auth-module/core/services/user.service';

@Component({
  selector: 'app-settings',
  imports: [TranslateModule, RouterLink, RouterOutlet, AsyncPipe, AsideComponent, NavComponent, NavButtonComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  private readonly _userService = inject(UserService);

  ClientRoute: typeof ClientRoute = ClientRoute;
  IconType: typeof IconType = IconType;

  isLocalAdmin$ = this._userService.user$.pipe(map(user => !!user && user.roles.includes(UserType.localAdmin)));
  items: AsideItemModel[] = [
    {
      id: '1',
      name: 'shop-module.settings-component.items.categories',
      subCategories: [],
      link: `${ClientRoute.category}/${ClientRoute.list}`,
    },
    {
      id: '2',
      name: 'shop-module.settings-component.items.products-bases',
      subCategories: [],
      link: `${ClientRoute.productBase}/${ClientRoute.list}`,
    },
    {
      id: '3',
      name: 'shop-module.settings-component.items.products',
      subCategories: [],
      link: `${ClientRoute.product}/${ClientRoute.list}`,
    },
    {
      id: '4',
      name: 'shop-module.settings-component.items.ad-campaigns',
      subCategories: [],
      link: `${ClientRoute.adCampaign}/${ClientRoute.list}`,
    },
  ];
}
