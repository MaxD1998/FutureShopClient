import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Injector,
  input,
  ViewChild,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { IconType } from '../../../core/enums/icon-type';

@Component({
  selector: 'app-icon',
  imports: [],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  private readonly _injector = inject(Injector);

  iconName = input.required<IconType>();
  iconStyle = input<string>();

  @ViewChild('svg') svg: ElementRef;

  IconType: typeof IconType = IconType;

  style$ = toObservable(this.iconStyle, { injector: this._injector }).pipe(
    tap(style => {
      if (!style) {
        return;
      }

      this.svg.nativeElement.classList.remove('size-6');

      const classes = style.split(' ');

      classes.forEach(x => {
        this.svg.nativeElement.classList.add(x);
      });
    }),
  );

  constructor() {
    afterNextRender(() => {
      this.style$.subscribe();
    });
  }
}
