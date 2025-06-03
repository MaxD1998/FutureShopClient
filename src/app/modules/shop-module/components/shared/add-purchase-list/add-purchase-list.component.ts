import { ChangeDetectionStrategy, Component, inject, Injector, input, output } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { tap } from 'rxjs';
import { ButtonComponent } from '../../../../../components/shared/button/button.component';
import { InputComponent } from '../../../../../components/shared/input/input.component';
import { BaseFormComponent } from '../../../../../core/bases/base-form.component';

interface IAddPurchaseListForm {
  name: FormControl<string>;
}

@Component({
  selector: 'app-add-purchase-list',
  imports: [ReactiveFormsModule, TranslateModule, InputComponent, ButtonComponent],
  templateUrl: './add-purchase-list.component.html',
  styleUrl: './add-purchase-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPurchaseListComponent extends BaseFormComponent<IAddPurchaseListForm> {
  private readonly _injector = inject(Injector);

  isDialogActive = input.required<boolean>();

  onSubmit = output<string>();

  constructor() {
    super();

    toObservable(this.isDialogActive, { injector: this._injector }).pipe(
      tap(value => {
        if (!value) {
          this.form.reset();
        }
      }),
    );
  }

  submit(): void {
    if (this.form.valid) {
      this.onSubmit.emit(this.form.getRawValue().name);
    }
  }

  protected override setGroup(): FormGroup<IAddPurchaseListForm> {
    return this._formBuilder.group<IAddPurchaseListForm>({
      name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    });
  }
}
