import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsLayoutComponent } from '../../../../components/shared/settings-layout/settings-layout.component';
import { ClientRoute } from '../../../../core/constants/client-routes/client.route';
import { AsideItemModel } from '../../../../core/models/aside-item.model';

@Component({
  selector: 'app-user-settings',
  imports: [TranslateModule, SettingsLayoutComponent],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsComponent {
  items: AsideItemModel[] = [
    {
      id: '1',
      name: 'shop-module.user-settings-component.items.account-settings',
      subCategories: [],
      link: ClientRoute.accountSettings,
    },
    {
      id: '2',
      name: 'shop-module.user-settings-component.items.order-data',
      subCategories: [],
      link: ClientRoute.orderData,
    },
  ];
}
