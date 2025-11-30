import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AsideComponent } from '../../../../components/shared/aside/aside.component';
import { NavComponent } from '../../../../components/shared/nav/nav.component';
import { ClientRoute } from '../../../../core/constants/client-routes/client.route';
import { AsideItemModel } from '../../../../core/models/aside-item.model';

@Component({
  selector: 'app-user-settings',
  imports: [RouterOutlet, TranslateModule, AsideComponent, NavComponent],
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
