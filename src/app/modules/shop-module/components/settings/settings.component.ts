import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AsideComponent } from '../../../../components/shared/aside/aside.component';
import { ClientRoute } from '../../../../core/constants/client-routes/client.route';
import { AsideItemModel } from '../../../../core/models/aside-item.model';

@Component({
  selector: 'app-settings',
  imports: [TranslateModule, RouterOutlet, AsideComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  items: AsideItemModel[] = [
    {
      id: '1',
      name: 'shop-module.settings-component.items.categories',
      hasSubCategories: false,
      link: `${ClientRoute.category}/${ClientRoute.list}`,
    },
    {
      id: '2',
      name: 'shop-module.settings-component.items.products-bases',
      hasSubCategories: false,
      link: `${ClientRoute.productBase}/${ClientRoute.list}`,
    },
    {
      id: '3',
      name: 'shop-module.settings-component.items.products',
      hasSubCategories: false,
      link: `${ClientRoute.product}/${ClientRoute.list}`,
    },
  ];
}
