import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DropDownListItemModel } from '../../../../core/models/drop-down-list-item.model';

@Component({
  selector: 'app-drop-down-list-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './drop-down-list-item.component.html',
  styleUrl: './drop-down-list-item.component.css',
  imports: [TranslateModule],
})
export class DropDownListItemComponent {
  @Input() item?: DropDownListItemModel = undefined;
  @Output() onItemClick: EventEmitter<DropDownListItemModel> = new EventEmitter<DropDownListItemModel>();

  action() {
    this.onItemClick.emit(this.item as DropDownListItemModel);
  }
}
