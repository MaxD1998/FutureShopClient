import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DropDownListItemModel } from '../../../../core/models/drop-down-list-item.model';

@Component({
  selector: 'app-drop-down-list-item',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './drop-down-list-item.component.html',
  styleUrl: './drop-down-list-item.component.css',
})
export class DropDownListItemComponent {
  @Input() item: DropDownListItemModel | null = null;
  @Output() onItemClick: EventEmitter<DropDownListItemModel> = new EventEmitter<DropDownListItemModel>();

  action() {
    this.onItemClick.emit(this.item as DropDownListItemModel);
  }
}
