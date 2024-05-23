import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() isDialogActive: boolean = false;
  @Input() title: string = '';

  @Output() onCloseDialog: EventEmitter<boolean> = new EventEmitter<boolean>();

  IconType: typeof IconType = IconType;

  closeDialog(): void {
    this.isDialogActive = false;
    this.onCloseDialog.emit(this.isDialogActive);
  }
}
