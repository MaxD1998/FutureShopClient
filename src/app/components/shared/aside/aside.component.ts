import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, WritableSignal, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IconType } from '../../../core/enums/icon-type';
import { AsideItemModel } from '../../../core/models/aside-item.model';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-aside',
  standalone: true,
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, IconComponent, TranslateModule],
})
export class AsideComponent {
  @Input() items: AsideItemModel[] = [];
  @Input() header: string = '';
  @Output() onNextLevel: EventEmitter<string> = new EventEmitter<string>();
  @Output() onUndoLevel: EventEmitter<string | undefined> = new EventEmitter<string | undefined>();

  IconType: typeof IconType = IconType;

  isMenu: WritableSignal<boolean> = signal(true);
  parentIds: WritableSignal<(string | undefined)[]> = signal([]);

  changeMenu(): void {
    this.isMenu.set(!this.isMenu());
  }

  nextLevel(item: AsideItemModel): void {
    if (!this.parentIds().includes(item.parentId)) {
      this.parentIds().push(item.parentId);
    }

    this.onNextLevel.emit(item.id);
  }

  undoLevel(): void {
    const lenght = this.parentIds().length;

    if (lenght == 0) {
      return;
    }

    const parentId = this.parentIds()[lenght - 1];
    this.parentIds().pop();

    this.onUndoLevel.emit(parentId);
  }
}
