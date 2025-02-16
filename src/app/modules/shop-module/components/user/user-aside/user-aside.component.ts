import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AsideComponent } from '../../../../../components/shared/aside/aside.component';
import { ClientRoute } from '../../../../../core/constants/client-routes/client.route';
import { AsideItemModel } from '../../../../../core/models/aside-item.model';

@Component({
  selector: 'app-user-aside',
  imports: [TranslateModule, AsideComponent],
  templateUrl: './user-aside.component.html',
  styleUrl: './user-aside.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAsideComponent {
  items = signal<AsideItemModel[]>([
    {
      id: '1',
      name: 'shop-module.user-aside-component.items.account',
      hasSubCategories: false,
      link: ``,
    },
    {
      id: '2',
      name: 'shop-module.user-aside-component.items.purchase-lists',
      hasSubCategories: false,
      link: `${ClientRoute.user}/${ClientRoute.purchaseLists}`,
    },
  ]);
}
