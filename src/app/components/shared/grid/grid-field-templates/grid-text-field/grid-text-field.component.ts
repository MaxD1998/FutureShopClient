import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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
  @Input() value: string | null | undefined = null;

  IconType: typeof IconType = IconType;
}
