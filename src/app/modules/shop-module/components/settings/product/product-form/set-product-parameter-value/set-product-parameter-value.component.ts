import { ChangeDetectionStrategy, Component, inject, Injector, input, output } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../../../../components/shared/button/button.component';
import { InputComponent } from '../../../../../../../components/shared/input/input.component';
import { BaseFormComponent } from '../../../../../../../core/bases/base-form.component';
import { IProductForm } from '../product-form.component';

interface IValueForm {
  id: FormControl<string>;
  value: FormControl<string>;
}

@Component({
  selector: 'app-set-product-parameter-value',
  imports: [ReactiveFormsModule, TranslateModule, InputComponent, ButtonComponent],
  templateUrl: './set-product-parameter-value.component.html',
  styleUrl: './set-product-parameter-value.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetProductParameterValueComponent extends BaseFormComponent<IValueForm> {
  private readonly _injector = inject(Injector);

  mainForm = input.required<FormGroup<IProductForm>>();
  productParameterId = input<string>();

  onSave = output();

  constructor() {
    super();

    toObservable(this.productParameterId, { injector: this._injector }).subscribe({
      next: productParameterId => {
        if (productParameterId) {
          const productParameterValues = this.mainForm().getRawValue().productParameterValues;
          const productParameterValue = productParameterValues.find(x => x.productParameterId == productParameterId);

          this.form.patchValue({ id: productParameterValue?.productParameterId, value: productParameterValue?.value });
        } else {
          this.form.reset();
        }
      },
    });
  }

  submit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const productParameterId = this.productParameterId();

    if (!productParameterId) {
      return;
    }

    const { productParameterValues } = this.mainForm().getRawValue();
    const index = productParameterValues.findIndex(x => x.productParameterId == productParameterId);

    if (index >= 0) {
      const record = this.mainForm().controls.productParameterValues.controls.at(index)!;
      const { id, productParameterId, productParameterName } = record.getRawValue();
      const { value } = this.form.getRawValue();
      record.patchValue({ id, productParameterId, productParameterName, value: value });
    }

    this.onSave.emit();
    this.form.reset();
  }

  protected override setGroup(): FormGroup<IValueForm> {
    return this._formBuilder.group<IValueForm>({
      id: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      value: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    });
  }
}
