import { FormBuilder, FormGroup } from '@angular/forms';

export abstract class BaseFormComponent {
  form: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
    this.initForm();
  }

  errorCode(field: string): string | null {
    const control = this.form.controls[field];
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
