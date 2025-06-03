import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../../components/shared/button/button.component';
import { IconComponent } from '../../../../../components/shared/icon/icon.component';
import { InputComponent } from '../../../../../components/shared/input/input.component';
import { BaseFormComponent } from '../../../../../core/bases/base-form.component';
import { ClientRoute } from '../../../../../core/constants/client-routes/client.route';
import { ButtonLayout } from '../../../../../core/enums/button-layout';
import { IconType } from '../../../../../core/enums/icon-type';
import { InputType } from '../../../../../core/enums/input-type';
import { AuthService } from '../../../../../core/services/auth.service';
import { LoginDto } from '../../../core/dtos/login.dto';

interface ILoginForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, ReactiveFormsModule, InputComponent, ButtonComponent, IconComponent],
})
export class LoginComponent extends BaseFormComponent<ILoginForm> {
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);

  ButtonLayout: typeof ButtonLayout = ButtonLayout;
  IconType: typeof IconType = IconType;
  InputType: typeof InputType = InputType;

  login(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const dto: LoginDto = {
      email: value.email!,
      password: value.password!,
    };

    this._authService.login(dto, () => {
      this._router.navigateByUrl(ClientRoute.main);
    });
  }

  navigateToRegister(): void {
    this._router.navigateByUrl(`${ClientRoute.authModule}/${ClientRoute.auth}/${ClientRoute.register}`);
  }

  protected setGroup(): FormGroup<ILoginForm> {
    return this._formBuilder.group<ILoginForm>({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
    });
  }
}
