import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../../components/shared/button/button.component';
import { InputDateComponent } from '../../../../../components/shared/input-date/input-date.component';
import { InputComponent } from '../../../../../components/shared/input/input.component';
import { BaseFormComponent } from '../../../../../core/bases/base-form.component';
import { ClientRoute } from '../../../../../core/constants/client-routes/client.route';
import { InputType } from '../../../../../core/enums/input-type';
import { AuthService } from '../../../../../core/services/auth.service';
import { CustomValidators } from '../../../../../core/utils/custom-validators';
import { UserInputDto } from '../../../../shop-module/core/dtos/user-input.dto';

interface IRegisterForm {
  dateOfBirth: FormControl<Date | null>;
  email: FormControl<string>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  password: FormControl<string>;
  phoneNumber: FormControl<string | null>;
  repeatPassword: FormControl<string>;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TranslateModule, InputComponent, ButtonComponent, InputDateComponent],
})
export class RegisterComponent extends BaseFormComponent<IRegisterForm> {
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);

  InputType: typeof InputType = InputType;

  register(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const dto: UserInputDto = {
      dateOfBirth: value.dateOfBirth!,
      email: value.email,
      firstName: value.firstName,
      lastName: value.lastName,
      password: value.password,
      phoneNumber: value.phoneNumber ?? undefined,
    };

    this._authService.register(dto, () => {
      this._router.navigateByUrl(ClientRoute.main);
    });
  }

  protected override setGroup(): FormGroup<IRegisterForm> {
    return this._formBuilder.group<IRegisterForm>({
      dateOfBirth: new FormControl(null, [Validators.required]),
      email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
      firstName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, CustomValidators.notWhiteCharackters],
      }),
      lastName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, CustomValidators.notWhiteCharackters],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, CustomValidators.notWhiteCharackters],
      }),
      phoneNumber: new FormControl(null),
      repeatPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, CustomValidators.equal('password')],
      }),
    });
  }
}
