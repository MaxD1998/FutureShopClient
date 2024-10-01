import { ChangeDetectionStrategy, Component, forwardRef, input, model, Provider } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

const CUSTOM_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputNumberComponent),
  multi: true,
};

@Component({
  selector: 'app-input-number',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './input-number.component.html',
  styleUrl: './input-number.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CUSTOM_VALUE_ACCESSOR],
})
export class InputNumberComponent {
  autocomplete = input<string>();
  errorCode = input<string | null>();
  label = input<string>();
  placeholder = input<string>('');
  required = input<boolean>(false);
  value = model<number | null>(null);

  onValueChange(element: HTMLInputElement): void {
    const elementValue = element.value;
    this.value.set(elementValue.length == 0 ? null : Number(elementValue));
    this.onChange(this.value());
    this.onTouch();
  }

  transfom(element: HTMLInputElement): void {
    let input = element.value;

    input = input.replace(/[^\d\.\,]/, '').replace(/\,/, '.');

    if (input.length == 1 && input[0] == '.') {
      input = '';
    }

    const splittedString = input.split('.');
    const joinedString = splittedString.filter((x, index) => index != 0).join('');

    element.value = splittedString.length > 1 ? `${splittedString[0]}.${joinedString}` : splittedString[0];
  }

  onChange: any = () => {};
  onTouch: any = () => {};

  writeValue(obj: number): void {
    this.value.set(obj);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
