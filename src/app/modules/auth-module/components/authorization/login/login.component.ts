import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
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

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, ReactiveFormsModule, InputComponent, ButtonComponent, IconComponent],
})
export class LoginComponent extends BaseFormComponent {
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

    const controls = this.form.controls;
    const dto: LoginDto = {
      email: controls['email'].value,
      password: controls['password'].value,
    };

    this._authService.login(dto, () => {
      this._router.navigateByUrl(ClientRoute.main);
    });
  }

  navigateToRegister(): void {
    this._router.navigateByUrl(`${ClientRoute.authModule}/${ClientRoute.auth}/${ClientRoute.register}`);
  }

  protected setFormControls(): {} {
    return {
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    };
  }
}
