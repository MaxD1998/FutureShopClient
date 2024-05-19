import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconType } from '../../../core/enums/icon-type';
import { AsideItemModel } from '../../../core/models/aside-item.model';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-aside',
  standalone: true,
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css',
  imports: [RouterModule, IconComponent],
})
export class AsideComponent {
  @Input() items: AsideItemModel[] = [];
  @Input() header: string = '';
  @Output() onNextLevel: EventEmitter<string> = new EventEmitter<string>();
  @Output() onUndoLevel: EventEmitter<string | undefined> = new EventEmitter<string | undefined>();

  IconType: typeof IconType = IconType;

  isMenu: boolean = true;
  parentIds: (string | undefined)[] = [];

  changeMenu(): void {
    this.isMenu = !this.isMenu;
  }

  nextLevel(item: AsideItemModel): void {
    if (!this.parentIds.includes(item.parentId)) {
      this.parentIds.push(item.parentId);
    }

    this.onNextLevel.emit(item.id);
  }

  undoLevel(): void {
    const lenght = this.parentIds.length;

    if (lenght == 0) {
      return;
    }

    const parentId = this.parentIds[lenght - 1];
    this.parentIds.pop();

    this.onUndoLevel.emit(parentId);
  }
}
