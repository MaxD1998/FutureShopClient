import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconType } from '../../../core/enums/icon-type';

@Component({
    selector: 'app-icon',
    imports: [],
    templateUrl: './icon.component.html',
    styleUrl: './icon.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent {
  iconName = input.required<string>();
  iconStyle = input<string>('w-6 h-6');

  IconType: typeof IconType = IconType;
}
