import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  Injector,
  model,
  signal,
  ViewChild,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-drop-down',
  imports: [],
  templateUrl: './drop-down.component.html',
  styleUrl: './drop-down.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropDownComponent {
  private readonly _injector = inject(Injector);
  private _isOpen: boolean = false;

  @ViewChild('dropdown') dropdown: ElementRef;
  @ViewChild('parentDiv') parentDiv: ElementRef;

  isVisible = model<boolean>(false);

  style = signal<string>('');

  constructor() {
    afterNextRender(() => {
      this.checkDropdownPosition();
    });

    toObservable(this.isVisible, { injector: this._injector }).subscribe({
      next: value => {
        if (value) {
          this._isOpen = false;
        }
      },
    });
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (this._isOpen && this.dropdown && this.isVisible()) {
      const rect = this.dropdown.nativeElement.getBoundingClientRect();
      const isOverX = event.clientX < rect.left || rect.right < event.clientX;
      const isOverY = event.clientY < rect.top || rect.bottom < event.clientY;

      if (isOverX || isOverY) {
        this.isVisible.set(false);
      }
    }

    if (!this._isOpen) {
      this._isOpen = true;
    }
  }

  @HostListener('window:resize', ['$event'])
  checkDropdownPosition(): void {
    if (!this.isVisible()) {
      return;
    }

    const parentRect = this.parentDiv.nativeElement.getBoundingClientRect();
    const rect = this.dropdown.nativeElement.getBoundingClientRect();
    const windowWidth = window.innerWidth;

    if (parentRect.left >= 0 && parentRect.left + rect.width <= windowWidth) {
      this.style.set('left-2/4 translate-x-minus-2/4');
    } else if (parentRect.left + rect.width > windowWidth) {
      this.style.set('right-0');
    } else {
      this.style.set('left-0');
    }
  }
}
