import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ButtonLayout } from '../../../core/enums/button-layout';
import { IconType } from '../../../core/enums/icon-type';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-button-icon',
  imports: [IconComponent],
  templateUrl: './button-icon.component.html',
  styleUrl: './button-icon.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonIconComponent {
  isIcon = input<boolean>(false);
  isDisabled = input<boolean>(false);
  icon = input.required<IconType>();
  iconStyle = input<string>();
  layout = input<ButtonLayout>(ButtonLayout.filled);

  onClick = output<Event>();

  ButtonLayout = ButtonLayout;
}
