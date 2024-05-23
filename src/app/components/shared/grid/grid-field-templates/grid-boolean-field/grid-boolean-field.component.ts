import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IconType } from '../../../../../core/enums/icon-type';
import { IconComponent } from '../../../icon/icon.component';

@Component({
  selector: 'app-grid-boolean-field',
  standalone: true,
  templateUrl: './grid-boolean-field.component.html',
  styleUrl: './grid-boolean-field.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
})
export class GridBooleanFieldComponent {
  @Input() value: boolean | null | undefined = null;

  IconType: typeof IconType = IconType;
}
