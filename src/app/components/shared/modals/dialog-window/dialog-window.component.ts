import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { IconType } from '../../../../core/enums/icon-type';
import { IconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-dialog-window',
  standalone: true,
  templateUrl: './dialog-window.component.html',
  styleUrl: './dialog-window.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
})
export class DialogWindowComponent {
  title = input<string>();

  onCloseDialog = output<boolean>();

  isDialogActive = model<boolean>(false);

  IconType: typeof IconType = IconType;
}
