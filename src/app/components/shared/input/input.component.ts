import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  Provider,
  ViewChild,
  afterRender,
  forwardRef,
  inject,
  input,
  model,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { tap } from 'rxjs';
import { InputType } from '../../../core/enums/input-type';

const CUSTOM_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputComponent),
  multi: true,
};

@Component({
  selector: 'app-input',
  imports: [],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CUSTOM_VALUE_ACCESSOR],
})
export class InputComponent implements ControlValueAccessor {
  private readonly _injector = inject(Injector);

  errorCode = input<string>();
  label = input<string>();
  isDisabled = input<boolean>(false);
  placeholder = input<string>('');
  required = input<boolean>(false);
  type = input<string>(InputType.text);
  value = model<string | null>();

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
    afterRender(() => {
      this.error$.subscribe();
    });
  }

  onValueChange(element: HTMLInputElement): void {
    this.value.set(element.value);
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
