import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { GridTemplate } from '../../../core/enums/grid-template';
import { IconType } from '../../../core/enums/icon-type';
import { DataGridColumnModel } from '../../../core/models/data-grid-column.model';
import { IconComponent } from '../icon/icon.component';
import { GridCardComponent } from './grid-card/grid-card.component';
import { GridActionFieldComponent } from './grid-field-templates/grid-action-field/grid-action-field.component';
import { GridBooleanFieldComponent } from './grid-field-templates/grid-boolean-field/grid-boolean-field.component';
import { GridTextFieldComponent } from './grid-field-templates/grid-text-field/grid-text-field.component';

@Component({
  selector: 'app-grid',
  standalone: true,
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GridActionFieldComponent,
    GridBooleanFieldComponent,
    GridTextFieldComponent,
    GridCardComponent,
    TranslateModule,
    IconComponent,
  ],
})
export class GridComponent {
  columns = input.required<DataGridColumnModel[]>();
  idName = input.required<string>();
  items = input<any[]>();

  isDetailAction = input<boolean>(false);
  isEditAction = input<boolean>(false);
  isRemoveAction = input<boolean>(false);

  onDetailAction = output<string>();
  onEditAction = output<string>();
  onRemoveAction = output<string>();

  GridTemplate: typeof GridTemplate = GridTemplate;
  IconType: typeof IconType = IconType;

  rowId: string = '';

  actionColumnWidth(): string {
    const array = [this.isDetailAction, this.isEditAction, this.isRemoveAction];
    if (array.filter(x => x).length == 3) {
      return 'w-25';
    }

    if (array.filter(x => x).length == 2) {
      return 'w-18';
    }

    if (array.filter(x => x).length == 1) {
      return 'w-11';
    }

    return '';
  }

  detailAction(id: string): void {
    this.onDetailAction.emit(id);
  }

  editAction(id: string): void {
    this.onEditAction.emit(id);
  }

  removeAction(id: string): void {
    this.onRemoveAction.emit(id);
  }
}
