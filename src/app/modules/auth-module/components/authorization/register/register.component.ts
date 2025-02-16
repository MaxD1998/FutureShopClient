import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
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

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TranslateModule, InputComponent, ButtonComponent, InputDateComponent],
})
export class RegisterComponent extends BaseFormComponent {
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);

  InputType: typeof InputType = InputType;

  register(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const controls = this.form.controls;
    const dto: UserInputDto = {
      dateOfBirth: controls['dateOfBirth'].value,
      email: controls['email'].value,
      firstName: controls['firstName'].value,
      lastName: controls['lastName'].value,
      password: controls['password'].value,
      phoneNumber: controls['phoneNumber'].value,
    };

    this._authService.register(dto, () => {
      this._router.navigateByUrl(ClientRoute.main);
    });
  }

  protected override setFormControls(): {} {
    return {
      dateOfBirth: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      firstName: [null, [Validators.required, CustomValidators.notWhiteCharackters]],
      lastName: [null, [Validators.required, CustomValidators.notWhiteCharackters]],
      password: [null, [Validators.required, CustomValidators.notWhiteCharackters]],
      phoneNumber: [null],
      repeatPassword: [null, [Validators.required, CustomValidators.equal('password')]],
    };
  }
}
