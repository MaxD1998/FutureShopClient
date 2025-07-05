import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  Provider,
  ViewChild,
  afterNextRender,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { tap } from 'rxjs';

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
  providers: [CUSTOM_VALUE_ACCESSOR],
})
export class InputDateComponent implements ControlValueAccessor {
  private readonly _injector = inject(Injector);

  autocomplete = input<string>();
  errorCode = input<string | null>();
  label = input<string>();
  required = input<boolean>(false);

  internalValue = signal<string>('');
  value: Date | null = null;

  error$ = toObservable(this.errorCode, { injector: this._injector }).pipe(
    tap(errorCode => {
      const errorOutline = 'outline-red-600';
      const errorFocusOutline = 'focus:outline-red-600!';

      if (!!errorCode) {
        this.input.nativeElement.classList.add(errorOutline);
        this.input.nativeElement.classList.add(errorFocusOutline);
      } else {
        if (this.input.nativeElement.classList.contains(errorOutline)) {
          this.input.nativeElement.classList.remove(errorOutline);
        }

        if (this.input.nativeElement.classList.contains(errorFocusOutline)) {
          this.input.nativeElement.classList.remove(errorFocusOutline);
        }
      }
    }),
  );

  @ViewChild('input') input: ElementRef;

  constructor() {
    afterNextRender(() => {
      this.error$.subscribe();
    });
  }

  onValueChange(element: HTMLInputElement) {
    this.transform(element);
    this.onChange(this.value);
    this.onTouch();
  }

  onChange: any = () => {};
  onTouch: any = () => {};

  writeValue(obj: Date | null): void {
    if (!!obj) {
      this.value = new Date(obj);
      const date = new Date(obj);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      this.internalValue.set(`${day}-${month}-${year}`);
    } else {
      this.value = null;
      this.internalValue.set('');
    }
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
      element.value = this.internalValue();
      return;
    }

    if (this.internalValue.length > value.length) {
      this.internalValue.set(value);
      return;
    }

    if (value.length == 2 || value.length == 5) {
      value += '-';
    } else if (value.length == 10) {
      const [tempDay, tempMonth, year] = value.split('-').map(Number);
      const month = tempMonth > 12 ? 12 : tempMonth;
      const daysInMonth = this.getDaysInMonth(month, year);
      const day = tempDay > daysInMonth ? daysInMonth : tempDay;

      this.internalValue.set(`${day > 9 ? day : '0' + day}-${month > 9 ? month : '0' + month}-${year}`);
      this.value = new Date(Date.UTC(year, month - 1, day));
      return;
    }

    this.internalValue.set(value);
  }

  private getDaysInMonth(month: number, year: number) {
    if (month == 0 || month > 12) {
      return 1;
    }

    var days: number[] = [
      31, //styczeń
      this.isLeapYear(year) ? 29 : 28, //luty
      31, //marzec
      30, //kwiecien
      31, //maj
      30, //czerwiec
      31, //lipiec
      31, //sierpień
      30, //wrzesień
      31, //paździenik
      30, //listopad
      31, //grudzień
    ];

    return days[month - 1];
  }

  private isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }
}
