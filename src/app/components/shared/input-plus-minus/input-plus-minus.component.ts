import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { IconType } from '../../../core/enums/icon-type';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-input-plus-minus',
  imports: [IconComponent],
  templateUrl: './input-plus-minus.component.html',
  styleUrl: './input-plus-minus.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputPlusMinusComponent {
  minValue = input<number>(0);

  value = model<number>(this.minValue());

  IconType: typeof IconType = IconType;

  increase(): void {
    if (this.value() < 9999) {
      this.value.set(this.value() + 1);
    }
  }

  reduce(): void {
    if (this.value() > this.minValue()) {
      this.value.set(this.value() - 1);
    }
  }

  transform(element: HTMLInputElement): void {
    const input = element.value.replace(/\D/, '');
    element.value = input.slice(0, 4);
    this.value.set(Number(element.value));
  }
}
