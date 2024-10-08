import { ChangeDetectionStrategy, Component, inject, Injector, input, output, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormArray, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
    this.setLangs();

    this.editParameter$.subscribe({
      next: response => {
        if (response) {
          this.form.controls['id'].setValue(response.id);
          this.form.controls['name'].setValue(response.name);
          this.translations.update(x => {
            (x.controls as FormGroup[]).forEach(y => {
              const transaltion = response.translations.find(z => z.lang == y.controls['lang'].value);
              if (transaltion) {
                y.controls['id'].setValue(transaltion.id);
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

    this.onSubmit.emit(new ProductParameterFormModel(this.form.value, this.editParameter()?.index ?? 0));
    this.form.reset();
    this.translations().clear();
    this.setLangs();
  }

  private setLangs(): void {
    environment.availableLangs.forEach(x => {
      this.translations.update(y => {
        y.push(
          this._formBuilder.group({
            id: [null],
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
      id: [null],
      name: [null, [Validators.required]],
      translations: new FormArray([]),
    };
  }
}
