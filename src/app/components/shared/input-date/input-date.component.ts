import { ChangeDetectionStrategy, Component, Provider, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

const CUSTOM_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputDateComponent),
  multi: true,
};

@Component({
    selector: 'app-input-date',
    imports: [TranslateModule],
    templateUrl: './input-date.component.html',
    styleUrl: './input-date.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [CUSTOM_VALUE_ACCESSOR]
})
export class InputDateComponent implements ControlValueAccessor {
  autocomplete = input<string>();
  errorCode = input<string | null>();
  label = input<string>();
  required = input<boolean>(false);

  internalValue: string = '';
  value: Date | null = null;

  onValueChange(element: HTMLInputElement) {
    this.transform(element);
    this.onChange(this.value);
    this.onTouch();
  }

  onChange: any = () => {};
  onTouch: any = () => {};

  writeValue(obj: Date): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  transform(element: HTMLInputElement) {
    let value = element.value;

    if (value.length == 0) {
      this.value = null;
      return;
    }

    const regex = /^-?\d+$/; //tylko cyfry

    if (value.length != 0 && !regex.test(value.replaceAll('-', ''))) {
      element.value = this.internalValue;
      return;
    }

    if (this.internalValue.length > value.length) {
      this.internalValue = value;
      return;
    }

    if (value.length == 2 || value.length == 5) {
      value += '-';
    } else if (value.length == 10) {
      const [tempDay, tempMonth, year] = value.split('-').map(Number);
      const month = tempMonth > 12 ? 12 : tempMonth;
      const daysInMonth = this.getDaysInMonth(month, year);
      const day = tempDay > daysInMonth ? daysInMonth : tempDay;

      this.internalValue = `${day > 9 ? day : '0' + day}-${month > 9 ? month : '0' + month}-${year}`;
      this.value = new Date(Date.UTC(year, month - 1, day));
      return;
    }

    this.internalValue = value;
  }

  private getDaysInMonth(month: number, year: number) {
    if (month == 0 || month > 12) {
      return 1;
    }

    var days: number[] = [
      31, //styczen
      this.isLeapYear(year) ? 29 : 28, //luty
      31, //marzec
      30, //kwiecien
      31, //maj
      30, //czerwiec
      31, //lipiec
      31, //sierpien
      30, //wrzesień
      31, //pażdzienik
      30, //listopad
      31, //grudzien
    ];

    return days[month - 1];
  }

  private isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }
}
