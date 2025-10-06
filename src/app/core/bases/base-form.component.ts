import { inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

export abstract class BaseFormComponent<T extends { [K in keyof T]: AbstractControl<any> } = any> {
  protected readonly _formBuilder = inject(FormBuilder);
  protected readonly _translateService = inject(TranslateService);

  form: FormGroup<T> = this.setGroup();

  errorCode(field: string, arrayName?: string, formGroupName?: string): string {
    const control = !arrayName
      ? this.form.get(field)
      : !formGroupName
        ? (this.form.get(arrayName) as FormArray).get(field)
        : ((this.form.get(arrayName) as FormArray).get(formGroupName) as FormGroup).get(field);

    const error = control?.errors;

    if (control && control.touched && error) {
      const entries = Object.entries(error);
      const [key] = entries[0];

      switch (key) {
        case 'min':
          console.log(error);
          console.log(entries);
          return this._translateService.instant(`validation-errors.${key}`);
        case 'max':
          return this._translateService.instant(`validation-errors.${key}`);
        default:
          return this._translateService.instant(`validation-errors.${key}`);
      }
    }

    return '';
  }

  protected abstract setGroup(): FormGroup<T>;
}
