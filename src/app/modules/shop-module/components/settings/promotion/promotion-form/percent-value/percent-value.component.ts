import { afterNextRender, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputNumberComponent } from '../../../../../../../components/shared/input-number/input-number.component';
import { BaseFormComponent } from '../../../../../../../core/bases/base-form.component';
import { IPromotionForm } from '../promotion-form.component';

export interface IPercentValueForm {
  percent: FormControl<number | null>;
}

@Component({
  selector: 'app-percent-value',
  imports: [ReactiveFormsModule, TranslateModule, InputNumberComponent],
  templateUrl: './percent-value.component.html',
  styleUrl: './percent-value.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PercentValueComponent extends BaseFormComponent<IPercentValueForm> {
  formGroup = input.required<FormGroup<IPromotionForm>>();
  isInit = input.required<boolean>();

  constructor() {
    super();
    afterNextRender(() => {
      if (this.isInit()) {
        const { value } = this.formGroup().getRawValue();
        this.form.patchValue({ percent: value['percent'] });
      }

      this.formGroup().setControl('value', this.form);
    });
  }

  protected override setGroup(): FormGroup<IPercentValueForm> {
    return this._formBuilder.group<IPercentValueForm>({
      percent: new FormControl(null, { validators: [Validators.required, Validators.min(1), Validators.max(100)] }),
    });
  }
}
