import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconType } from '../../../core/enums/icon-type';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-module-button',
  imports: [IconComponent],
  templateUrl: './module-button.component.html',
  styleUrl: './module-button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModuleButtonComponent {
  iconName = input.required<IconType>();
  name = input.required<string>();

  onClick = output();
}
