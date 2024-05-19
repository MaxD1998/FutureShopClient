import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseFormComponent } from '../../../../../core/bases/base-form.component';
import { SelectItemModel } from '../../../../../core/models/select-item.model';
import { InputSelectComponent } from '../../../../shared/input-select/input-select.component';

@Component({
  selector: 'app-category-form-dialog-window-content',
  standalone: true,
  templateUrl: './category-form-dialog-window-content.component.html',
  styleUrl: './category-form-dialog-window-content.component.css',
  imports: [InputSelectComponent, ReactiveFormsModule],
})
export class CategoryFormDialogWindowContentComponent extends BaseFormComponent {
  @Input() items: SelectItemModel[] = [];

  @Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onValueChange: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
    super();

    this.form.controls['language'].valueChanges.subscribe({
      next: response => {
        this.onClose.emit(false);

        if (response) {
          this.onValueChange.emit(response);
          setTimeout(() => {
            this.form.reset();
          });
        }
      },
    });
  }

  protected override setFormControls(): {} {
    return {
      language: [null, Validators.required],
    };
  }
}
