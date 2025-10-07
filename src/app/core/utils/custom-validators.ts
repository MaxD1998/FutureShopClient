import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static notWhiteCharackters(control: AbstractControl): ValidationErrors | null {
    const regex = new RegExp(/\s/);
    const value = control.value as string;
    if (regex.test(value)) {
      return { 'not-white-charackters': true };
    }

    return null;
  }

  static equal(fieldName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value === control.parent?.get(fieldName)?.value ? null : { equal: true };
    };
  }

  static arrayIsNotEmpty(arrayName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const array = control.parent?.get(arrayName) as FormArray;
      return !control.value || array?.length > 0 ? null : { arrayEmpty: { arrayEmpty: arrayName } };
    };
  }
}
