import { ChangeDetectionStrategy, Component, inject, Injector, input, output } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BaseFormComponent } from '../../../../../core/bases/base-form.component';
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

  productParameter = input.required<{ productParameterId: string; value?: string }>();

  onSave = output<{ productParameterId: string; value: string }>();

  constructor() {
    super();

    toObservable(this.productParameter, { injector: this._injector }).subscribe({
      next: productParameter => {
        const value = productParameter.value;

        if (value) {
          this.form.controls['value'].setValue(value);
        }
      },
    });
  }

  submit(): void {
    this.onSave.emit({
      productParameterId: this.productParameter().productParameterId,
      value: this.form.controls['value'].value,
    });
  }

  protected override setFormControls(): {} {
    return {
      value: [null, [Validators.required]],
    };
  }
}
