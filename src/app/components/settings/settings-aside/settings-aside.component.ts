import { ChangeDetectionStrategy, Component, WritableSignal, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ClientRoute } from '../../../core/constants/client-routes/client.route';
import { AsideItemModel } from '../../../core/models/aside-item.model';
import { AsideComponent } from '../../shared/aside/aside.component';

@Component({
  selector: 'app-settings-aside',
  standalone: true,
  templateUrl: './settings-aside.component.html',
  styleUrl: './settings-aside.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, AsideComponent],
})
export class SettingsAsideComponent {
  items: WritableSignal<AsideItemModel[]> = signal([
    {
      id: '1',
      name: 'settings-aside-component.items.account',
      hasSubCategories: false,
      link: '',
    },
    {
      id: '2',
      name: 'settings-aside-component.items.categories',
      hasSubCategories: false,
      link: `${ClientRoute.categories}/${ClientRoute.list}`,
    },
  ]);
}
