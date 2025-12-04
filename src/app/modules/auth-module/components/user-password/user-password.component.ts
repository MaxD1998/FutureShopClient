import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../components/shared/button/button.component';
import { InputComponent } from '../../../../components/shared/input/input.component';
import { BaseFormComponent } from '../../../../core/bases/base-form.component';
import { InputType } from '../../../../core/enums/input-type';
import { CustomValidators } from '../../../../core/utils/custom-validators';
import { UserDataService } from '../../core/data-service/user.data-service';

interface IUserPassword {
  oldPassword: FormControl<string>;
  newPassword: FormControl<string>;
  repeatedPassword: FormControl<string>;
}

@Component({
  selector: 'app-user-password',
  imports: [ReactiveFormsModule, TranslateModule, TranslateModule, InputComponent, ButtonComponent],
  templateUrl: './user-password.component.html',
  styleUrl: './user-password.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPasswordComponent extends BaseFormComponent<IUserPassword> {
  private readonly _userDataService = inject(UserDataService);

  InputType: typeof InputType = InputType;

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { oldPassword, newPassword } = this.form.getRawValue();
    this._userDataService.updateOwnPassword({ oldPassword, newPassword }).subscribe();
  }

  protected override setGroup(): FormGroup<IUserPassword> {
    return this._formBuilder.group<IUserPassword>({
      oldPassword: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
      newPassword: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
      repeatedPassword: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, CustomValidators.equal('newPassword')],
      }),
    });
  }
}
