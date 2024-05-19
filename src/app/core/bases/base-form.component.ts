import { inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

export abstract class BaseFormComponent {
  protected readonly _formBuilder = inject(FormBuilder);

  form: FormGroup;

  constructor() {
    this.initForm();
  }

  errorCode(field: string, arrayName?: string, formGroupName?: string): string | null {
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

    return null;
  }

  protected abstract setFormControls(): {};

  private initForm(): void {
    const controls = this.setFormControls();
    this.form = this._formBuilder.group(controls);
  }
}
