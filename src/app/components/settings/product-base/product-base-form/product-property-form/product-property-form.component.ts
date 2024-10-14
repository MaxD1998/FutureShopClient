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
  standalone: true,
  templateUrl: './product-property-form.component.html',
  styleUrl: './product-property-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TranslateModule, InputComponent, ButtonComponent],
})
export class ProductPropertyFormComponent extends BaseFormComponent {
  private readonly _injector = inject(Injector);

  editParameter = input<ProductParameterFormModel>();
  onSubmit = output<ProductParameterFormModel>();

  translations = signal<FormArray>(this.form.controls['translations'] as FormArray);

  editParameter$ = toObservable(this.editParameter, { injector: this._injector });

  constructor() {
    super();

    this.editParameter$.subscribe({
      next: response => {
        if (response) {
          this.form.controls['id'].setValue(response.id);
          this.form.controls['name'].setValue(response.name);

          const translations = environment.availableLangs.map(lang => {
            const transaltion = response.translations.find(x => x.lang == lang);
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
