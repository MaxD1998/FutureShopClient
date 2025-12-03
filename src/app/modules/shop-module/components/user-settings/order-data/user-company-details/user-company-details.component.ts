import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../../../components/shared/button/button.component';
import { DialogWindowComponent } from '../../../../../../components/shared/modals/dialog-window/dialog-window.component';
import { ButtonLayout } from '../../../../../../core/enums/button-layout';
import { UserCompanyDetailsDataService } from '../../../../core/data-services/user-company-details.data-service';
import { UserCompanyDetailsResponseFormDto } from '../../../../core/dtos/user-company-details/user-company-details.response-form-dto';
import { AddUserCompanyDetailsComponent } from './add-user-company-details/add-user-company-details.component';

@Component({
  selector: 'app-user-company-details',
  imports: [TranslateModule, ButtonComponent, DialogWindowComponent, AddUserCompanyDetailsComponent],
  templateUrl: './user-company-details.component.html',
  styleUrl: './user-company-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCompanyDetailsComponent {
  private readonly _userCompanyDetailsDataService = inject(UserCompanyDetailsDataService);

  userCompanyDetails = model.required<UserCompanyDetailsResponseFormDto[]>();

  ButtonLayout: typeof ButtonLayout = ButtonLayout;

  userCompanyDetailsId = signal<string | undefined>(undefined);
  isDialogActive = signal<boolean>(false);

  edit(dto: UserCompanyDetailsResponseFormDto): void {
    this.userCompanyDetailsId.set(dto.id);
    this.isDialogActive.set(true);
  }

  delete(id: string): void {
    this._userCompanyDetailsDataService.delete(id).subscribe({
      next: () => {
        const array = this.userCompanyDetails().filter(x => x.id !== id);
        this.userCompanyDetails.set(Array.from(array));
      },
    });
  }
}
