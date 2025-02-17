import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { DropDownListOrientation } from '../../../core/enums/drop-down-list-orientation';
import { DropDownListItemModel } from '../../../core/models/drop-down-list-item.model';
import { DropDownListItemComponent } from './drop-down-list-item/drop-down-list-item.component';

@Component({
  selector: 'app-drop-down-list',
  templateUrl: './drop-down-list.component.html',
  styleUrl: './drop-down-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DropDownListItemComponent],
})
export class DropDownListComponent {
  items = input<DropDownListItemModel[]>();
  orientation = input<DropDownListOrientation>(DropDownListOrientation.left);

  isVisible = model<boolean>(false);

  get styles(): string {
    let style = 'bg-white shadow-md absolute min-w-32 overflow-hidden z-50';
    switch (this.orientation()) {
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
    const item = this.items()?.find(x => x.id == model.id);

    if (item) {
      const callback = item.callback;

      if (callback) {
        callback(model);
      }
    }

    this.isVisible.set(false);
  }
}
