import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DropDownListItemModel } from '../../../../core/models/drop-down-list-item.model';

@Component({
    selector: 'app-drop-down-list-item',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './drop-down-list-item.component.html',
    styleUrl: './drop-down-list-item.component.css',
    imports: [TranslateModule]
})
export class DropDownListItemComponent {
  item = input.required<DropDownListItemModel>();

  onItemClick = output<DropDownListItemModel>();

  action() {
    this.onItemClick.emit(this.item());
  }
}
