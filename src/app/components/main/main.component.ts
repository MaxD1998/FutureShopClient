import { Component } from '@angular/core';
import { IconType } from '../../core/enums/icon-type';
import { IconComponent } from '../shared/icon/icon.component';
import { AsideComponent } from './aside/aside.component';

@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  imports: [AsideComponent, IconComponent],
})
export class MainComponent {
  IconType: typeof IconType = IconType;

  isMenu: boolean = true;

  changeMenu() {
    this.isMenu = !this.isMenu;
  }
}
