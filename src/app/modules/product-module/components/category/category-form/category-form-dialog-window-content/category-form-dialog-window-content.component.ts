import { ChangeDetectionStrategy, Component, input, OnDestroy, output } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { InputSelectComponent } from '../../../../../../components/shared/input-select/input-select.component';
import { BaseFormComponent } from '../../../../../../core/bases/base-form.component';
import { IdNameDto } from '../../../../../../core/dtos/id-name.dto';
import { SelectItemModel } from '../../../../../../core/models/select-item.model';

@Component({
  selector: 'app-category-form-dialog-window-content',
  templateUrl: './category-form-dialog-window-content.component.html',
  styleUrl: './category-form-dialog-window-content.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputSelectComponent, ReactiveFormsModule],
})
export class CategoryFormDialogWindowContentComponent extends BaseFormComponent implements OnDestroy {
  private readonly _unsubscribe: Subject<void> = new Subject<void>();

  items = input.required<SelectItemModel[]>();

  onClose = output<boolean>();
  onValueChange = output<IdNameDto>();

  constructor() {
    super();

    this.form.controls['subCategory'].valueChanges.subscribe({
      next: response => {
        this.onClose.emit(false);

        if (response) {
          const item = this.items().find(x => x.id == response);
          if (item && item.id) {
            this.onValueChange.emit({
              id: item.id,
              name: item.value,
            });
          }
          setTimeout(() => {
            this.form.reset();
          });
        }
      },
    });
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  protected override setFormControls(): {} {
    return {
      subCategory: [null, Validators.required],
    };
  }
}
