import { Component } from '@angular/core';
import { IconType } from '../../core/enums/icon-type';
import { AsideComponent } from '../shared/aside/aside.component';
import { IconComponent } from '../shared/icon/icon.component';
import { MenuAsideComponent } from './menu-aside/menu-aside.component';

@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  imports: [MenuAsideComponent, IconComponent, AsideComponent],
})
export class MainComponent {
  IconType: typeof IconType = IconType;

  isMenu: boolean = true;

  changeMenu() {
    this.isMenu = !this.isMenu;
  }
}
