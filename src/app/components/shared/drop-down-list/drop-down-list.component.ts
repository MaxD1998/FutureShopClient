import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DropDownListOrientation } from '../../../core/enums/drop-down-list-orientation';
import { DropDownListItemModel } from '../../../core/models/drop-down-list-item.model';
import { DropDownListItemComponent } from './drop-down-list-item/drop-down-list-item.component';

@Component({
  selector: 'app-drop-down-list',
  standalone: true,
  templateUrl: './drop-down-list.component.html',
  styleUrl: './drop-down-list.component.css',
  imports: [DropDownListItemComponent],
})
export class DropDownListComponent {
  @Input() isVisible: boolean = false;
  @Input() items: DropDownListItemModel[] | null = null;
  @Input() orientation: DropDownListOrientation = DropDownListOrientation.left;
  @Output() onItemClick: EventEmitter<DropDownListItemModel> = new EventEmitter<DropDownListItemModel>();

  get styles(): string {
    let style = 'bg-white absolute border rounded-md min-w-32';
    switch (this.orientation) {
      case DropDownListOrientation.left:
        style = `${style} left-0`;
        break;
      case DropDownListOrientation.right:
        style = `${style} right-0`;
        break;
      default:
        style = `${style} left-0`;
    }

    return style;
  }

  action(model: DropDownListItemModel) {
    this.onItemClick.emit(this.items?.find(x => x.id == model.id));
    this.isVisible = false;
  }
}
