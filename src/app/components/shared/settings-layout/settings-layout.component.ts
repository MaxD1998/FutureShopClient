import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AsideItemModel } from '../../../core/models/aside-item.model';
import { NavButtonModel } from '../../../core/models/nav-button.model';
import { WindowSizeService } from '../../../core/services/window-size.service';
import { AsideMenuComponent } from '../aside-menu/aside-menu.component';
import { DrawerMenuComponent } from '../drawer-menu/drawer-menu.component';
import { NavButtonComponent } from '../nav/nav-button/nav-button.component';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-settings-layout',
  imports: [
    AsyncPipe,
    RouterLink,
    RouterOutlet,
    AsideMenuComponent,
    DrawerMenuComponent,
    NavComponent,
    NavButtonComponent,
  ],
  templateUrl: './settings-layout.component.html',
  styleUrl: './settings-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsLayoutComponent {
  private readonly _windowSizeService = inject(WindowSizeService);

  asideMenuHeader = input.required<string>();
  items = input.required<AsideItemModel[]>();
  navButtons = input<NavButtonModel[]>([]);

  isMobileMenuOpen = signal<boolean>(false);

  isMobile$ = this._windowSizeService.isMobile$;
}
