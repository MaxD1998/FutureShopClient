import { ChangeDetectionStrategy, Component, inject, Injector, input, output } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BaseFormComponent } from '../../../../../core/bases/base-form.component';
import { ProductParameterValueFormDto } from '../../../../../core/dtos/product-parameter-value.form-dto';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { InputComponent } from '../../../../shared/input/input.component';

@Component({
  selector: 'app-set-product-parameter-value',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, InputComponent, ButtonComponent],
  templateUrl: './set-product-parameter-value.component.html',
  styleUrl: './set-product-parameter-value.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetProductParameterValueComponent extends BaseFormComponent {
  private readonly _injector = inject(Injector);

  productParameter = input<ProductParameterValueFormDto>();

  onSave = output<ProductParameterValueFormDto>();

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
    const productParameter = this.productParameter();
    if (productParameter) {
      this.onSave.emit({
        id: productParameter.id,
        productParameterId: productParameter.productParameterId,
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
