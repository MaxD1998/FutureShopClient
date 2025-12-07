import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsideItemModel } from '../../../core/models/aside-item.model';
import { WindowSizeService } from '../../../core/services/window-size.service';
import { AsideMenuComponent } from '../aside-menu/aside-menu.component';
import { DrawerMenuComponent } from '../drawer-menu/drawer-menu.component';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-settings-layout',
  imports: [AsyncPipe, RouterOutlet, AsideMenuComponent, DrawerMenuComponent, NavComponent],
  templateUrl: './settings-layout.component.html',
  styleUrl: './settings-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsLayoutComponent {
  private readonly _windowSizeService = inject(WindowSizeService);

  asideMenuHeader = input.required<string>();
  items = input.required<AsideItemModel[]>();

  isMobileMenuOpen = signal<boolean>(false);

  isMobile$ = this._windowSizeService.isMobile$;
}
