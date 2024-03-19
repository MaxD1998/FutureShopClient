import { Component } from '@angular/core';
import { IconType } from '../../../core/enums/icon-type';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-aside',
  standalone: true,
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css',
  imports: [IconComponent],
})
export class AsideComponent {
  IconType: typeof IconType = IconType;
}
