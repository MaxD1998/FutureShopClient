import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AsideComponent } from '../../components/shared/aside/aside.component';
import { NavComponent } from '../../components/shared/nav/nav.component';
import { ClientRoute } from '../../core/constants/client-routes/client.route';
import { AsideItemModel } from '../../core/models/aside-item.model';

@Component({
  selector: 'app-product-module',
  imports: [RouterOutlet, TranslateModule, NavComponent, AsideComponent],
  templateUrl: './product-module.component.html',
  styleUrl: './product-module.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductModuleComponent {
  items: AsideItemModel[] = [
    {
      id: '1',
      name: 'product-module.product-module-component.items.categories',
      hasSubCategories: false,
      link: `${ClientRoute.category}/${ClientRoute.list}`,
    },
    {
      id: '2',
      name: 'product-module.product-module-component.items.products-bases',
      hasSubCategories: false,
      link: `${ClientRoute.productBase}/${ClientRoute.list}`,
    },
    {
      id: '3',
      name: 'product-module.product-module-component.items.products',
      hasSubCategories: false,
      link: `${ClientRoute.product}/${ClientRoute.list}`,
    },
  ];
}
