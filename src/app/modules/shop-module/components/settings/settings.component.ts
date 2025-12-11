import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsLayoutComponent } from '../../../../components/shared/settings-layout/settings-layout.component';
import { ClientRoute } from '../../../../core/constants/client-routes/client.route';
import { IconType } from '../../../../core/enums/icon-type';
import { UserType } from '../../../../core/enums/user-type';
import { AsideItemModel } from '../../../../core/models/aside-item.model';
import { NavButtonModel } from '../../../../core/models/nav-button.model';
import { UserService } from '../../../auth-module/core/services/user.service';

@Component({
  selector: 'app-settings',
  imports: [TranslateModule, SettingsLayoutComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  private readonly _userService = inject(UserService);

  ClientRoute: typeof ClientRoute = ClientRoute;
  IconType: typeof IconType = IconType;
  UserType: typeof UserType = UserType;

  navButtons = signal<NavButtonModel[]>([]);

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

  constructor() {
    if (this._userService.hasRole(UserType.employee)) {
      this.navButtons.set([
        {
          iconName: IconType.cog8Tooth,
          routerLink: `/${ClientRoute.shopModule}/${ClientRoute.settings}`,
        },
      ]);
    }
  }
}
