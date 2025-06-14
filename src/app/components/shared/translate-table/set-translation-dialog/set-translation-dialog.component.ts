import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BaseFormComponent } from '../../../../core/bases/base-form.component';
import { SelectItemModel } from '../../../../core/models/select-item.model';
import { ITranslationForm } from '../../../../modules/shop-module/core/form/i-translation.form';
import { ButtonComponent } from '../../button/button.component';
import { InputSelectComponent } from '../../input-select/input-select.component';
import { InputComponent } from '../../input/input.component';

@Component({
  selector: 'app-set-translation-dialog',
  imports: [ReactiveFormsModule, TranslateModule, ButtonComponent, InputComponent, InputSelectComponent],
  templateUrl: './set-translation-dialog.component.html',
  styleUrl: './set-translation-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetTranslationDialogComponent extends BaseFormComponent<ITranslationForm> {
  langItems = input.required<SelectItemModel[]>();

  submit(): void {}

  protected override setGroup(): FormGroup<ITranslationForm> {
    return this._formBuilder.group<ITranslationForm>({
      id: new FormControl(null),
      lang: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      translation: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    });
  }
}
