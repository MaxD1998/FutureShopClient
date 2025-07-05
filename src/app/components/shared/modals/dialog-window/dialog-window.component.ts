import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { IconType } from '../../../../core/enums/icon-type';
import { ButtonIconComponent } from '../../button-icon/button-icon.component';

@Component({
  selector: 'app-dialog-window',
  templateUrl: './dialog-window.component.html',
  styleUrl: './dialog-window.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonIconComponent],
})
export class DialogWindowComponent {
  title = input<string>();

  onCloseDialog = output<boolean>();

  isDialogActive = model<boolean>(false);

  IconType: typeof IconType = IconType;

  close(): void {
    this.onCloseDialog.emit(false);
    this.isDialogActive.set(false);
  }
}
