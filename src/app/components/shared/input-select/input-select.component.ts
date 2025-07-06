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
  model,
  signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { tap } from 'rxjs';
import { SelectItemModel } from '../../../core/models/select-item.model';

const CUSTOM_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputSelectComponent),
  multi: true,
};

@Component({
  selector: 'app-input-select',
  imports: [TranslateModule],
  templateUrl: './input-select.component.html',
  styleUrl: './input-select.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CUSTOM_VALUE_ACCESSOR],
})
export class InputSelectComponent implements ControlValueAccessor {
  private readonly _injector = inject(Injector);

  items = input.required<SelectItemModel[]>();

  errorCode = input<string | null>();
  isDisabled = input<boolean>(false);
  label = input<string>();
  required = input<boolean>(false);
  value = model<string | undefined>();

  isDropdownVisible = signal<boolean>(false);
  isFocus = signal<boolean>(false);

  error$ = toObservable(this.errorCode, { injector: this._injector }).pipe(
    tap(errorCode => {
      const errorOutline = 'outline-red-600';
      const errorFocusOutline = 'focus:outline-red-600';

      if (!!errorCode) {
        this.select.nativeElement.classList.add(errorOutline);
        this.select.nativeElement.classList.add(errorFocusOutline);
      } else {
        if (this.select.nativeElement.classList.contains(errorOutline)) {
          this.select.nativeElement.classList.remove(errorOutline);
        }

        if (this.select.nativeElement.classList.contains(errorFocusOutline)) {
          this.select.nativeElement.classList.remove(errorFocusOutline);
        }
      }
    }),
  );

  @ViewChild('select') select: ElementRef;

  constructor() {
    afterNextRender(() => {
      this.error$.subscribe();
    });
  }

  onValueChange(element: HTMLSelectElement): void {
    this.value.set(element.value === '' ? undefined : element.value);
    this.onChange(this.value() ?? null);
    this.onTouch();
  }

  writeValue(value: string): void {
    this.value.set(value);
  }

  onChange: any = () => {};
  onTouch: any = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
