import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  inject,
  Injector,
  input,
  model,
  Provider,
  ViewChild,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { tap } from 'rxjs';
import { InputType } from '../../../core/enums/input-type';
import { InputComponent } from '../input/input.component';

const CUSTOM_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputComponent),
  multi: true,
};

@Component({
  selector: 'app-input-area',
  imports: [],
  templateUrl: './input-area.component.html',
  styleUrl: './input-area.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CUSTOM_VALUE_ACCESSOR],
})
export class InputAreaComponent {
  private readonly _injector = inject(Injector);

  errorCode = input<string>();
  label = input<string>();
  isDisabled = input<boolean>(false);
  placeholder = input<string>('');
  required = input<boolean>(false);
  type = input<string>(InputType.text);
  value = model<string | null>(null);

  error$ = toObservable(this.errorCode, { injector: this._injector }).pipe(
    tap(errorCode => {
      const errorOutline = 'outline-red-600';
      const errorFocusOutline = 'focus:outline-red-600!';

      if (!!errorCode) {
        this.textarea.nativeElement.classList.add(errorOutline);
        this.textarea.nativeElement.classList.add(errorFocusOutline);
      } else {
        if (this.textarea.nativeElement.classList.contains(errorOutline)) {
          this.textarea.nativeElement.classList.remove(errorOutline);
        }

        if (this.textarea.nativeElement.classList.contains(errorFocusOutline)) {
          this.textarea.nativeElement.classList.remove(errorFocusOutline);
        }
      }
    }),
  );

  @ViewChild('textarea') textarea: ElementRef;

  constructor() {
    afterNextRender(() => {
      this.error$.subscribe();
    });
  }

  autoResize(element: HTMLTextAreaElement): void {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  }

  onValueChange(element: HTMLTextAreaElement): void {
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
