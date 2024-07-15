import { ChangeDetectionStrategy, Component, input, OnDestroy, output } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { BaseFormComponent } from '../../../../../core/bases/base-form.component';
import { SelectItemModel } from '../../../../../core/models/select-item.model';
import { InputSelectComponent } from '../../../../shared/input-select/input-select.component';

@Component({
  selector: 'app-set-product-base-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, InputSelectComponent],
  templateUrl: './set-product-base-form.component.html',
  styleUrl: './set-product-base-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetProductBaseFormComponent extends BaseFormComponent implements OnDestroy {
  private readonly _unsubscribe: Subject<void> = new Subject<void>();

  items = input.required<SelectItemModel[]>();

  onValueChange = output<SelectItemModel>();

  constructor() {
    super();

    this.form.controls['productBaseId'].valueChanges.pipe(takeUntil(this._unsubscribe)).subscribe({
      next: reponse => {
        const item = this.items().find(x => x.id == reponse);

        if (item) {
          this.onValueChange.emit(item);
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
      productBaseId: [null, [Validators.required]],
    };
  }
}
