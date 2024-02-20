import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BaseFormComponent } from '../../core/bases/base-form.component';
import { ClientRoute } from '../../core/constants/client-routes/client.route';
import { LoginDto } from '../../core/dtos/login-dto';
import { ButtonLayout } from '../../core/enums/button-layout';
import { IconType } from '../../core/enums/icon-type';
import { AuthService } from '../../core/services/auth.service';
import { ButtonComponent } from '../shared/button/button.component';
import { IconComponent } from '../shared/icon/icon.component';
import { InputComponent } from '../shared/input/input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [TranslateModule, ReactiveFormsModule, InputComponent, ButtonComponent, IconComponent],
})
export class LoginComponent extends BaseFormComponent {
  ButtonLayout: typeof ButtonLayout = ButtonLayout;
  IconType: typeof IconType = IconType;

  constructor(private _authService: AuthService, private _router: Router, formBuilder: FormBuilder) {
    super(formBuilder);
  }

  login(): void {
    if (!this.form.valid) {
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

  protected setFormControls(): {} {
    return {
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    };
  }
}
