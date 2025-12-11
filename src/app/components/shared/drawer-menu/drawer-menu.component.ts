import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { AsideItemModel } from '../../../core/models/aside-item.model';
import { AsideMenuComponent } from '../aside-menu/aside-menu.component';

@Component({
  selector: 'app-drawer-menu',
  imports: [AsideMenuComponent],
  templateUrl: './drawer-menu.component.html',
  styleUrl: './drawer-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerMenuComponent {
  header = input.required<string>();
  items = input.required<AsideItemModel[]>();
  isOpen = model.required<boolean>();
}
