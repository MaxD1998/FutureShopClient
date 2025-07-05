import { ChangeDetectionStrategy, Component, inject, Injector, input, output } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../../../../../../environments/environment';
import { ButtonComponent } from '../../../../../../../components/shared/button/button.component';
import { InputComponent } from '../../../../../../../components/shared/input/input.component';
import { BaseFormComponent } from '../../../../../../../core/bases/base-form.component';
import { ITranslationForm } from '../../../../../core/form/i-translation.form';
import { ProductParameterFormModel } from '../../../../../core/models/product-parameter.form-model';

interface IProductPropertyForm {
  id: FormControl<string | null>;
  name: FormControl<string>;
  translations: FormArray<FormGroup<ITranslationForm>>;
}

@Component({
  selector: 'app-product-property-form',
  templateUrl: './product-property-form.component.html',
  styleUrl: './product-property-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TranslateModule, InputComponent, ButtonComponent],
})
export class ProductPropertyFormComponent extends BaseFormComponent<IProductPropertyForm> {
  private readonly _injector = inject(Injector);

  editParameter = input<ProductParameterFormModel>();
  isDialogActive = input.required<boolean>();
  onSubmit = output<ProductParameterFormModel>();

  constructor() {
    super();

    toObservable(this.isDialogActive, { injector: this._injector }).subscribe({
      next: response => {
        if (!response) {
          return;
        }

        this.form.reset();
        this.form.controls.translations.clear();
        const parameter = this.editParameter();

        if (parameter) {
          const { id, name } = parameter;
          this.form.patchValue({ id, name });
        }

        const translations = environment.availableLangs.map(lang => {
          const translation = parameter?.translations.find(x => x.lang === lang);
          return this._formBuilder.group<ITranslationForm>({
            id: new FormControl(translation?.id ?? null),
            lang: new FormControl(lang, { nonNullable: true, validators: [Validators.required] }),
            translation: new FormControl(translation?.translation ?? null),
          });
        });

        this.form.setControl('translations', this._formBuilder.array(translations));
      },
    });
  }

  submit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const { id, name, translations } = this.form.getRawValue();
    this.onSubmit.emit({
      id: id ?? undefined,
      index: this.editParameter()?.index ?? 0,
      name,
      translations: translations
        .filter(x => !!x.translation)
        .map(x => ({ id: x.id ?? undefined, lang: x.lang, translation: x.translation! })),
    });

    this.form.reset();
  }

  protected override setGroup(): FormGroup<IProductPropertyForm> {
    return this._formBuilder.group<IProductPropertyForm>({
      id: new FormControl(null),
      name: new FormControl('', { nonNullable: true }),
      translations: new FormArray<FormGroup<ITranslationForm>>([]),
    });
  }
}
