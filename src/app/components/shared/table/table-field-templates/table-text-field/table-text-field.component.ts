import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconType } from '../../../../../core/enums/icon-type';
import { IconComponent } from '../../../icon/icon.component';

@Component({
    selector: 'app-table-text-field',
    templateUrl: './table-text-field.component.html',
    styleUrl: './table-text-field.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [IconComponent]
})
export class TableTextFieldComponent {
  justify = input.required<string>();
  value = input<string>();

  IconType: typeof IconType = IconType;
}
