import { ChangeDetectionStrategy, Component, forwardRef, input, model, Provider } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const CUSTOM_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ToggleComponent),
  multi: true,
};

@Component({
  selector: 'app-toggle',
  imports: [],
  templateUrl: './toggle.component.html',
  styleUrl: './toggle.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CUSTOM_VALUE_ACCESSOR],
})
export class ToggleComponent implements ControlValueAccessor {
  errorCode = input<string>();
  label = input<string>();
  required = input<boolean>(false);
  value = model<boolean>(false);

  setBackground(): string {
    return this.value() ? 'bg-sky-600' : 'bg-neutral-700';
  }

  setCircle(): string {
    return this.value() ? 'bg-white translate-x-5' : 'bg-neutral-900';
  }

  onValueChange(): void {
    this.value.set(!this.value());
    this.onChange(this.value());
    this.onTouch();
  }

  onChange: any = () => {};
  onTouch: any = () => {};

  writeValue(obj: boolean): void {
    this.value.set(obj);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
