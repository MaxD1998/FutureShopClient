import { ChangeDetectionStrategy, Component, input, OnDestroy, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { InputSelectComponent } from '../../../../../../components/shared/input-select/input-select.component';
import { SelectItemModel } from '../../../../../../components/shared/input-select/models/select-item.model';
import { BaseFormComponent } from '../../../../../../core/bases/base-form.component';
import { IdNameDto } from '../../../../../../core/dtos/id-name.dto';

interface ISubCategoryForm {
  subCategory: FormControl<string | null>;
}

@Component({
  selector: 'app-sub-category-form-dialog',
  templateUrl: './sub-category-form-dialog.html',
  styleUrl: './sub-category-form-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputSelectComponent, ReactiveFormsModule],
})
export class SubCategoryFormDialog extends BaseFormComponent<ISubCategoryForm> implements OnDestroy {
  private readonly _unsubscribe: Subject<void> = new Subject<void>();

  items = input.required<SelectItemModel[]>();

  onClose = output<boolean>();
  onValueChange = output<IdNameDto>();

  constructor() {
    super();

    this.form.controls.subCategory.valueChanges.pipe(takeUntil(this._unsubscribe)).subscribe({
      next: id => {
        this.onClose.emit(false);

        if (id) {
          const value = this.items().find(x => x.id == id);
          if (value) {
            this.onValueChange.emit({
              id: value.id!,
              name: value.value,
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

  protected override setGroup(): FormGroup<ISubCategoryForm> {
    return this._formBuilder.group<ISubCategoryForm>({
      subCategory: new FormControl(null, [Validators.required]),
    });
  }
}
