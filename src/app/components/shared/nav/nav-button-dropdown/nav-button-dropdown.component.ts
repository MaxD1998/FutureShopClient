import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, input, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconType } from '../../../../core/enums/icon-type';
import { DropDownListItemModel } from '../../../../core/models/drop-down-list-item.model';
import { DropDownListComponent } from '../../drop-down-list/drop-down-list.component';
import { IconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-nav-button-dropdown',
  imports: [RouterModule, IconComponent, DropDownListComponent],
  templateUrl: './nav-button-dropdown.component.html',
  styleUrl: './nav-button-dropdown.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavButtonDropdownComponent {
  private readonly _elementRef = inject(ElementRef);

  iconName = input.required<IconType>();
  items = input.required<DropDownListItemModel[]>();

  isOpen = signal<boolean>(false);

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this._elementRef.nativeElement.contains(event.target) && this.isOpen()) {
      this.isOpen.set(false);
    }
  }
}
