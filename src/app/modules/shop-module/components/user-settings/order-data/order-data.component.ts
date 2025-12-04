import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserCompanyDetailsResponseFormDto } from '../../../core/dtos/user-company-details/user-company-details.response-form-dto';
import { UserDeliveryAddressResponseFormDto } from '../../../core/dtos/user-delivery-address/user-delivery-address.response-form.dto';
import { UserCompanyDetailsComponent } from './user-company-details/user-company-details.component';
import { UserDeliveryAddressComponent } from './user-delivery-address/user-delivery-address.component';

@Component({
  selector: 'app-order-data',
  imports: [UserDeliveryAddressComponent, UserCompanyDetailsComponent],
  templateUrl: './order-data.component.html',
  styleUrl: './order-data.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDataComponent {
  private readonly _activatedRoute = inject(ActivatedRoute);

  private readonly _orderData = this._activatedRoute.snapshot.data['orderData'];

  userCompanyDetails: UserCompanyDetailsResponseFormDto[] = this._orderData['userCompanyDetails'];
  userDeliveryAddresses: UserDeliveryAddressResponseFormDto[] = this._orderData['userDeliveryAddresses'];
}
