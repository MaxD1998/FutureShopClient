import { inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

export abstract class BaseFormComponent {
  protected readonly _formBuilder = inject(FormBuilder);

  form: FormGroup = this._formBuilder.group(this.setFormControls());

  errorCode(field: string, arrayName?: string, formGroupName?: string): string {
    const control = !arrayName
      ? this.form.controls[field]
      : !formGroupName
        ? (this.form.controls[arrayName] as FormArray).get(field)
        : ((this.form.controls[arrayName] as FormArray).get(formGroupName) as FormGroup).get(field);

    const error = control?.errors;

    if (control && control.touched && error) {
      const entries = Object.entries(error);
      const [key] = entries[0];
      return `validation-errors.${key}`;
    }

    return '';
  }

  protected abstract setFormControls(): {};
}
