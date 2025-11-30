import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UserCompanyDetailsResponseFormDto } from '../../../../core/dtos/user-company-details/user-company-details.response-form-dto';

@Component({
  selector: 'app-user-company-details',
  imports: [],
  templateUrl: './user-company-details.component.html',
  styleUrl: './user-company-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCompanyDetailsComponent {
  userCompanyDetails = input.required<UserCompanyDetailsResponseFormDto[]>();
}
