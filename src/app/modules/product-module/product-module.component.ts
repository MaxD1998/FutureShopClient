import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsLayoutComponent } from '../../components/shared/settings-layout/settings-layout.component';
import { ClientRoute } from '../../core/constants/client-routes/client.route';
import { AsideItemModel } from '../../core/models/aside-item.model';

@Component({
  selector: 'app-product-module',
  imports: [TranslateModule, SettingsLayoutComponent],
  templateUrl: './product-module.component.html',
  styleUrl: './product-module.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductModuleComponent {
  items: AsideItemModel[] = [
    {
      id: '1',
      name: 'product-module.product-module-component.items.categories',
      subCategories: [],
      link: `${ClientRoute.category}/${ClientRoute.list}`,
    },
    {
      id: '2',
      name: 'product-module.product-module-component.items.products-bases',
      subCategories: [],
      link: `${ClientRoute.productBase}/${ClientRoute.list}`,
    },
    {
      id: '3',
      name: 'product-module.product-module-component.items.products',
      subCategories: [],
      link: `${ClientRoute.product}/${ClientRoute.list}`,
    },
  ];
}
