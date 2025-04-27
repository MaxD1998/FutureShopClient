import { ChangeDetectionStrategy, Component, inject, Injector, input, output, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonLayout } from '../../../core/enums/button-layout';
import { IconType } from '../../../core/enums/icon-type';
import { AsideItemModel } from '../../../core/models/aside-item.model';
import { ButtonSmallIconComponent } from '../button-small-icon/button-small-icon.component';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, TranslateModule, ButtonSmallIconComponent],
})
export class AsideComponent {
  private readonly _injector = inject(Injector);

  items = input.required<AsideItemModel[]>();
  header = input.required<string[]>();

  asideStyle = input<string>('h-[calc(100vh-6rem)]');
  setCloseButton = input<boolean>(false);

  onCloseMenu = output<void>();

  ButtonLayout = ButtonLayout;
  IconType = IconType;

  currentItems = signal<AsideItemModel[]>([]);
  parentId = signal<string | undefined>(undefined);

  constructor() {
    toObservable(this.items, { injector: this._injector }).subscribe({
      next: items => {
        this.currentItems.set(Array.from(items));
      },
    });
  }

  nextLevel(item: AsideItemModel): void {
    this.currentItems.set(Array.from(item.subCategories));
    this.parentId.set(item.id);
  }

  undoLevel(): void {
    const items = this.items();
    const item = items.find(x => x.id == this.parentId());

    if (item) {
      this.currentItems.set(Array.from(items.filter(x => x.parentId == item.parentId)));
      this.parentId.set(item.parentId);
    }
  }
}
