import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DropDownListModel } from '../../../core/models/drop-down-list-model';

@Component({
  selector: 'app-drop-down-list',
  standalone: true,
  imports: [],
  templateUrl: './drop-down-list.component.html',
  styleUrl: './drop-down-list.component.css',
})
export class DropDownListComponent {
  @Input() isVisible: boolean = false;
  @Input() items: DropDownListModel[] | null = [];
  @Output() onItemClick: EventEmitter<DropDownListModel> = new EventEmitter<DropDownListModel>();

  action(id: string) {
    this.onItemClick.emit(this.items?.find(x => x.Id == id));
  }
}
