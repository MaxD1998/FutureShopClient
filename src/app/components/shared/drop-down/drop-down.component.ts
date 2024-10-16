import { ChangeDetectionStrategy, Component, ElementRef, HostListener, input, signal, ViewChild } from '@angular/core';

@Component({
  selector: 'app-drop-down',
  standalone: true,
  imports: [],
  templateUrl: './drop-down.component.html',
  styleUrl: './drop-down.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropDownComponent {
  @ViewChild('dropdown') dropdown: ElementRef;

  isVisible = input<boolean>(true);

  style = signal<string>('');

  constructor() {}

  @HostListener('window:resize', ['$event'])
  checkDropdownPosition(): void {
    if (!this.isVisible()) {
      return;
    }

    const rect = this.dropdown.nativeElement.getBoundingClientRect();
    console.log(rect);
    const windowWidth = window.innerWidth;
    console.log(windowWidth);

    if (rect.left >= 0 && rect.right <= windowWidth) {
      this.style.set('left-0');
    } else if (rect.right > windowWidth) {
      this.style.set('right-0');
    } else {
      this.style.set('left-0');
    }
    console.log(this.style());
  }
}
