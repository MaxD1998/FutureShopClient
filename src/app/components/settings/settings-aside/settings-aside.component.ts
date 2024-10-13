import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
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
  items = signal<AsideItemModel[]>([
    {
      id: '1',
      name: 'settings-aside-component.items.categories',
      hasSubCategories: false,
      link: `${ClientRoute.category}/${ClientRoute.list}`,
    },
    {
      id: '2',
      name: 'settings-aside-component.items.products-bases',
      hasSubCategories: false,
      link: `${ClientRoute.productBase}/${ClientRoute.list}`,
    },
    {
      id: '3',
      name: 'settings-aside-component.items.products',
      hasSubCategories: false,
      link: `${ClientRoute.product}/${ClientRoute.list}`,
    },
  ]);
}
