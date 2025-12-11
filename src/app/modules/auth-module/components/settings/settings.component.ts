import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsLayoutComponent } from '../../../../components/shared/settings-layout/settings-layout.component';
import { ClientRoute } from '../../../../core/constants/client-routes/client.route';
import { AsideItemModel } from '../../../../core/models/aside-item.model';

@Component({
  selector: 'app-settings',
  imports: [TranslateModule, SettingsLayoutComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  items: AsideItemModel[] = [
    {
      id: '1',
      name: 'auth-module.settings-component.items.users',
      subCategories: [],
      link: `${ClientRoute.user}/${ClientRoute.list}`,
    },
    {
      id: '2',
      name: 'auth-module.settings-component.items.permission-groups',
      subCategories: [],
      link: `${ClientRoute.permissionGroup}/${ClientRoute.list}`,
    },
  ];
}
