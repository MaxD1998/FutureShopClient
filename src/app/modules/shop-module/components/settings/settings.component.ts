import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AsideMenuComponent } from '../../../../components/shared/aside-menu/aside-menu.component';
import { NavButtonComponent } from '../../../../components/shared/nav/nav-button/nav-button.component';
import { NavComponent } from '../../../../components/shared/nav/nav.component';
import { ClientRoute } from '../../../../core/constants/client-routes/client.route';
import { IconType } from '../../../../core/enums/icon-type';
import { UserType } from '../../../../core/enums/user-type';
import { AsideItemModel } from '../../../../core/models/aside-item.model';
import { UserService } from '../../../auth-module/core/services/user.service';

@Component({
  selector: 'app-settings',
  imports: [TranslateModule, RouterLink, RouterOutlet, AsyncPipe, AsideMenuComponent, NavComponent, NavButtonComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  readonly userService = inject(UserService);

  ClientRoute: typeof ClientRoute = ClientRoute;
  IconType: typeof IconType = IconType;
  UserType: typeof UserType = UserType;

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
    {
      id: '5',
      name: 'shop-module.settings-component.items.promotion',
      subCategories: [],
      link: `${ClientRoute.promotion}/${ClientRoute.list}`,
    },
  ];
}
