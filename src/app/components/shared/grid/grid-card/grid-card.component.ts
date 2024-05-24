import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { GridTemplate } from '../../../../core/enums/grid-template';
import { DataGridColumnModel } from '../../../../core/models/data-grid-column.model';
import { GridActionFieldComponent } from '../grid-field-templates/grid-action-field/grid-action-field.component';
import { GridBooleanFieldComponent } from '../grid-field-templates/grid-boolean-field/grid-boolean-field.component';
import { GridTextFieldComponent } from '../grid-field-templates/grid-text-field/grid-text-field.component';

@Component({
  selector: 'app-grid-card',
  standalone: true,
  templateUrl: './grid-card.component.html',
  styleUrl: './grid-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, GridActionFieldComponent, GridBooleanFieldComponent, GridTextFieldComponent],
})
export class GridCardComponent {
  @Input() columns: DataGridColumnModel[] = [];
  @Input() item: any;

  GridTemplate: typeof GridTemplate = GridTemplate;
}
