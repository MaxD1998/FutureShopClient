import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconType } from '../../../../../core/enums/icon-type';
import { IconComponent } from '../../../icon/icon.component';

@Component({
  selector: 'app-grid-text-field',
  standalone: true,
  templateUrl: './grid-text-field.component.html',
  styleUrl: './grid-text-field.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
})
export class GridTextFieldComponent {
  value = input<string>();

  IconType: typeof IconType = IconType;
}
