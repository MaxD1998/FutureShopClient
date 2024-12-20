import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ButtonLayout } from '../../../core/enums/button-layout';
import { IconComponent } from '../icon/icon.component';

@Component({
    selector: 'app-button',
    imports: [IconComponent],
    templateUrl: './button.component.html',
    styleUrl: './button.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  isIcon = input<boolean>(false);
  isDisabled = input<boolean>(false);
  label = input.required<string>();
  layout = input<ButtonLayout>();
  width = input<string>('w-full');

  onClick = output<Event>();

  private _disabled_layout = 'border-gray-300 bg-gray-300 text-gray-500';
  private _disabled_outline_layout = 'border-gray-300 text-gray-500';
  private _green_layout = 'border-green-300 bg-green-300 hover:bg-green-400 hover:border-green-400';
  private _green_outline_layout = 'border-green-300 hover:bg-green-300';

  initLayout(): string {
    if (this.isDisabled()) {
      if (ButtonLayout.greenLayout) {
        return this._disabled_layout;
      } else {
        return this._disabled_outline_layout;
      }
    }

    switch (this.layout()) {
      case ButtonLayout.greenLayout:
        return this._green_layout;
      case ButtonLayout.greenOutlineLayout:
        return this._green_outline_layout;
      default:
        return this._green_outline_layout;
    }
  }
}
