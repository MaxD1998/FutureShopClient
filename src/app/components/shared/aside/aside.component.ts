import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IconType } from '../../../core/enums/icon-type';
import { AsideItemModel } from '../../../core/models/aside-item.model';
import { IconComponent } from '../icon/icon.component';

@Component({
    selector: 'app-aside',
    templateUrl: './aside.component.html',
    styleUrl: './aside.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterModule, IconComponent, TranslateModule]
})
export class AsideComponent {
  items = input.required<AsideItemModel[]>();
  header = input.required<string[]>();

  onMenuChange = output<boolean>();
  onNextLevel = output<string>();
  onUndoLevel = output<string | undefined>();

  IconType: typeof IconType = IconType;

  isMenu = signal<boolean>(true);
  parentIds = signal<(string | undefined)[]>([]);

  changeMenu(): void {
    this.isMenu.set(!this.isMenu());
    this.onMenuChange.emit(this.isMenu());
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
