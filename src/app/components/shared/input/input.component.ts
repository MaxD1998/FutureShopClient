import { CommonModule } from '@angular/common';
import { Component, Input, Provider, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

const CUSTOM_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputComponent),
  multi: true,
};

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  providers: [CUSTOM_VALUE_ACCESSOR],
})
export class InputComponent implements ControlValueAccessor {
  @Input() errorCode: string | null;
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = '';

  value: string = '';

  onValueChange(element: HTMLInputElement) {
    this.value = element.value;
    this.onChange(this.value);
    this.onTouch(this.value);
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
