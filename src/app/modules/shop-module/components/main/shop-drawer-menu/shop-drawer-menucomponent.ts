import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AsideMenuComponent } from '../../../../../components/shared/aside-menu/aside-menu.component';
import { AsideItemModel } from '../../../../../core/models/aside-item.model';

@Component({
  selector: 'app-shop-drawer-menu',
  templateUrl: './shop-drawer-menu.component.html',
  styleUrl: './shop-drawer-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, AsideMenuComponent],
})
export class ShopDrawerMenuComponent {
  private readonly _activatedRoute = inject(ActivatedRoute);

  onCloseMenu = output<void>();

  categories = signal<AsideItemModel[]>(this._activatedRoute.snapshot.data['categories'] ?? []);
}
