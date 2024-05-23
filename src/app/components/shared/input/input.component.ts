import { ChangeDetectionStrategy, Component, Input, Provider, forwardRef } from '@angular/core';
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
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CUSTOM_VALUE_ACCESSOR],
})
export class InputComponent implements ControlValueAccessor {
  @Input() autocomplete: string = '';
  @Input() errorCode?: string | null = null;
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() type: InputType = InputType.text;
  @Input() value: string | null = null;

  onValueChange(element: HTMLInputElement) {
    const elementValue = element.value;
    this.value = elementValue.length == 0 ? null : elementValue;
    this.onChange(this.value);
    this.onTouch();
  }

  onChange: any = () => {};
  onTouch: any = () => {};

  writeValue(obj: string): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
