import { Component, Input } from '@angular/core';
import { ButtonLayout } from '../../../core/enums/button-layout';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  @Input() label: string = '';
  @Input() layout: ButtonLayout;
  @Input() width: string = 'w-full';

  private _green_layout = 'border-green-300 bg-green-300 hover:bg-green-400 hover:border-green-400';
  private _green_outline_layout = 'border-green-300 hover:bg-green-300';

  initLayout(): string {
    switch (this.layout) {
      case ButtonLayout.greenLayout:
        return this._green_layout;
      case ButtonLayout.greenOutlineLayout:
        return this._green_outline_layout;
      default:
        return this._green_outline_layout;
    }
  }
}
