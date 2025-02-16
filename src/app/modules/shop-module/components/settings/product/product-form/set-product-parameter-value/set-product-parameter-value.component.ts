import { ChangeDetectionStrategy, Component, inject, Injector, input, output } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../../../../components/shared/button/button.component';
import { InputComponent } from '../../../../../../../components/shared/input/input.component';
import { BaseFormComponent } from '../../../../../../../core/bases/base-form.component';
import { IdValueDto } from '../../../../../../../core/dtos/id-value.dto';

@Component({
  selector: 'app-set-product-parameter-value',
  imports: [ReactiveFormsModule, TranslateModule, InputComponent, ButtonComponent],
  templateUrl: './set-product-parameter-value.component.html',
  styleUrl: './set-product-parameter-value.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetProductParameterValueComponent extends BaseFormComponent {
  private readonly _injector = inject(Injector);

  productParameter = input<IdValueDto>();

  onSave = output<IdValueDto>();

  constructor() {
    super();

    toObservable(this.productParameter, { injector: this._injector }).subscribe({
      next: productParameter => {
        if (productParameter) {
          const value = productParameter.value;

          if (value) {
            this.form.controls['value'].setValue(value);
          }
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

    const productParameter = this.productParameter();
    if (productParameter) {
      this.onSave.emit({
        id: productParameter.id,
        value: this.form.controls['value'].value,
      });
    }

    this.form.reset();
  }

  protected override setFormControls(): {} {
    return {
      value: [null, [Validators.required]],
    };
  }
}
