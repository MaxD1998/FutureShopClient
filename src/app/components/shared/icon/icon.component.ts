import { Component, Input } from '@angular/core';
import { IconType } from '../../../core/enums/icon-type';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.css',
})
export class IconComponent {
  @Input() iconName: IconType;
  @Input() iconStyle: string = 'w-6 h-6';

  IconType: typeof IconType = IconType;
}