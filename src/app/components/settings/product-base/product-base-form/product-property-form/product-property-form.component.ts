import { ChangeDetectionStrategy, Component, inject, Injector, input, output, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../../../../environments/environment';
import { BaseFormComponent } from '../../../../../core/bases/base-form.component';
import { ProductParameterFormModel } from '../../../../../core/models/product-parameter.form-model';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { InputComponent } from '../../../../shared/input/input.component';

@Component({
    selector: 'app-product-property-form',
    templateUrl: './product-property-form.component.html',
    styleUrl: './product-property-form.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule, TranslateModule, InputComponent, ButtonComponent]
})
export class ProductPropertyFormComponent extends BaseFormComponent {
  private readonly _injector = inject(Injector);

  editParameter = input<ProductParameterFormModel>();
  isDialogActive = input.required<boolean>();
  onSubmit = output<ProductParameterFormModel>();

  translations = signal<FormArray>(this.form.controls['translations'] as FormArray);
  constructor() {
    super();

    toObservable(this.isDialogActive, { injector: this._injector }).subscribe({
      next: response => {
        if (!response) {
          return;
        }

        const parameter = this.editParameter();

        if (parameter) {
          this.form.controls['id'].setValue(parameter.id);
          this.form.controls['name'].setValue(parameter.name);

          const translations = environment.availableLangs.map(lang => {
            const transaltion = parameter.translations.find(x => x.lang == lang);
            if (transaltion) {
              return this._formBuilder.group({
                id: [transaltion.id],
                lang: [lang, [Validators.required]],
                translation: [transaltion.translation],
              });
            } else {
              return this._formBuilder.group({
                id: [null],
                lang: [lang, [Validators.required]],
                translation: [null],
              });
            }
          });

          this.form.setControl('translations', this._formBuilder.array(translations));
          this.translations.set(this.form.controls['translations'] as FormArray);
        } else {
          this.form.reset();
          const translations = environment.availableLangs.map(lang => {
            return this._formBuilder.group({
              id: [null],
              lang: [lang, [Validators.required]],
              translation: [null],
            });
          });

          this.form.setControl('translations', this._formBuilder.array(translations));
          this.translations.set(this.form.controls['translations'] as FormArray);
        }
      },
    });
  }

  submit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.onSubmit.emit(new ProductParameterFormModel(this.form.value, this.editParameter()?.index ?? 0));

    this.form.reset();
  }

  protected override setFormControls(): {} {
    return {
      id: [null],
      name: [null, [Validators.required]],
      translations: new FormArray([]),
    };
  }
}
