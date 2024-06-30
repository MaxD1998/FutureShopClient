import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormArray, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../../../../environments/environment';
import { BaseFormComponent } from '../../../../../core/bases/base-form.component';
import { ProductParameterFormDto } from '../../../../../core/dtos/product-parameter.form-dto';
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
  editParameter = input<ProductParameterFormDto>();
  onSubmit = output<ProductParameterFormDto>();

  translations = signal<FormArray>(this.form.controls['translations'] as FormArray);

  editParameter$ = toObservable(this.editParameter);

  constructor() {
    super();
    this.setLangs();

    this.editParameter$.subscribe({
      next: response => {
        if (response) {
          this.form.controls['name'].setValue(response.name);
          this.translations.update(x => {
            (x.controls as FormGroup[]).forEach(y => {
              const transaltion = response.translations.find(z => z.lang == y.controls['lang'].value);
              if (transaltion) {
                y.controls['translation'].setValue(transaltion.translation);
              }
            });

            return x;
          });
        }
      },
    });
  }

  submit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const translations = this.form.controls['translations'].value as { lang: string; translation: string }[];
    const result: ProductParameterFormDto = {
      name: this.form.controls['name'].value,
      translations: translations.filter(x => !!x.translation),
    };

    this.onSubmit.emit(result);
    this.form.reset();
    this.translations().clear();
    this.setLangs();
  }

  private setLangs(): void {
    environment.availableLangs.forEach(x => {
      this.translations.update(y => {
        y.push(
          this._formBuilder.group({
            lang: [x, [Validators.required]],
            translation: [null],
          }),
        );
        return y;
      });
    });
  }

  protected override setFormControls(): {} {
    return {
      name: [null, [Validators.required]],
      translations: new FormArray([]),
    };
  }
}
