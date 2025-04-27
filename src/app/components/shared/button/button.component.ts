import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ButtonLayout } from '../../../core/enums/button-layout';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  isDisabled = input<boolean>(false);
  label = input.required<string>();
  layout = input<ButtonLayout>(ButtonLayout.filled);

  onClick = output<Event>();

  ButtonLayout = ButtonLayout;
}
