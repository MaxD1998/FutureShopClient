import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconType } from '../../../../../core/enums/icon-type';
import { IconComponent } from '../../../icon/icon.component';

@Component({
  selector: 'app-table-boolean-field',
  standalone: true,
  templateUrl: './table-boolean-field.component.html',
  styleUrl: './table-boolean-field.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
})
export class TableBooleanFieldComponent {
  value = input<boolean>();

  IconType: typeof IconType = IconType;
}
