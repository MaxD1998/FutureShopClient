import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  Provider,
  ViewChild,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SelectItemModel } from '../../../core/models/select-item.model';

const CUSTOM_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputSelectComponent),
  multi: true,
};

@Component({
  selector: 'app-input-select',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './input-select.component.html',
  styleUrl: './input-select.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CUSTOM_VALUE_ACCESSOR],
})
export class InputSelectComponent implements ControlValueAccessor {
  @Input() errorCode: string | null = null;
  @Input() items: SelectItemModel[] = [];
  @Input() label: string = '';
  @Input() required: boolean = false;

  @ViewChild('selectBox', { read: ElementRef }) selectBox: ElementRef;

  private _firstItem: SelectItemModel = {
    value: 'common.input-select.select-option',
  };

  isDropdownVisible: boolean = false;
  selectedItem: SelectItemModel = this._firstItem;
  selectedId?: string = undefined;

  get dropdownItems(): SelectItemModel[] {
    if (!this.items.some(x => x.id == this.selectedItem.id) && this.selectedItem.id) {
      const array = [this.selectedItem].concat(this.items).sort((a, b) => {
        if (a.value < b.value) {
          return -1;
        }
        if (a.value > b.value) {
          return 1;
        }
        return 0;
      });

      return this.required ? array : [this._firstItem].concat(array);
    }

    const array = this.items.sort((a, b) => {
      if (a.value < b.value) {
        return -1;
      }
      if (a.value > b.value) {
        return 1;
      }
      return 0;
    });

    return this.required ? array : [this._firstItem].concat(array);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (!this.selectBox.nativeElement.contains(event.target) && this.isDropdownVisible) {
      this.isDropdownVisible = false;
      this.onTouch();
    }
  }

  setItem(item: SelectItemModel): void {
    this.writeValue(item.id);
    this.onChange(item.id);
    this.onTouch();
    this.setVisible();
  }

  setVisible(): void {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  writeValue(id?: string): void {
    this.selectedItem = this.dropdownItems.find(x => x.id == id) ?? this._firstItem;
    this.selectedId = id;
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
