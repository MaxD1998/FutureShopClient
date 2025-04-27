import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DropDownListItemModel } from '../../../core/models/drop-down-list-item.model';

@Component({
  selector: 'app-drop-down-list',
  templateUrl: './drop-down-list.component.html',
  styleUrl: './drop-down-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule],
})
export class DropDownListComponent {
  items = input.required<DropDownListItemModel[]>();

  onClick = output();

  action(model: DropDownListItemModel) {
    model.callback(model);
    this.onClick.emit();
  }
}
