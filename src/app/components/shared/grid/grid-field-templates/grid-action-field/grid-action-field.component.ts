import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconType } from '../../../../../core/enums/icon-type';
import { IconComponent } from '../../../icon/icon.component';

@Component({
  selector: 'app-grid-action-field',
  standalone: true,
  templateUrl: './grid-action-field.component.html',
  styleUrl: './grid-action-field.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
})
export class GridActionFieldComponent {
  id = input.required<string>();

  isDetailAction = input<boolean>(false);
  isEditAction = input<boolean>(false);
  isRemoveAction = input<boolean>(false);

  onDetailAction = output<string>();
  onEditAction = output<string>();
  onRemoveAction = output<string>();

  IconType: typeof IconType = IconType;

  detailAction(): void {
    this.onDetailAction.emit(this.id());
  }

  editAction(): void {
    this.onEditAction.emit(this.id());
  }

  removeAction(): void {
    this.onRemoveAction.emit(this.id());
  }
}
