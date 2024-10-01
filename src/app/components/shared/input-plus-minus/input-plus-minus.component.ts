import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { IconType } from '../../../core/enums/icon-type';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-input-plus-minus',
  standalone: true,
  imports: [ButtonComponent, IconComponent],
  templateUrl: './input-plus-minus.component.html',
  styleUrl: './input-plus-minus.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputPlusMinusComponent {
  value = model<number>(0);

  IconType: typeof IconType = IconType;

  increase(): void {
    if (this.value() < 9999) {
      this.value.set(this.value() + 1);
    }
  }

  reduce(): void {
    if (this.value() > 0) {
      this.value.set(this.value() - 1);
    }
  }

  transform(element: HTMLInputElement): void {
    const input = element.value.replace(/\D/, '');
    element.value = input.slice(0, 4);
    this.value.set(Number(element.value));
  }
}
