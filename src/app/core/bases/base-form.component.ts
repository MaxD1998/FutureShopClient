import { inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';

export abstract class BaseFormComponent<T extends { [K in keyof T]: AbstractControl<any> } = any> {
  protected readonly _formBuilder = inject(FormBuilder);

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
      return `validation-errors.${key}`;
    }

    return '';
  }

  protected abstract setGroup(): FormGroup<T>;
}
