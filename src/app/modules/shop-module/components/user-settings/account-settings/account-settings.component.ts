import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserBasicInfoComponent } from '../../../../auth-module/components/user-basic-info/user-basic-info.component';
import { UserPasswordComponent } from '../../../../auth-module/components/user-password/user-password.component';
import { UserBasicInfoFormDto } from '../../../../auth-module/core/dtos/user/user-basic-info.form-dto';

@Component({
  selector: 'app-account-settings',
  imports: [UserPasswordComponent, UserBasicInfoComponent],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountSettingsComponent {
  private readonly _activatedRoute = inject(ActivatedRoute);

  userBasicInfo: UserBasicInfoFormDto = this._activatedRoute.snapshot.data['userBasicInfo'];
}
