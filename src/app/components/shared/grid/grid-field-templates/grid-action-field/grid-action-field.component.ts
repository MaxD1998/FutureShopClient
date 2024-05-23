import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() id: string = '';

  @Input() isDetailAction: boolean = false;
  @Input() isEditAction: boolean = false;
  @Input() isRemoveAction: boolean = false;

  @Output() onDetailAction: EventEmitter<string> = new EventEmitter<string>();
  @Output() onEditAction: EventEmitter<string> = new EventEmitter<string>();
  @Output() onRemoveAction: EventEmitter<string> = new EventEmitter<string>();

  IconType: typeof IconType = IconType;

  detailAction(): void {
    this.onDetailAction.emit(this.id);
  }

  editAction(): void {
    this.onEditAction.emit(this.id);
  }

  removeAction(): void {
    this.onRemoveAction.emit(this.id);
  }
}
