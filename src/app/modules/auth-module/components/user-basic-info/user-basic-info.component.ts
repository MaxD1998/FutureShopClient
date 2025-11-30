import { afterNextRender, ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../components/shared/button/button.component';
import { InputComponent } from '../../../../components/shared/input/input.component';
import { BaseFormComponent } from '../../../../core/bases/base-form.component';
import { UserDataService } from '../../core/data-service/user.data-service';
import { UserBasicInfoFormDto } from '../../core/dtos/user/user-basic-info.form-dto';

interface IUserBasicInfo {
  email: FormControl<string>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
}

@Component({
  selector: 'app-user-basic-info',
  imports: [ReactiveFormsModule, TranslateModule, InputComponent, ButtonComponent],
  templateUrl: './user-basic-info.component.html',
  styleUrl: './user-basic-info.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBasicInfoComponent extends BaseFormComponent<IUserBasicInfo> {
  private readonly _userDataService = inject(UserDataService);

  userBasicInfo = input.required<UserBasicInfoFormDto>();

  constructor() {
    super();

    afterNextRender(() => {
      const { email, firstName, lastName } = this.userBasicInfo();
      this.form.patchValue({ email, firstName, lastName });
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, firstName, lastName } = this.form.getRawValue();
    this._userDataService.updateOwnBasicInfo({ email, firstName, lastName }).subscribe();
  }

  protected override setGroup(): FormGroup<IUserBasicInfo> {
    return this._formBuilder.group<IUserBasicInfo>({
      email: new FormControl<string>('', { nonNullable: true }),
      firstName: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
      lastName: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    });
  }
}
