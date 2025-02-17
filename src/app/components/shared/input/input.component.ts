import { ChangeDetectionStrategy, Component, Provider, forwardRef, input, model } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputType } from '../../../core/enums/input-type';

const CUSTOM_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputComponent),
  multi: true,
};

@Component({
  selector: 'app-input',
  imports: [TranslateModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CUSTOM_VALUE_ACCESSOR],
})
export class InputComponent implements ControlValueAccessor {
  autocomplete = input<string>();
  errorCode = input<string | null>();
  label = input<string>();
  isDisabled = input<boolean>(false);
  placeholder = input<string>('');
  required = input<boolean>(false);
  type = input<string>(InputType.text);
  value = model<string | null>(null);

  onValueChange(element: HTMLInputElement): void {
    const elementValue = element.value;
    this.value.set(elementValue.length == 0 ? null : elementValue);
    this.onChange(this.value());
    this.onTouch();
  }

  onChange: any = () => {};
  onTouch: any = () => {};

  writeValue(obj: string): void {
    this.value.set(obj);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
